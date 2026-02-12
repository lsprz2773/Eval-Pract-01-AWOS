import { z } from 'zod';

// esquemas de validación para filtros y búsquedas
export const coursesPerformanceSchema = z.object({
  term: z.string().min(1, 'Term es obligatorio').regex(/^([1-9]|10)$/, 'Term debe ser entre 1 y 10'),
});

export const rankStudentsSchema = z.object({
  program: z.enum(['Software', 'Ciencias', 'Fisica'], {
    message: 'Program debe ser Software, Ciencias o Fisica',
  }),
});

export const studentsAtRiskSchema = z.object({
  search: z.string().optional().default(''),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const teacherLoadSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const attendanceByGroupSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CoursesPerformanceInput = z.infer<typeof coursesPerformanceSchema>;
export type RankStudentsInput = z.infer<typeof rankStudentsSchema>;
export type StudentsAtRiskInput = z.infer<typeof studentsAtRiskSchema>;
export type TeacherLoadInput = z.infer<typeof teacherLoadSchema>;
export type AttendanceByGroupInput = z.infer<typeof attendanceByGroupSchema>;