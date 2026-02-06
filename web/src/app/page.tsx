export default function Home() {
  const reports = [
    {
      title: 'Rendimiento de Cursos',
      description: 'Promedio y estudiantes reprobados por curso y término.',
      href: '/reports/courses-performance',
    },
    {
      title: 'Carga Docente',
      description: 'Grupos, alumnos totales y promedio general por docente.',
      href: '/reports/teacher-load',
    },
    {
      title: 'Estudiantes en Riesgo',
      description: 'Estudiantes con bajo promedio o asistencia deficiente.',
      href: '/reports/students-at-risk',
    },
    {
      title: 'Asistencia por Grupo',
      description: 'Porcentaje de asistencia por grupo y profesor.',
      href: '/reports/attendance-by-group',
    },
    {
      title: 'Rankings de Estudiantes',
      description: 'Ranking de estudiantes por programa y grupo.',
      href: '/reports/rank-students',
    },
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col gap-6">
          {reports.map((report) => (
            <a
              key={report.href}
              href={report.href}
              className={`bg-blue-400 rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group`}
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-white">
                {report.title}
              </h2>
              <p className="text-sm opacity-90 group-hover:opacity-100">
                {report.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-semibold">
                <span>Ver reporte</span>
                <svg
                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
