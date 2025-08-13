"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditPlayerPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayer() {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setName(data.name);
        setSurname(data.surname);
      }
      setLoading(false);
    }
    if (id) fetchPlayer();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("players").update({ name, surname }).eq("id", id);
    router.push("/players");
  };

  if (loading) return <main className="p-6">Cargando...</main>;

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Editar jugador</h1>
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
      </form>
    </main>
  );
}