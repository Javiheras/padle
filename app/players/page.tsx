"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Player = {
  id: number;
  name: string;
  surname: string;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "surname">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      const { data, error } = await supabase.from("players").select("*");
      if (!error && data) setPlayers(data);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres borrar este jugador?")) return;
    await supabase.from("players").delete().eq("id", id);
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = players
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.surname.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (a[sortBy] < b[sortBy]) return -1 * dir;
      if (a[sortBy] > b[sortBy]) return 1 * dir;
      return 0;
    });

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Jugadores</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => router.push("/players/new")}
        >
          Nuevo jugador
        </button>
      </div>
      <input
        className="border px-2 py-1 mb-4 rounded"
        placeholder="Buscar por nombre o apellido"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="min-w-full border mt-2">
        <thead>
          <tr>
            <th
              className="cursor-pointer border px-4 py-2"
              onClick={() => {
                setSortBy("name");
                setSortDir(
                  sortBy === "name" && sortDir === "asc" ? "desc" : "asc"
                );
              }}
            >
              Nombre{" "}
              {sortBy === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="cursor-pointer border px-4 py-2"
              onClick={() => {
                setSortBy("surname");
                setSortDir(
                  sortBy === "surname" && sortDir === "asc" ? "desc" : "asc"
                );
              }}
            >
              Apellido{" "}
              {sortBy === "surname" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            filtered.map((player) => (
              <tr key={player.id}>
                <td className="border px-4 py-2">{player.name}</td>
                <td className="border px-4 py-2">{player.surname}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-600 hover:underline mr-2"
                    onClick={() => router.push(`/players/${player.id}/edit`)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(player.id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No hay jugadores.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}