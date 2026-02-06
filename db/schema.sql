--LIMPIEZA DE TABLAS Y TIPOS
DROP TABLE IF EXISTS attendance, grades, enrollments, groups, courses, teachers, students CASCADE;
DROP TYPE IF EXISTS program_name, attendance_status CASCADE;

--Creacion de tipos

CREATE TYPE program_name AS ENUM ('Software','Ciencias','Fisica');
CREATE TYPE attendance_status AS ENUM ('Presente','Ausente','Retardo','Permiso');
CREATE TYPE term_grade AS ENUM ('1','2','3','4','5','6','7','8','9','10');

--Creacion de tablas principales
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    program program_name NOT NULL,
    enrollment_year DATE NOT NULL
);

CREATE TABLE teachers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE courses(
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    credits SMALLINT NOT NULL
);

--Creacion de tablas de relacion
CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    term term_grade NOT NULL
);

CREATE TABLE enrollments(
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP NOT NULL
);

CREATE TABLE grades(
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
    partial1 DECIMAL,
    partial2 DECIMAL,
    final DECIMAL
);

CREATE TABLE attendance(
    id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL
);