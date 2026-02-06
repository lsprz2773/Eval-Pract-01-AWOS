-- VIEW 1 - vw_courses_performance
CREATE OR REPLACE VIEW vw_courses_performance AS
SELECT 
    c.name AS curso, 
    g.term AS grupo, 
    ROUND(AVG(gr.partial1 + gr.partial2 + gr.final)/3 , 2) AS promedio,
    COUNT(
        CASE
            WHEN ((gr.partial1 + gr.partial2 + gr.final)/3) < 70
            THEN '1'
        END
    ) AS alumnos_reprobados
FROM courses c
INNER JOIN groups g ON g.course_id = c.id
INNER JOIN enrollments e ON e.group_id = g.id
INNER JOIN grades gr ON gr.enrollment_id = e.id
GROUP BY c.name, g.term
ORDER BY curso;


-- VIEW 2 - vw_teacher_load
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT 
    t.id AS id_docente,
    t.name AS docente,
    g.term AS grado,
    COUNT(DISTINCT g.id) AS grupos_actuales,
    COUNT(DISTINCT e.student_id) AS alumnos_totales,
    COALESCE(ROUND(AVG((gr.partial1 + gr.partial2 + gr.final)/3), 2),0) AS promedio_general
FROM teachers t
LEFT JOIN groups g ON g.teacher_id = t.id
LEFT JOIN enrollments e ON e.group_id = g.id
LEFT JOIN grades gr ON gr.enrollment_id = e.id
GROUP BY t.id, t.name, g.term
HAVING COUNT(DISTINCT g.id) > 0
ORDER BY grupos_actuales DESC;


-- VIEW 3 - vw_students_at_risk
CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH students_metrics AS (
    SELECT
        s.id AS id_estudiante,
        s.name AS estudiante,
        s.email AS correo,
        s.program AS programa,
        c.name AS curso,
        COALESCE((gr.partial1 + gr.partial2 + gr.final)/3, 0) AS promedio_actual,
        COUNT(a.id) AS total_asistencias,
        COUNT(
            CASE
                WHEN a.status = 'Present' THEN 1
            END
        ) AS conteo_asistencias
    FROM students s
    INNER JOIN enrollments e ON s.id = e.student_id
    INNER JOIN groups g ON g.id = e.group_id
    INNER JOIN courses c ON c.id = g.course_id
    LEFT JOIN grades gr ON gr.enrollment_id = e.id
    LEFT JOIN attendance a on a.enrollment_id = e.id
    GROUP BY s.id, s.name, s.email, s.program, c.name, gr.partial1, gr.partial2, gr.final
), risk_calc AS (
    SELECT
        *,
        CASE
            WHEN total_asistencias > 0 THEN ROUND((conteo_asistencias::numeric/total_asistencias) * 100, 2)
            ELSE 100
        END AS porcentaje_asistencia
    FROM students_metrics
)

SELECT
    id_estudiante,
    estudiante,
    correo,
    programa,
    curso,
    ROUND(promedio_actual, 2) AS promedio,
    porcentaje_asistencia,
    CASE
        WHEN promedio_actual < 70 AND porcentaje_asistencia < 80 THEN 'Asistencia y promedio criticos'
        WHEN promedio_actual < 70 THEN 'Promedio bajo'
        WHEN porcentaje_asistencia < 80 THEN 'Asistencia baja'
    END AS razon_riesgo
FROM risk_calc
WHERE promedio_actual < 70 OR porcentaje_asistencia < 80;


-- VIEW 4 - vw_attendance_by_group
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT 
    c.name AS curso,
    t.name AS profesor,
    g.term AS grupo,
    COUNT(DISTINCT e.student_id) AS estudiantes_inscritos,
    COALESCE(
        ROUND( 
            (COUNT(
                CASE WHEN a.status = 'Present' THEN 1 END)::numeric / NULLIF(COUNT(a.id),0)
            ) * 100 ,2), 0) 
    AS porcentaje_asistencia
FROM groups g
INNER JOIN courses c ON c.id = g.course_id
INNER JOIN teachers t ON t.id = g.teacher_id
LEFT JOIN enrollments e ON e.group_id = g.id
LEFT JOIN attendance a ON a.enrollment_id = e.id
GROUP BY
    c.name,
    t.name,
    g.term
ORDER BY g.term ASC;



-- VIEW 5 - vw_rank_students


