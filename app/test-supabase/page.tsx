"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TestSupabase() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("players")
        .select("*");

      if (error) {
        console.error("Error:", error);
      } else {
        setData(data);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Datos de Supabase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
