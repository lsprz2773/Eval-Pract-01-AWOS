-- VIEW 1 - vw_courses_performance
-- GRAIN: Curso por temrino academico
-- METRICAS:
--  promedio: calificacion media de los alumnos que estan inscritos en esa materia
--  alumnos_reprobados: cantidad de estudiantes con promedio menor a 70

-- QUERIES DE VERIFICACION:
--  El promedio de la vista coincide con el cálculo manual total (puede cambiar debido al redondeo)
--      SELECT AVG((partial1 + partial2 + final) / 3) FROM grades;
--      Para verificar: SELECT AVG(promedio) FROM vw_courses_performance;

--  El conteo de reprobados es exacto
--      SELECT COUNT(*) FROM grades WHERE (partial1 + partial2 + final) / 3 < 70;
--      Para verificar: SELECT SUM(alumnos_reprobados) FROM vw_courses_performance;

-- VIEW:
CREATE OR REPLACE VIEW vw_courses_performance AS
SELECT 
    c.name AS curso, 
    g.term AS grupo, 
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final)/3), 2) AS promedio,
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
-- GRAIN: maestro por grupo
-- METRICAS:
--  grupos_actuales: conteo de grupos asignados al maestro
--  alumnos_totales: conteo de alumnos atendidos por maestro
--  promedio_general: promedio acumulado de todos los alumnos del maestro

-- QUERIES DE VERIFICACION:
--  Coinciden los alumnos totales del docente 1 y grupo 1
--      SELECT COUNT(DISTINCT student_id) FROM enrollments WHERE group_id IN (SELECT id FROM groups WHERE teacher_id = 1);
--      Para verificar: SELECT alumnos_totales FROM vw_teacher_load WHERE id_docente = 1 AND grado = '1';

--  El docente 1 tiene realmente N grupos
--      SELECT COUNT(*) FROM groups WHERE teacher_id = 1;
--      Para verificar: SELECT SUM(grupos_actuales) FROM vw_teacher_load WHERE id_docente = 1;

-- VIEW:
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
-- GRAIN: Estudiante por curso
-- METRICAS:
--  promedio: nota actual de alumno por curso
--  porcentaje_asistencia: relacion entre asistencisa y total de asistencias del curso

-- QUERIE DE VERIFICACION:
-- El filtro de riesgo funciona (mismo total de filas que la vista)
--      SELECT COUNT(*) FROM grades WHERE (partial1 + partial2 + final) / 3 < 70;
--      Para verificar: SELECT COUNT(*) FROM vw_students_at_risk;

-- VIEW:
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
                WHEN a.status = 'Presente' THEN 1
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
--GRAIN: Grupo
--METRICAS:
--  estudiantes_inscritos: total de alumnos dentro del grupo
--  porcentaje_asistencia: relacion entre asistencia del grupo y total de asistencias del curso

-- QUERIE DE VERIFICACION:
--  El número de estudiantes_inscritos en el grupo con id 1 es correcto
--      SELECT COUNT(*) FROM enrollments WHERE group_id = 1;
--      Para verificar: SELECT COUNT(grupo) FROM vw_attendance_by_group WHERE grupo = '1';

--  VIEW:
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT 
    c.name AS curso,
    t.name AS profesor,
    g.term AS grupo,
    COUNT(DISTINCT e.student_id) AS estudiantes_inscritos,
    COALESCE(
        ROUND( 
            (COUNT(
                CASE WHEN a.status = 'Presente' THEN 1 END)::numeric / NULLIF(COUNT(a.id),0)
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
-- GRAIN: Estudiante por grupo
-- METRICAS:
--  promedio_global: media de las materia que el alumno cursa
--  posicion_rank: puesto que el alumno ocupa entre todos
--  fila: numero secuencial

--QUERIES DE VERIFICACION:
--  La posicion_rank 1 tiene el promedio_global más alto
--  SELECT * FROM vw_rank_students WHERE posicion_rank = 1 ORDER BY promedio_global DESC LIMIT 1;

-- VIEW:
CREATE OR REPLACE VIEW vw_rank_students AS
SELECT 
    s.name AS nombre_estudiante,
    s.program AS programa,
    g.term AS grupo,
    ROUND(AVG((gr.partial1 + gr.partial2 + gr.final) / 3), 2) AS promedio_global,
    RANK() OVER (
        PARTITION BY s.program, g.term 
        ORDER BY AVG((gr.partial1 + gr.partial2 + gr.final) / 3) DESC
    ) AS posicion_rank,
    ROW_NUMBER() OVER (
        PARTITION BY s.program, g.term 
        ORDER BY AVG((gr.partial1 + gr.partial2 + gr.final) / 3) DESC
    ) AS fila
FROM students s
INNER JOIN enrollments e ON s.id = e.student_id
INNER JOIN groups g ON e.group_id = g.id
INNER JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY s.id, s.name, s.program, g.term;

