'use client';

import { useState } from 'react';
import { getRankStudents } from '@/app/actions/reports';
import Link from 'next/link';

export default function RankStudentsPage() {
  const [program, setProgram] = useState<'Software' | 'Ciencias' | 'Fisica'>('Software');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFilter = async () => {
    setLoading(true);
    setError('');
    const result = await getRankStudents({ program });
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

        <h1 className="text-3xl font-bold text-black mb-8">Rankings de Estudiantes</h1>
        <h2 className="text-3l font-bold text-black mb-8">Top estudiantes por programa para reconocimiento y apoyo.</h2>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-8 shadow-md">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programa (obligatorio)
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value as 'Software' | 'Ciencias' | 'Fisica')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-slate-700 dark:text-white"
              >
                <option value="Software">Software</option>
                <option value="Ciencias">Ciencias</option>
                <option value="Fisica">Física</option>
              </select>
            </div>
            <button
              onClick={handleFilter}
              disabled={loading}
              className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
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
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Programa
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Promedio Global
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded font-bold ${
                        row.posicion_rank === 1
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : row.posicion_rank === 2
                          ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                          : row.posicion_rank === 3
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        #{row.posicion_rank}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.nombre_estudiante}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.programa}</td>
                    <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{row.grupo}</td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">
                        {row.promedio_global}
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
            Selecciona un programa y haz clic en "Filtrar" para ver resultados
          </div>
        )}
      </div>
    </main>
  );
}
