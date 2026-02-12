import { Router } from "express";
import * as controller from '../controllers/views-controller.js';

const router = Router();

router.get('/courses-performance', controller.getCoursesPerformance);
router.get('/teacher-load', controller.getTeacherLoad);
router.get('/students-at-risk', controller.getStudentsAtRisk);
router.get('/attendance-by-group', controller.getAttendanceByGroup);
router.get('/rank-students', controller.getRankStudents);