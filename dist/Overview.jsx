// Overview table + filter bar

const MOTION_COLORS = {
  presales: "#1e61f0",
  postsales: "#22bbb3",
  renewals: "#686ce9",
};

const MOTION_BG = {
  presales: "#ebf5ff",
  postsales: "#e3f0ef",
  renewals: "#eeeff9",
};

const AssetGlyph = ({ kind, name }) => {
  const k = window.ASSET_KINDS[kind];
  return (
    <span style={{
      display: "inline-flex", alignItems: "baseline", gap: 6,
      fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, lineHeight: 1.45, color: "#1e2024",
    }}>
      <span aria-hidden style={{
        width: 18, flex: "0 0 18px", textAlign: "center",
        fontSize: 12, color: "#6f7480", lineHeight: 1.45,
      }}>{k?.glyph}</span>
      <span>{name}</span>
    </span>
  );
};

const RolePill = ({ role, dim, count }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5, height: 20, padding: "0 8px",
    borderRadius: 9999, background: dim ? "#f4f5f6" : "#ebf5ff",
    color: dim ? "#8a8e99" : "#1e61f0",
    fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 11,
    letterSpacing: 0.2, whiteSpace: "nowrap",
  }}>
    {role}
    {typeof count === "number" && (
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        minWidth: 14, height: 14, padding: "0 4px", borderRadius: 9999,
        background: dim ? "#dedfe2" : "#1e61f0",
        color: dim ? "#8a8e99" : "#fff",
        fontSize: 9, fontWeight: 700, letterSpacing: 0,
      }}>{count}</span>
    )}
  </span>
);

const MotionBadge = ({ motionId, small }) => {
  const m = window.MOTIONS.find(x => x.id === motionId);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      height: small ? 18 : 22, padding: small ? "0 6px" : "0 8px",
      borderRadius: 9999, background: MOTION_BG[motionId], color: MOTION_COLORS[motionId],
      fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600,
      fontSize: small ? 10 : 11, letterSpacing: 0.3, textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: MOTION_COLORS[motionId] }}/>
      {m.label.split(" · ")[0]}
    </span>
  );
};

const FilterBar = ({ motion, setMotion, role, setRole, search, setSearch, counts, reset }) => {
  return (
    <div style={{
      border: "1px solid #dedfe2", borderRadius: 12, background: "#fff",
      padding: 16, display: "flex", flexDirection: "column", gap: 14,
    }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="section-label">Motion</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {window.MOTIONS.map(m => {
              const active = motion === m.id;
              return (
                <button key={m.id}
                  onClick={() => setMotion(active ? null : m.id)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    height: 32, padding: "0 12px", borderRadius: 9999,
                    background: active ? MOTION_BG[m.id] : "#fff",
                    border: `1px solid ${active ? MOTION_COLORS[m.id] : "#dedfe2"}`,
                    color: active ? MOTION_COLORS[m.id] : "#1e2024",
                    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500,
                    cursor: "pointer", transition: "all .12s",
                  }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 9999,
                    background: MOTION_COLORS[m.id],
                  }}/>
                  {m.label}
                  <span style={{
                    color: active ? MOTION_COLORS[m.id] : "#8a8e99",
                    fontWeight: 600, fontSize: 12,
                  }}>({m.count})</span>
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ width: 1, alignSelf: "stretch", background: "#dedfe2" }}/>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 280 }}>
          <div className="section-label">Role</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {window.ROLES.map(r => {
              const active = role === r;
              const c = counts.role[r] || 0;
              return (
                <button key={r}
                  onClick={() => setRole(active ? null : r)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    height: 28, padding: "0 10px", borderRadius: 9999,
                    background: active ? "#d5e9ff" : c === 0 ? "#fafbfc" : "#fff",
                    border: `1px solid ${active ? "#1e61f0" : "#dedfe2"}`,
                    color: active ? "#1e61f0" : c === 0 ? "#a8abb3" : "#1e2024",
                    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 600,
                    letterSpacing: 0.2, cursor: "pointer", transition: "all .12s",
                  }}>
                  {r}
                  <span style={{
                    color: active ? "#1e61f0" : "#8a8e99", fontWeight: 400, fontSize: 11,
                  }}>{c}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, maxWidth: 420 }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search triggers, workflows, assets…"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>}
          />
        </div>
        {(motion || role || search) && (
          <button onClick={reset} style={{
            background: "transparent", border: "none", color: "#1e61f0",
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500,
            cursor: "pointer", padding: "6px 10px", borderRadius: 6,
          }}>Reset filters</button>
        )}
        <div style={{ marginLeft: "auto", color: "#6f7480", fontSize: 12 }}>
          Showing <strong style={{ color: "#1e2024" }}>{counts.visible}</strong> of {counts.total} gates
        </div>
      </div>
    </div>
  );
};

const OverviewRow = ({ gate, onJump, roleFilter }) => {
  const [hover, setHover] = React.useState(false);
  const m = window.MOTIONS.find(x => x.id === gate.motion);
  return (
    <div
      onClick={() => onJump(gate.id)}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 1.2fr) minmax(280px, 1.4fr) minmax(240px, 1fr) minmax(140px, 0.7fr) 60px",
        gap: 16, padding: "18px 20px",
        background: hover ? "#f5faff" : "#fff",
        borderBottom: "1px solid #ededf0",
        cursor: "pointer", transition: "background .1s",
        alignItems: "start",
      }}>
      {/* Stage & trigger */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500,
            color: hover ? "#1e61f0" : "#1e2024", letterSpacing: 0.3,
            padding: "2px 8px", borderRadius: 4, background: hover ? "#ebf5ff" : "#f4f5f6",
          }}>{gate.stage}</span>
          {gate.ps && <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 700,
            color: "#0f5350", letterSpacing: 0.5,
            padding: "2px 5px", borderRadius: 3, background: "#e3f0ef",
          }}>PS</span>}
        </div>
        <div style={{
          display: "flex", gap: 6, alignItems: "flex-start",
          fontSize: 13, lineHeight: 1.45, color: "#1e2024", fontWeight: 500,
        }}>
          <span style={{ color: "#e77427", flex: "0 0 auto", fontSize: 12, marginTop: 1 }}>⚡</span>
          <span>{gate.trigger}</span>
        </div>
      </div>

      {/* Sub-workflows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {gate.workflows.slice(0, 4).map((w, i) => (
          <div key={w.id || i} style={{
            fontSize: 12.5, lineHeight: 1.45, color: "#5a5e68",
            display: "flex", gap: 6,
          }}>
            <span style={{ color: "#c2c4ca", flex: "0 0 auto" }}>·</span>
            <span>{w.text}</span>
          </div>
        ))}
        {gate.workflows.length > 4 && (
          <div style={{ fontSize: 11.5, color: "#8a8e99", paddingLeft: 12 }}>
            +{gate.workflows.length - 4} more
          </div>
        )}
      </div>

      {/* Assets produced (derived from workflows with outputs) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {gate.workflows.filter(w => w.output).map((w, i) => (
          <AssetGlyph key={w.id || i} kind={w.output.kind} name={w.output.name}/>
        ))}
      </div>

      {/* Owners — unique workflow owners, with workflow count */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignContent: "flex-start" }}>
        {(() => {
          const counts = {};
          gate.workflows.forEach(w => {
            if (!w.owner) return;
            counts[w.owner] = (counts[w.owner] || 0) + 1;
          });
          return Object.entries(counts).map(([r, n]) => (
            <RolePill key={r} role={r} count={n} dim={roleFilter && r !== roleFilter}/>
          ));
        })()}
      </div>

      {/* Jump */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        color: hover ? "#1e61f0" : "#c2c4ca", fontSize: 11, fontWeight: 600,
        letterSpacing: 0.5, textTransform: "uppercase", gap: 4,
      }}>
        Jump
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
      </div>
    </div>
  );
};

const OverviewTable = ({ gates, onJump, roleFilter }) => {
  // Group by motion
  const byMotion = window.MOTIONS.map(m => ({
    motion: m,
    rows: gates.filter(g => g.motion === m.id),
  })).filter(g => g.rows.length > 0);

  return (
    <div style={{
      border: "1px solid #dedfe2", borderRadius: 12, background: "#fff",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(280px, 1.2fr) minmax(280px, 1.4fr) minmax(240px, 1fr) minmax(140px, 0.7fr) 60px",
        gap: 16, padding: "12px 20px",
        borderBottom: "1px solid #dedfe2", background: "#fafbfc",
      }}>
        <div className="section-label">Stage & Trigger</div>
        <div className="section-label">Sub-workflows (produces asset)</div>
        <div className="section-label">Assets produced</div>
        <div className="section-label">Owners · workflows each</div>
        <div/>
      </div>

      {byMotion.map(({ motion, rows }) => (
        <div key={motion.id}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "14px 20px", background: "#fafbfc",
            borderTop: "1px solid #dedfe2", borderBottom: "1px solid #ededf0",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 9999, background: MOTION_COLORS[motion.id],
            }}/>
            <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 600, fontSize: 14,
              color: "#1e2024",
            }}>{motion.label}</span>
            <span style={{ color: "#8a8e99", fontSize: 12, fontWeight: 500 }}>
              {rows.length} {rows.length === 1 ? "gate" : "gates"}
            </span>
            <span style={{ color: "#8a8e99", fontSize: 12, fontStyle: "italic", marginLeft: "auto" }}>
              {motion.range}
            </span>
          </div>
          {rows.map(g => <OverviewRow key={g.id} gate={g} onJump={onJump} roleFilter={roleFilter}/>)}
        </div>
      ))}

      {gates.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#8a8e99" }}>
          No gates match the current filters.
        </div>
      )}
    </div>
  );
};

Object.assign(window, { FilterBar, OverviewTable, AssetGlyph, RolePill, MotionBadge, MOTION_COLORS, MOTION_BG });
