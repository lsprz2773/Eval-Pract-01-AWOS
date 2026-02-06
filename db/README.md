**Índices**

- **idx_students_search_name_email**:  acelera búsquedas y filtros que consultan por `name` y/o `email`

- **idx_students_program_year**: acelera agregaciones, filtros y ordenamientos por programa y año de ingreso (por ejemplo para cálculos de promedio y rankings)

- **idx_groups_course_teacher**: acelera consultas que filtran o unen por curso y docente, mejora joins entre `groups` y tablas relacionadas
 
**EXPLAIN (salidas proporcionadas)**

Consulta 1 (para `idx_students_search_name_email`):

```sql
EXPLAIN ANALYZE
SELECT id, name, email
FROM students
WHERE name = 'María López';
```

EXPLAIN recibido:

```
QUERY PLAN
----------------------------------------------------------------------------------------------------
 Seq Scan on students  (cost=0.00..1.19 rows=1 width=738) (actual time=0.016..0.018 rows=1 loops=1)
	 Filter: ((name)::text = 'María López'::text)
	 Rows Removed by Filter: 14
 Planning Time: 0.087 ms
 Execution Time: 0.035 ms
(5 rows)
```

Consulta 2 (para `idx_students_program_year`):

```sql
EXPLAIN ANALYZE
SELECT program, COUNT(*)
FROM students
WHERE program = 'Software' AND enrollment_year = '2023-01-01'
GROUP BY program;
```

EXPLAIN recibido:

```
 QUERY PLAN
--------------------------------------------------------------------------------------------------------
 GroupAggregate  (cost=0.00..1.24 rows=1 width=12) (actual time=0.018..0.019 rows=0 loops=1)
	 ->  Seq Scan on students  (cost=0.00..1.23 rows=1 width=4) (actual time=0.017..0.018 rows=0 loops=1)
				 Filter: ((program = 'Software'::program_name) AND (enrollment_year = '2023-01-01'::date))
				 Rows Removed by Filter: 15
 Planning Time: 0.734 ms
 Execution Time: 0.069 ms
(6 rows)
```

Observacion:
- Ambas salidas muestran que las consultas usaron "Seq Scan" sobre `students`, por lo que en estas consultas el optimizador no aprovechó los índices definidos. Esto puede ocurrir si la tabla es pequeña.


**Seguridad (roles)**

- El archivo [db/roles.sql] crea el usuario `app_user`, quita privilegios por defecto sobre el esquema `public` y concede `SELECT`  solo sobre las views (por ejemplo `vw_courses_performance`, `vw_teacher_load`). También quita la opcion de usar `SELECT` sobre tablas para impedir acceso directo.

- Cómo verificarlo (pasos y comandos):

	1) Prueba de conexión como `app_user` (debe funcionar en vistas, fallar en tablas):

    Para ello tienes que abrir PSQL con docker:

    ```bash
    docker exec -it ev_pr01_awos psql -U app_user -d ev_pr01 
    ```

    Dentro de PSQL ejecuta los siguientes comandos:

```bash
"SELECT * FROM vw_courses_performance LIMIT 1;"
# -> Muestra la tabla

"SELECT * FROM students LIMIT 1;"
# -> debe fallar con "permission denied" (sin SELECT sobre tablas)
```
