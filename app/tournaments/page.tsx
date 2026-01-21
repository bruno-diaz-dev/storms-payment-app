"use client";

export const dynamic = 'force-dynamic'

import { useState } from "react";
import Link from "next/link";

type Tournament = {
  id: number;
  name: string;
  league: string;
  season: string;
  fee: number;
};

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: 1,
      name: "Sabatino",
      league: "Flagtastic",
      season: "2025",
      fee: 480,
    },
    {
      id: 2,
      name: "Zeus",
      league: "AGSFFL",
      season: "2025",
      fee: 780,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    league: "",
    season: "",
    fee: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function addTournament() {
    if (!form.name || !form.league || !form.season || !form.fee) return;

    setTournaments([
      ...tournaments,
      {
        id: Date.now(),
        name: form.name,
        league: form.league,
        season: form.season,
        fee: Number(form.fee),
      },
    ]);

    setForm({ name: "", league: "", season: "", fee: "" });
  }

  return (
    <div className="min-h-screen bg-purple-700">
      {/* HEADER */}
      <header className="bg-purple-800 text-white px-6 py-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Storms · Admin</span>
        <Link href="/" className="text-sm underline">
          Volver
        </Link>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto mt-10 bg-white rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Torneos</h1>

        {/* FORM */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <input
            name="name"
            placeholder="Nombre del torneo"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="league"
            placeholder="Liga"
            value={form.league}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="season"
            placeholder="Temporada"
            value={form.season}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="fee"
            type="number"
            placeholder="Cuota"
            value={form.fee}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        </div>

        <button
          onClick={addTournament}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition mb-8"
        >
          Agregar torneo
        </button>

        {/* TABLA */}
        {tournaments.length === 0 ? (
          <p className="text-gray-500">No hay torneos todavía</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Torneo</th>
                <th className="py-2">Liga</th>
                <th className="py-2">Temporada</th>
                <th className="py-2 text-right">Cuota</th>
              </tr>
            </thead>
            <tbody>
              {tournaments.map((t) => (
                <tr key={t.id} className="border-b last:border-0">
                  <td className="py-2">{t.name}</td>
                  <td className="py-2">{t.league}</td>
                  <td className="py-2">{t.season}</td>
                  <td className="py-2 text-right">${t.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
