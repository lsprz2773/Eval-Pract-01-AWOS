'use client';

import { useState } from 'react';
import { getCoursesPerformance } from '@/app/actions/reports';
import Link from 'next/link';

export default function CoursesPerformancePage() {
  const [term, setTerm] = useState('1');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFilter = async () => {
    setLoading(true);
    setError('');
    const result = await getCoursesPerformance({ term });
    if (result.success) {
      setData(result.data ?? []);
    } else {
      setError(result.error || 'Error al cargar datos');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          ← Volver al panel
        </Link>

        <h1 className="text-3xl font-bold text-black mb-8">Rendimiento de Cursos</h1>
        <h2 className="text-3l font-bold text-black mb-8">Identifica cursos con bajo rendimiento académico para priorizar intervenciones pedagógicas.</h2>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-md">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Término (obligatorio)
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                  <option key={t} value={String(t)}>
                    Grupo {t}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleFilter}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Filtrar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {data.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Curso
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Alumnos Reprobados
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.curso}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.grupo}</td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {row.promedio}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        {row.alumnos_reprobados}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.length === 0 && !loading && !error && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Selecciona un término y haz clic en "Filtrar" para ver resultados
          </div>
        )}
      </div>
    </main>
  );
}
