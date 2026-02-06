'use client';

import { useState } from 'react';
import { getStudentsAtRisk } from '@/app/actions/reports';
import Link from 'next/link';

export default function StudentsAtRiskPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (p: number = 1) => {
    setLoading(true);
    setError('');
    const result = await getStudentsAtRisk({ search, page: p, limit });
    if (result.success) {
      setData(result.data ?? []);
      setPagination(result.pagination ?? { page: 1, limit: 10, total: 0, pages: 0 });
      setPage(p);
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

        <h1 className="text-3xl font-bold text-black mb-8">Estudiantes en Riesgo</h1>
        <h2 className="text-3l font-bold text-black mb-8">Alumnos con bajo rendimiento o inasistencia para acciones preventivas inmediatas.</h2>


        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-md">
          <div className="flex gap-3 flex-wrap items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Búsqueda (nombre o email)
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: María López, maria@email.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
              />
            </div>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <button
              onClick={() => handleSearch(1)}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {data.length > 0 ? (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-100 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Estudiante
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Programa
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Promedio
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Asistencia
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Razón
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr key={idx} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.estudiante}</td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300 text-sm">{row.correo}</td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.programa}</td>
                      <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.curso}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded ${row.promedio < 70 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                          {row.promedio}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded ${row.porcentaje_asistencia < 80 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}`}>
                          {row.porcentaje_asistencia}%
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-300">{row.razon_riesgo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Página {pagination.page} de {pagination.pages} (Total: {pagination.total})
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSearch(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handleSearch(page + 1)}
                  disabled={page >= pagination.pages}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {loading ? 'Cargando...' : 'Realiza una búsqueda para ver resultados'}
          </div>
        )}
      </div>
    </main>
  );
}
