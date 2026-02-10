# SISTEMA DE REPORTES ACADEMICOS

Esta aplicacion transforma datos transaccionales en reportes academicos a traves de 5 vistas creadas con PostgreSQL.
- Cuenta con reportes con filtrado y busqueda para una consulta detallada que cubre las necesidades escolares.

## Reportes
- 1. Rendimiento por cursos
- 2. Carga de grupos y alumnados de docentes por grupos
- 3. Estudiantes en riesgo por baja asistencia o baja calificacion
- 4. Asistencia grupal
- 5. Ranking estudiantil por grupo

#### Tecnologias usadas
- Next.js
- PostgreSQL
- Docker/Docker Compose

## ANTES DE EJECUTAR EL PROYECTO:
- Abre una terminal de Git Bash
- Entra a la carpeta del servicio web con:
```bash
cd web
```

- Como siguiente paso instala las dependencias de Next con:
```bash
npm instal
```

- Regresa a la carpeta raiz con:
```bash
cd ..
```

- Y finalmente ejecuta: 
```bash
docker compose up --build
``` 
### IMPORTANTE
Se requiere tener creado el archivo .env con las credenciales correctas
en la RAIZ del proyecto, al mismo nivel del archivo docker-compose.yml