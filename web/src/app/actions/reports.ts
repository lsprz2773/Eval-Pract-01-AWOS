'use server';

import { query } from '@/lib/db';
import {
  coursesPerformanceSchema,
  rankStudentsSchema,
  studentsAtRiskSchema,
  teacherLoadSchema,
  attendanceByGroupSchema,
  type CoursesPerformanceInput,
  type RankStudentsInput,
  type StudentsAtRiskInput,
  type TeacherLoadInput,
  type AttendanceByGroupInput,
} from '@/lib/validations';

// acción 1: vw_courses_performance
export async function getCoursesPerformance(input: CoursesPerformanceInput) {
  try {
    const validated = coursesPerformanceSchema.parse(input);
    const result = await query(
      `SELECT curso, grupo, promedio, alumnos_reprobados 
       FROM vw_courses_performance 
       WHERE grupo = $1 
       ORDER BY curso`,
      [validated.term]
    );
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error fetching courses performance:', error);
    return { success: false, error: 'Error al obtener rendimiento de cursos' };
  }
}

// acción 2: vw_teacher_load
export async function getTeacherLoad(input: TeacherLoadInput) {
  try {
    const validated = teacherLoadSchema.parse(input);
    const offset = (validated.page - 1) * validated.limit;

    const dataResult = await query(
      `SELECT id_docente, docente, grado, grupos_actuales, alumnos_totales, promedio_general 
       FROM vw_teacher_load 
       ORDER BY grupos_actuales DESC 
       LIMIT $1 OFFSET $2`,
      [validated.limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(DISTINCT id_docente) as total FROM vw_teacher_load`
    );

    const total = countResult.rows[0]?.total || 0;

    return {
      success: true,
      data: dataResult.rows,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total: parseInt(total),
        pages: Math.ceil(parseInt(total) / validated.limit),
      },
    };
  } catch (error) {
    console.error('Error fetching teacher load:', error);
    return { success: false, error: 'Error al obtener carga docente' };
  }
}

// acción 3: vw_students_at_risk
export async function getStudentsAtRisk(input: StudentsAtRiskInput) {
  try {
    const validated = studentsAtRiskSchema.parse(input);
    const offset = (validated.page - 1) * validated.limit;
    const searchTerm = `%${validated.search}%`;

    const dataResult = await query(
      `SELECT id_estudiante, estudiante, correo, programa, curso, promedio, porcentaje_asistencia, razon_riesgo 
       FROM vw_students_at_risk 
       WHERE estudiante ILIKE $1 OR correo ILIKE $1
       ORDER BY promedio ASC 
       LIMIT $2 OFFSET $3`,
      [searchTerm, validated.limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(*) as total FROM vw_students_at_risk 
       WHERE estudiante ILIKE $1 OR correo ILIKE $1`,
      [searchTerm]
    );

    const total = countResult.rows[0]?.total || 0;

    return {
      success: true,
      data: dataResult.rows,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total: parseInt(total),
        pages: Math.ceil(parseInt(total) / validated.limit),
      },
    };
  } catch (error) {
    console.error('Error fetching students at risk:', error);
    return { success: false, error: 'Error al obtener estudiantes en riesgo' };
  }
}

// acción 4: vw_attendance_by_group
export async function getAttendanceByGroup(input: AttendanceByGroupInput) {
  try {
    const validated = attendanceByGroupSchema.parse(input);
    const offset = (validated.page - 1) * validated.limit;

    const dataResult = await query(
      `SELECT curso, profesor, grupo, estudiantes_inscritos, porcentaje_asistencia 
       FROM vw_attendance_by_group 
       ORDER BY grupo ASC 
       LIMIT $1 OFFSET $2`,
      [validated.limit, offset]
    );

    const countResult = await query(
      `SELECT COUNT(DISTINCT grupo) as total FROM vw_attendance_by_group`
    );

    const total = countResult.rows[0]?.total || 0;

    return {
      success: true,
      data: dataResult.rows,
      pagination: {
        page: validated.page,
        limit: validated.limit,
        total: parseInt(total),
        pages: Math.ceil(parseInt(total) / validated.limit),
      },
    };
  } catch (error) {
    console.error('Error fetching attendance by group:', error);
    return { success: false, error: 'Error al obtener asistencia por grupo' };
  }
}

// acción 5: vw_rank_student
export async function getRankStudents(input: RankStudentsInput) {
  try {
    const validated = rankStudentsSchema.parse(input);
    const result = await query(
      `SELECT nombre_estudiante, programa, grupo, promedio_global, posicion_rank, fila 
       FROM vw_rank_students 
       WHERE programa = $1 
       ORDER BY grupo ASC, posicion_rank ASC`,
      [validated.program]
    );
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Error fetching rank students:', error);
    return { success: false, error: 'Error al obtener rankings de estudiantes' };
  }
}
