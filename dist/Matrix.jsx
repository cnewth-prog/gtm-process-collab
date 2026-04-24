// RACI-style matrix: roles across top, gates down side.
// Cell shows # of workflows that role owns on that gate.
// Click a non-zero cell to jump to its detail card.

const Matrix = ({ gates, onJump, activeRole, activeMotion }) => {
  // Precompute per-gate owner counts
  const ownerCounts = React.useMemo(() => {
    const m = new Map();
    gates.forEach(g => {
      const c = {};
      g.workflows.forEach(w => {
        if (!w.owner) return;
        c[w.owner] = (c[w.owner] || 0) + 1;
      });
      m.set(g.id, c);
    });
    return m;
  }, [gates]);

  // A role is "present" if any gate has at least one workflow owned by it
  const roleHas = {};
  window.ROLES.forEach(r => {
    roleHas[r] = gates.some(g => (ownerCounts.get(g.id) || {})[r] > 0);
  });

  return (
    <div style={{
      border: "1px solid #dedfe2", borderRadius: 12, background: "#fff",
      overflow: "auto",
    }}>
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12,
      }}>
        <thead>
          <tr>
            <th style={{
              position: "sticky", left: 0, top: 0, zIndex: 3,
              background: "#fafbfc", borderBottom: "1px solid #dedfe2", borderRight: "1px solid #dedfe2",
              padding: "12px 14px", textAlign: "left", minWidth: 260,
            }}>
              <div className="section-label">Gate</div>
            </th>
            {window.ROLES.map(r => {
              const dim = !roleHas[r];
              const active = activeRole === r;
              return (
                <th key={r} style={{
                  position: "sticky", top: 0, zIndex: 2,
                  background: active ? "#ebf5ff" : "#fafbfc",
                  borderBottom: `1px solid ${active ? "#1e61f0" : "#dedfe2"}`,
                  padding: "12px 8px", textAlign: "center", minWidth: 64,
                  color: dim ? "#a8abb3" : active ? "#1e61f0" : "#1e2024",
                  fontWeight: 600, letterSpacing: 0.2,
                  whiteSpace: "nowrap",
                }}>{r}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {window.MOTIONS.map(m => {
            const motionGates = gates.filter(g => g.motion === m.id);
            if (!motionGates.length) return null;
            const colSpan = window.ROLES.length + 1;
            return (
              <React.Fragment key={m.id}>
                <tr>
                  <td colSpan={colSpan} style={{
                    padding: "10px 14px", background: "#fafbfc",
                    borderTop: "1px solid #dedfe2", borderBottom: "1px solid #ededf0",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: 9999,
                        background: window.MOTION_COLORS[m.id],
                      }}/>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "#1e2024" }}>{m.label}</span>
                      <span style={{ color: "#8a8e99", fontSize: 11, marginLeft: 4 }}>
                        {motionGates.length} {motionGates.length === 1 ? "gate" : "gates"}
                      </span>
                    </div>
                  </td>
                </tr>
                {motionGates.map(g => {
                  const counts = ownerCounts.get(g.id) || {};
                  const maxCount = Math.max(0, ...Object.values(counts));
                  return (
                    <tr key={g.id}>
                      <td onClick={() => onJump(g.id)}
                        style={{
                          position: "sticky", left: 0, zIndex: 1,
                          background: "#fff",
                          padding: "10px 14px",
                          borderBottom: "1px solid #ededf0", borderRight: "1px solid #dedfe2",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f5faff"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{
                              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500,
                              color: "#1e2024", letterSpacing: 0.3,
                              padding: "1px 6px", borderRadius: 4, background: "#f4f5f6",
                            }}>{g.stage}</span>
                            {g.ps && <span style={{
                              fontSize: 9, fontWeight: 700, color: "#0f5350", letterSpacing: 0.4,
                              padding: "2px 4px", borderRadius: 3, background: "#e3f0ef",
                            }}>PS</span>}
                          </div>
                          <div style={{
                            fontSize: 11.5, color: "#5a5e68", lineHeight: 1.35,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                          }}>{g.trigger}</div>
                        </div>
                      </td>
                      {window.ROLES.map(r => {
                        const count = counts[r] || 0;
                        const owns = count > 0;
                        const primary = owns && maxCount > 0 && count === maxCount;
                        const roleActive = activeRole === r;
                        // Saturation from count: 1 → faint, more → richer
                        const intensity = maxCount > 0 ? count / maxCount : 0;
                        return (
                          <td key={r}
                            onClick={() => owns && onJump(g.id)}
                            title={owns ? `${r} owns ${count} workflow${count === 1 ? "" : "s"} on this gate` : ""}
                            style={{
                              padding: "10px 6px",
                              borderBottom: "1px solid #ededf0",
                              textAlign: "center",
                              background: owns
                                ? (roleActive ? "#d5e9ff" : intensity > 0.66 ? "#d5e9ff" : intensity > 0.33 ? "#e3efff" : "#f0f6ff")
                                : (roleActive ? "#fafbfc" : "#fff"),
                              cursor: owns ? "pointer" : "default",
                              verticalAlign: "middle",
                            }}>
                            {owns && (
                              <div style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                width: 22, height: 22, borderRadius: 9999,
                                background: primary ? "#1e61f0" : "#fff",
                                border: primary ? "1px solid #1e61f0" : "1.5px solid #1e61f0",
                                color: primary ? "#fff" : "#1e61f0",
                                fontSize: primary ? 11 : 10.5, fontWeight: 700,
                                lineHeight: 1,
                              }}>{count}</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div style={{
        display: "flex", gap: 16, padding: "10px 14px",
        borderTop: "1px solid #dedfe2", background: "#fafbfc",
        fontSize: 11, color: "#6f7480", alignItems: "center",
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16, borderRadius: 9999,
            background: "#1e61f0", color: "#fff", fontSize: 9, fontWeight: 700,
          }}>3</span>
          Lead owner (most workflows on the gate)
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16, borderRadius: 9999,
            background: "#fff", border: "1.5px solid #1e61f0", color: "#1e61f0",
            fontSize: 9, fontWeight: 700,
          }}>1</span>
          Count = workflows owned on that gate
        </span>
        <span style={{ marginLeft: "auto" }}>Click any filled cell to jump to gate detail</span>
      </div>
    </div>
  );
};

Object.assign(window, { Matrix });
