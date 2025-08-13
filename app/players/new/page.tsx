"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NewPlayerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.from("players").insert([{ name, surname }]);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/players");
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Nuevo jugador</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Apellido</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={surname}
            onChange={e => setSurname(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Crear"}
        </button>
      </form>
    </main>
  );