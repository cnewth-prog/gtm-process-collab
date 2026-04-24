// Unified workflow rows. Each row: a sub-workflow + optional output asset.

const KIND_OPTIONS = [
  { value: "doc", label: "📄 Generic asset" },
  { value: "sfdc", label: "🗃 SFDC record" },
  { value: "legal", label: "📜 Legal / contract" },
  { value: "tech", label: "⚙ Technical artifact" },
  { value: "milestone", label: "🎯 Kickoff / milestone" },
];

const ByStamp = ({ by, at, small }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    fontSize: small ? 10 : 10.5, color: "#8a8e99", whiteSpace: "nowrap",
  }}>
    <Avatar name={by} size={14}/>
    <span>{by} · {relTime(at)}</span>
  </span>
);

function iconBtn(color = "#8a8e99") {
  return {
    width: 24, height: 24, borderRadius: 6,
    background: "transparent", border: "1px solid transparent",
    color, fontSize: 13, cursor: "pointer", flex: "0 0 24px",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    transition: "all .12s",
  };
}

// Read-only row: workflow text with optional output asset chip
const WorkflowRow = ({ wf, index, onEdit, onDelete, editing, roleFilter }) => {
  const hasOutput = !!wf.output;
  const kind = hasOutput ? window.ASSET_KINDS[wf.output.kind] : null;
  const ownerHighlight = roleFilter && wf.owner === roleFilter;
  const ownerDim = roleFilter && wf.owner !== roleFilter;
  return (
    <li style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      padding: "10px 12px", borderRadius: 8,
      background: hasOutput ? "#fafbfc" : "transparent",
      border: hasOutput ? "1px solid #ededf0" : "1px solid transparent",
      opacity: ownerDim ? 0.5 : 1,
      transition: "opacity .15s",
    }}>
      <span style={{
        flex: "0 0 20px", height: 20, display: "inline-flex",
        alignItems: "center", justifyContent: "center",
        borderRadius: 9999, background: "#ebf5ff", color: "#1e61f0",
        fontSize: 10.5, fontWeight: 700, marginTop: 1,
      }}>{index + 1}</span>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: "#1e2024" }}>{wf.text}</div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {/* Owner pill */}
          {wf.owner && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 10px 3px 3px", borderRadius: 9999,
              background: ownerHighlight ? "#d5e9ff" : "#ebf5ff",
              border: ownerHighlight ? "1px solid #1e61f0" : "1px solid transparent",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 9999,
                background: "#1e61f0", color: "#fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 8, fontWeight: 700,
              }}>{wf.owner.slice(0, 2).toUpperCase()}</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#1e2024" }}>{wf.owner}</span>
            </span>
          )}

          {/* Output asset chip */}
          {hasOutput && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "3px 10px 3px 8px",
              background: "#fff", border: "1px solid #dedfe2", borderRadius: 9999,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                fontSize: 10, fontWeight: 600, color: "#6f7480",
                textTransform: "uppercase", letterSpacing: 0.4,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                Produces
              </span>
              <span style={{ fontSize: 12, color: "#6f7480" }}>{kind.glyph}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#1e2024" }}>{wf.output.name}</span>
            </span>
          )}
        </div>

        {wf.by && wf.by !== "Seed" && <ByStamp by={wf.by} at={wf.at}/>}
      </div>

      {editing && (
        <div style={{ display: "flex", gap: 2 }}>
          <button title="Edit" onClick={onEdit} style={iconBtn("#6f7480")}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ebf5ff"; e.currentTarget.style.color = "#1e61f0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6f7480"; }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button title="Delete" onClick={onDelete} style={iconBtn("#8a8e99")}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fae2e2"; e.currentTarget.style.color = "#b41823"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8a8e99"; }}>✕</button>
        </div>
      )}
    </li>
  );
};

// Edit / Add form — same shape for both
const WorkflowForm = ({ initial, onSubmit, onCancel, submitLabel, gateOwners }) => {
  const [text, setText] = React.useState(initial?.text || "");
  const [owner, setOwner] = React.useState(initial?.owner || gateOwners?.[0] || window.ROLES[0]);
  const [hasOutput, setHasOutput] = React.useState(!!initial?.output);
  const [kind, setKind] = React.useState(initial?.output?.kind || "doc");
  const [name, setName] = React.useState(initial?.output?.name || "");
  const valid = text.trim() && owner && (!hasOutput || name.trim());
  const submit = () => {
    if (!valid) return;
    onSubmit({ text, owner, output: hasOutput ? { kind, name } : null });
  };
  return (
    <li style={{
      listStyle: "none", padding: "12px", borderRadius: 8,
      background: "#f5faff", border: "1px solid #b1d3ff",
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      <input
        autoFocus
        value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Sub-workflow / task…"
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && valid) submit(); if (e.key === "Escape") onCancel(); }}
        style={{
          height: 32, padding: "0 10px",
          border: "1px solid #dedfe2", borderRadius: 6, background: "#fff",
          font: "400 13px/1.2 'IBM Plex Sans', sans-serif", color: "#1e2024", outline: "none",
        }}/>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#5a5e68", fontWeight: 500, minWidth: 90 }}>
          Primary owner
        </span>
        <select value={owner} onChange={(e) => setOwner(e.target.value)}
          style={{
            flex: 1, height: 30, border: "1px solid #dedfe2", borderRadius: 6,
            font: "500 12px 'IBM Plex Sans', sans-serif", padding: "0 8px",
            background: "#fff", color: "#1e2024", cursor: "pointer",
          }}>
          {window.ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <label style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
        fontSize: 12, color: "#1e2024", userSelect: "none",
      }}>
        <input type="checkbox" checked={hasOutput}
          onChange={(e) => setHasOutput(e.target.checked)}
          style={{ accentColor: "#1e61f0", cursor: "pointer" }}/>
        <span>This workflow <strong style={{ color: "#1e61f0" }}>produces an asset</strong></span>
      </label>

      {hasOutput && (
        <div style={{ display: "flex", gap: 6, paddingLeft: 22 }}>
          <select value={kind} onChange={(e) => setKind(e.target.value)}
            style={{
              height: 30, border: "1px solid #dedfe2", borderRadius: 6,
              font: "500 11px 'IBM Plex Sans', sans-serif", padding: "0 6px",
              background: "#fff", color: "#1e2024", cursor: "pointer",
            }}>
            {KIND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <input
            value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && valid) submit(); if (e.key === "Escape") onCancel(); }}
            placeholder="Asset name…"
            style={{
              flex: 1, height: 30, padding: "0 10px",
              border: "1px solid #dedfe2", borderRadius: 6, background: "#fff",
              font: "400 12.5px/1.2 'IBM Plex Sans', sans-serif", color: "#1e2024", outline: "none",
            }}/>
        </div>
      )}

      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{
          height: 28, padding: "0 12px", borderRadius: 6,
          background: "transparent", border: "1px solid #dedfe2",
          color: "#1e2024", fontSize: 12, fontWeight: 500, cursor: "pointer",
        }}>Cancel</button>
        <button onClick={submit} disabled={!valid} style={{
          height: 28, padding: "0 12px", borderRadius: 6,
          background: valid ? "#1e61f0" : "#dedfe2",
          color: valid ? "#fff" : "#a8abb3",
          border: "none", fontSize: 12, fontWeight: 500,
          cursor: valid ? "pointer" : "not-allowed",
        }}>{submitLabel}</button>
      </div>
    </li>
  );
};

const DetailCard = ({ gate, id, highlighted, roleFilter, store }) => {
  const [editing, setEditing] = React.useState(false);
  const [adding, setAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState(null);

  const assetCount = gate.workflows.filter(w => w.output).length;

  // Derive owner breakdown from workflows: each unique owner with their workflow count.
  // Order by first appearance so it mirrors the numbered workflow list.
  const ownerBreakdown = React.useMemo(() => {
    const map = new Map();
    gate.workflows.forEach(w => {
      if (!w.owner) return;
      if (!map.has(w.owner)) map.set(w.owner, []);
      map.get(w.owner).push(w);
    });
    return Array.from(map.entries()).map(([role, wfs]) => ({ role, count: wfs.length }));
  }, [gate.workflows]);

  const gateOwners = ownerBreakdown.map(o => o.role);

  return (
    <div id={id}
      style={{
        scrollMarginTop: 24,
        border: `1px solid ${editing ? "#1e61f0" : highlighted ? "#1e61f0" : "#dedfe2"}`,
        borderRadius: 12, background: "#fff",
        boxShadow: highlighted ? "0 4px 16px rgba(30,97,240,0.15)" :
                   editing ? "0 2px 8px rgba(30,97,240,0.08)" : "none",
        transition: "box-shadow .3s, border-color .3s",
        overflow: "hidden",
      }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid #ededf0",
        display: "flex", alignItems: "flex-start", gap: 14,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 120 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{
              fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
              fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.3px", color: "#1e2024",
            }}>{gate.stage}</span>
            {gate.ps && <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 700,
              color: "#0f5350", letterSpacing: 0.5,
              padding: "3px 6px", borderRadius: 3, background: "#e3f0ef",
            }}>PS</span>}
          </div>
          <MotionBadge motionId={gate.motion} small/>
        </div>
        <div style={{
          flex: 1, display: "flex", gap: 10, alignItems: "flex-start",
          padding: "10px 14px", background: "#fffaf2",
          border: "1px solid #fce4c7", borderRadius: 8,
        }}>
          <span style={{ color: "#e77427", fontSize: 16, lineHeight: 1.2 }}>⚡</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="section-label" style={{ color: "#9d5125", fontSize: 10 }}>Trigger</div>
            <div style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 500,
              color: "#1e2024", lineHeight: 1.4,
            }}>{gate.trigger}</div>
          </div>
        </div>
        <button
          onClick={() => { setEditing(!editing); setAdding(false); setEditingId(null); }}
          style={{
            height: 30, padding: "0 12px", borderRadius: 8,
            background: editing ? "#d5e9ff" : "#fff",
            border: `1px solid ${editing ? "#1e61f0" : "#dedfe2"}`,
            color: editing ? "#1e61f0" : "#1e2024",
            fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 500,
            cursor: "pointer", whiteSpace: "nowrap",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
          {editing ? (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Done</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> Edit</>
          )}
        </button>
      </div>

      {/* Body — 2 columns: workflows (with inline asset output) | owners */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 0.3fr", gap: 0 }}>
        {/* Workflows */}
        <div style={{ padding: "18px 20px", borderRight: "1px solid #ededf0" }}>
          <div className="section-label" style={{
            marginBottom: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <span>Sub-workflows</span>
            <span style={{ color: "#c2c4ca" }}>·</span>
            <span style={{ color: "#8a8e99", letterSpacing: 0 }}>
              {gate.workflows.length} total · {assetCount} produce assets
            </span>
          </div>
          <ul style={{
            listStyle: "none", margin: 0, padding: 0,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {gate.workflows.map((w, i) => (
              editingId === w.id
                ? <WorkflowForm key={w.id} initial={w} gateOwners={gateOwners}
                    submitLabel="Save"
                    onCancel={() => setEditingId(null)}
                    onSubmit={(data) => { store.updateWorkflow(gate.id, w.id, data); setEditingId(null); }}/>
                : <WorkflowRow key={w.id} wf={w} index={i} editing={editing} roleFilter={roleFilter}
                    onEdit={() => { setEditingId(w.id); setAdding(false); }}
                    onDelete={() => store.deleteWorkflow(gate.id, w.id)}/>
            ))}
            {editing && adding && (
              <WorkflowForm submitLabel="Add" gateOwners={gateOwners}
                onCancel={() => setAdding(false)}
                onSubmit={(data) => { store.addWorkflow(gate.id, data); setAdding(false); }}/>
            )}
            {editing && !adding && (
              <li style={{ listStyle: "none", marginTop: 4 }}>
                <button onClick={() => { setAdding(true); setEditingId(null); }}
                  style={{
                    width: "100%", padding: "10px 12px",
                    background: "#fff", border: "1px dashed #c2c4ca", borderRadius: 8,
                    color: "#1e61f0", fontSize: 12.5, fontWeight: 500,
                    cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f5faff"; e.currentTarget.style.borderColor = "#1e61f0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#c2c4ca"; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  Add sub-workflow
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Owners — derived from workflow owners */}
        <div style={{ padding: "18px 20px" }}>
          <div className="section-label" style={{ marginBottom: 10 }}>Owners on this gate</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ownerBreakdown.map(({ role: r, count }) => {
              const highlight = roleFilter === r;
              const dim = roleFilter && !highlight;
              return (
                <div key={r} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 10px", borderRadius: 8,
                  background: highlight ? "#d5e9ff" : dim ? "#f4f5f6" : "#ebf5ff",
                  border: highlight ? "1px solid #1e61f0" : "1px solid transparent",
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 9999,
                    background: highlight ? "#1e61f0" : dim ? "#c2c4ca" : "#1e61f0",
                    color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700,
                  }}>{r.slice(0, 2).toUpperCase()}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: dim ? "#8a8e99" : "#1e2024", flex: 1 }}>{r}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: dim ? "#c2c4ca" : "#6f7480",
                    padding: "1px 6px", borderRadius: 9999, background: "#fff",
                    border: "1px solid #dedfe2",
                  }}>{count}</span>
                </div>
              );
            })}
            {ownerBreakdown.length === 0 && (
              <div style={{ fontSize: 12, color: "#8a8e99", fontStyle: "italic", padding: "6px 2px" }}>
                No owners assigned yet
              </div>
            )}
            {gate.note && (
              <div style={{
                marginTop: 6, padding: "8px 10px",
                background: "#fff8ea", border: "1px solid #fce4c7", borderRadius: 6,
                fontSize: 11.5, color: "#9d5125", lineHeight: 1.4,
              }}>{gate.note}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailSection = ({ motion, gates, highlightedId, roleFilter, store }) => {
  if (gates.length === 0) return null;
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{
        display: "flex", alignItems: "baseline", gap: 12,
        paddingBottom: 10, borderBottom: `2px solid ${window.MOTION_COLORS[motion.id]}`,
      }}>
        <span style={{
          width: 10, height: 10, borderRadius: 9999,
          background: window.MOTION_COLORS[motion.id], alignSelf: "center",
        }}/>
        <h2 style={{
          fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
          fontSize: 22, lineHeight: 1.1, letterSpacing: "-0.3px", color: "#1e2024", margin: 0,
        }}>{motion.label}</h2>
        <span style={{ color: "#8a8e99", fontSize: 13, fontWeight: 500 }}>
          {gates.length} {gates.length === 1 ? "gate" : "gates"}
        </span>
        <span style={{ marginLeft: "auto", color: "#6f7480", fontSize: 12, fontStyle: "italic" }}>
          {motion.range}
        </span>
      </div>
      {gates.map(g => (
        <DetailCard key={g.id} id={`detail-${g.id}`} gate={g}
          highlighted={highlightedId === g.id} roleFilter={roleFilter} store={store}/>
      ))}
    </section>
  );
};

Object.assign(window, { DetailCard, DetailSection });
