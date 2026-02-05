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



-- VIEW 3 - vw_students_at_risk



-- VIEW 4 - vw_attendance_by_group



-- VIEW 5 - vw_rank_students


