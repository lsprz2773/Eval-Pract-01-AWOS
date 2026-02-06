-- Optimiza la búsqueda de estudiantes por nombre/email para view 3
CREATE INDEX idx_students_search_name_email ON students (name, email);

-- Optimiza los promedios y rankings por programa y periodo para view 5
CREATE INDEX idx_students_program_year ON students (program, enrollment_year);

-- Optimiza la carga docente y asistencia por grupo para views 2 y 4
CREATE INDEX idx_groups_course_teacher ON groups (course_id, teacher_id, term);