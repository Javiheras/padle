"use client";
import dynamic from "next/dynamic";
const Bracket = dynamic(() => import("react-brackets").then(m => m.Bracket), { ssr: false });
import type { RoundProps, SeedProps } from "react-brackets";
import { Seed, SeedItem, SeedTeam } from "react-brackets";

// Incluye la fecha en cada seed, pero usa renderSeedComponent para mostrarla junto al marcador
const rounds: RoundProps[] = [
  {
    title: "Cuartos de final",
    seeds: [
      {
        id: 1,
        date: "11/08/2025",
        teams: [
          { name: "Equipo A" },
          { name: "Equipo B" }
        ],
        score: [7, 6]
      },
      {
        id: 2,
        date: "11/08/2025",
        teams: [
          { name: "Equipo C" },
          { name: "Equipo D" }
        ],
        score: [2, 1]
      },
      {
        id: 3,
        date: "11/08/2025",
        teams: [
          { name: "Equipo E" },
          { name: "Equipo F" }
        ],
        score: [1, 7]
      },
      {
        id: 4,
        date: "11/08/2025",
        teams: [
          { name: "Equipo G" },
          { name: "Equipo H" }
        ],
        score: [2, 6]
      }
    ],
  },
  {
    title: "Semifinal",
    seeds: [
      {
        id: 5,
        date: "12/08/2025",
        teams: [
          { name: "Equipo A" },
          { name: "Equipo D" }
        ],
        score: [1, 2]
      },
      {
        id: 6,
        date: "12/08/2025",
        teams: [
          { name: "Equipo E" },
          { name: "Equipo H" }
        ],
        score: [0, 2]
      },
    ],
  },
  {
    title: "Final",
    seeds: [
      {
        id: 7,
        date: "13/08/2025",
        teams: [
          { name: "Equipo D" },
          { name: "Equipo H" }
        ],
        score: [2, 0]
      },
    ],
  },
  {
    title: "Campeón",
    seeds: [
      {
        id: 8,
        date: "13/08/2025",
        teams: [
          { name: "Equpo H" },
          { name: "" }
        ],
        score: [null, null]
      },
    ],
  },
];

// Componente personalizado para mostrar equipos, marcador y fecha
function CustomSeed({ seed, breakpoint, roundIndex, seedIndex }: SeedProps) {
  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 14 }}>
      <SeedItem>
        <SeedTeam>
          <div style={{ fontWeight: 600 }}>{seed.teams?.[0]?.name ?? "-"}</div>
          <div style={{ fontWeight: 600 }}>{seed.teams?.[1]?.name ?? "-"}</div>
        </SeedTeam>
        {typeof seed.score?.[0] === "number" && typeof seed.score?.[1] === "number" && (
          <div style={{ marginTop: 4, fontSize: 13 }}>
            <span style={{ fontWeight: 700 }}>{seed.score[0]}</span>
            {" - "}
            <span style={{ fontWeight: 700 }}>{seed.score[1]}</span>
          </div>
        )}
        {seed.date && (
          <div style={{ marginTop: 2, fontSize: 12, color: "#aaa" }}>
            {seed.date}
          </div>
        )}
      </SeedItem>
    </Seed>
  );
}

export default function BracketPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Eliminatorias</h1>
      <Bracket
        rounds={rounds}
        renderSeedComponent={CustomSeed}
      />
    </main>
  );
}