CREATE USER app_user WITH PASSWORD 'nextpass2773';

REVOKE ALL ON SCHEMA public FROM public;
GRANT USAGE ON SCHEMA public TO app_user;

GRANT SELECT ON vw_courses_performance TO app_user;
GRANT SELECT ON vw_teacher_load TO app_user;
GRANT SELECT ON vw_students_at_risk TO app_user;
GRANT SELECT ON vw_attendance_by_group TO app_user;
GRANT SELECT ON vw_rank_students TO app_user;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;

GRANT SELECT ON 
    vw_courses_performance,
    vw_teacher_load,
    vw_students_at_risk,
    vw_attendance_by_group,
    vw_rank_students 
TO app_user;