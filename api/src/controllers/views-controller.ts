import type { Request, Response } from 'express';
import * as db from '../config/db.js';
import * as schemas from '../lib/schemas/views-schema.js';
import { success } from "zod";
import { da } from "zod/locales";

export const getCoursesPerformance = async (req: Request, res: Response) => {
    try{
        const validated = schemas.coursesPerformanceSchema.parse(req.query);
        const result = await db.query(
            `SELECT curso, grupo, promedio, alumnos_reprobados 
            FROM vw_courses_performance 
            WHERE grupo = $1 
            ORDER BY curso`,
            [validated.term]
        );
        res.json({success: true, data: result.rows});
    } catch (error){
        res.status(400).json({success: false, error: 'Datos de consulta invalidos'})
    }
};

export const getTeacherLoad = async (req: Request, res: Response) => {
    try{
        const validated = schemas.teacherLoadSchema.parse(req.query);
        const offset = (validated.page -1) * validated.limit;

        const result = await db.query(
            `SELECT id_docente, docente, grado, grupos_actuales, alumnos_totales, promedio_general 
            FROM vw_teacher_load 
            ORDER BY grupos_actuales DESC 
            LIMIT $1 OFFSET $2`,
            [validated.limit, offset]
        );

        const countResult = await db.query(`SELECT COUNT(DISTINCT id_docente) as total FROM vw_teacher_load`);
        const total =  parseInt(countResult.rows[0]?.total || '0');

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: validated.page,
                limit: validated.limit,
                total,
                pages: Math.ceil(total/validated.limit),
            },
        });
    } catch(error) {
        res.status(500).json({success:false, error: 'Error al obtener la carga de docente'})
    };
}

export const getStudentsAtRisk = async (req: Request, res: Response) => {
    try{
        const validated = schemas.studentsAtRiskSchema.parse(req.query);
        const offset = (validated.page -1) * validated.limit;
        const searchTerm = `%${validated.search}%`

        const result = await db.query(
            `SELECT id_estudiante, estudiante, correo, programa, curso, promedio, porcentaje_asistencia, razon_riesgo 
            FROM vw_students_at_risk 
            WHERE estudiante ILIKE $1 OR correo ILIKE $1
            ORDER BY promedio ASC 
            LIMIT $2 OFFSET $3`,
            [searchTerm, validated.limit, offset]
        );

        const countResult = await db.query(
            `SELECT COUNT(*) as total FROM vw_students_at_risk 
            WHERE estudiante ILIKE $1 OR correo ILIKE $1`,
            [searchTerm]
        );

        const total =  parseInt(countResult.rows[0]?.total || '0');

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: validated.page,
                limit: validated.limit,
                total,
                pages: Math.ceil(total/validated.limit),
            },
        });
    } catch(error) {
        res.status(500).json({success:false, error: 'Error al obtener estudiantes en riesgo'})
    };
}

export const getAttendanceByGroup = async (req: Request, res: Response) => {
    try{
        const validated = schemas.attendanceByGroupSchema.parse(req.query);
        const offset = (validated.page -1) * validated.limit;

        const result = await db.query(
            `SELECT curso, profesor, grupo, estudiantes_inscritos, porcentaje_asistencia 
            FROM vw_attendance_by_group 
            ORDER BY grupo ASC 
            LIMIT $1 OFFSET $2`,
            [validated.limit, offset]
        );

        const countResult = await db.query(
            `SELECT COUNT(DISTINCT grupo) as total FROM vw_attendance_by_group`
        );

        const total =  parseInt(countResult.rows[0]?.total || '0');

        res.json({
            success: true,
            data: result.rows,
            pagination: {
                page: validated.page,
                limit: validated.limit,
                total,
                pages: Math.ceil(total/validated.limit),
            },
        });
    } catch(error) {
        res.status(500).json({success:false, error: 'Error al obtener asistencia por grupo'})
    };
}

export const getRankStudents = async (req: Request, res: Response) => {
    try{
        const validated = schemas.rankStudentsSchema.parse(req.query);

        const result = await db.query(
            `SELECT nombre_estudiante, programa, grupo, promedio_global, posicion_rank, fila 
            FROM vw_rank_students 
            WHERE programa = $1 
            ORDER BY grupo ASC, posicion_rank ASC`,
            [validated.program]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch(error) {
        res.status(500).json({success:false, error: 'Error al obtener rankings de estudiantes'})
    };
}