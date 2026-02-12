'use server';

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
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest(endpoint: string, params?: Record<string, any>) {
  try {
    const url = new URL(`${API_URL}/${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key].toString())
      );
    }

    const response = await fetch(url.toString(), { cache: 'no-store' });
    if (!response.ok) throw new Error(`Error en API: ${response.statusText}`);
    
    return await response.json();
  } catch (error) {
    console.error(`Fetch error [${endpoint}]:`, error);
    return { success: false, error: 'No se pudo obtener la información' };
  }
}

export async function getCoursesPerformance(input: CoursesPerformanceInput) {
  const validated = coursesPerformanceSchema.parse(input);
  return apiRequest('courses-performance', { term: validated.term });
}

export async function getTeacherLoad(input: TeacherLoadInput) {
  const validated = teacherLoadSchema.parse(input);
  return apiRequest('teacher-load', { page: validated.page, limit: validated.limit });
}


export async function getStudentsAtRisk(input: StudentsAtRiskInput) {
  const validated = studentsAtRiskSchema.parse(input);
  return apiRequest('students-at-risk', { 
    search: validated.search, 
    page: validated.page, 
    limit: validated.limit 
  });
}

export async function getAttendanceByGroup(input: AttendanceByGroupInput) {
  const validated = attendanceByGroupSchema.parse(input);
  return apiRequest('attendance-by-group', { page: validated.page, limit: validated.limit });
}


export async function getRankStudents(input: RankStudentsInput) {
  const validated = rankStudentsSchema.parse(input);
  return apiRequest('rank-students', { program: validated.program });
}
