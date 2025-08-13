import { supabase } from '@/lib/supabaseClient'

type StandingRow = {
  group_id: number
  team_id: number
  matches_played: number
  wins: number
  losses: number
  points_for: number
  points_against: number
  points: number
  team: { name: string } | null
  group: { name: string } | null
}

export const dynamic = 'force-dynamic'

async function getStandings(tournamentId: number) {
  const { data, error } = await supabase
    .from('group_standings')
    .select(`
      group_id,
      team_id,
      matches_played,
      wins,
      losses,
      points_for,
      points_against,
      points,
      team:team_id(name),
      group:group_id(name)
    `)
    .eq('tournament_id', tournamentId)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  const rows = (data ?? []) as StandingRow[]

  const byGroup: Record<string, StandingRow[]> = {}
  for (const r of rows) {
    const key = `${r.group_id}|${r.group?.name ?? ''}`
    if (!byGroup[key]) byGroup[key] = []
    byGroup[key].push(r)
  }

  const groups = Object.entries(byGroup)
    .map(([key, list]) => {
      list.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.wins !== a.wins) return b.wins - a.wins
        const diffA = (a.points_for ?? 0) - (a.points_against ?? 0)
        const diffB = (b.points_for ?? 0) - (b.points_against ?? 0)
        if (diffB !== diffA) return diffB - diffA
        const nameA = a.team?.name ?? ''
        const nameB = b.team?.name ?? ''
        return nameA.localeCompare(nameB)
      })

      const [, groupName] = key.split('|')
      return {
        groupId: list[0]?.group_id,
        groupName,
        rows: list
      }
    })
    .sort((a, b) => a.groupName.localeCompare(b.groupName))

  return groups
}

export default async function StandingsPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>
}) {
  const { tournamentId } = await params
  const groups = await getStandings(Number(tournamentId))

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 8 }}>Clasificación deportiva — Torneo #{tournamentId}</h1>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Fase de grupos (3 equipos por grupo)
      </p>

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        {groups.map((g) => (
          <section key={g.groupId} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <header style={{ padding: '12px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <strong>{g.groupName}</strong>
            </header>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#fafafa' }}>
                    <th style={th}>Pos</th>
                    <th style={thLeft}>Equipo</th>
                    <th style={th}>PJ</th>
                    <th style={th}>G</th>
                    <th style={th}>P</th>
                    <th style={th}>PF</th>
                    <th style={th}>PC</th>
                    <th style={th}>Dif</th>
                    <th style={th}>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r, idx) => {
                    const diff = (r.points_for ?? 0) - (r.points_against ?? 0)
                    // Resalta los dos primeros puestos
                    const rowStyle = idx === 0
                      ? { background: '#e0ffe0', fontWeight: 600 }
                      : idx === 1
                        ? { background: '#f0fff0' }
                        : {}
                    return (
                      <tr key={r.team_id} style={{ borderTop: '1px solid #f1f5f9', ...rowStyle }}>
                        <td style={tdCenter}>{idx + 1}</td>
                        <td style={tdLeft}>{r.team?.name ?? `Equipo ${r.team_id}`}</td>
                        <td style={tdCenter}>{r.matches_played ?? 0}</td>
                        <td style={tdCenter}>{r.wins ?? 0}</td>
                        <td style={tdCenter}>{r.losses ?? 0}</td>
                        <td style={tdCenter}>{r.points_for ?? 0}</td>
                        <td style={tdCenter}>{r.points_against ?? 0}</td>
                        <td style={tdCenter}>{diff}</td>
                        <td style={{ ...tdCenter, fontWeight: 600 }}>{r.points ?? 0}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

const th: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  textAlign: 'center',
}
const thLeft: React.CSSProperties = { ...th, textAlign: 'left' }
const tdCenter: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'center',
  fontSize: 14,
}
const tdLeft: React.CSSProperties = { ...tdCenter, textAlign: 'left' }
