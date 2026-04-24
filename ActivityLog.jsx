// Activity log drawer. Shows the last 100 edits across all users.

const ActivityLog = ({ activity, open, onClose }) => {
  if (!open) return null;

  const describe = (a) => {
    if (a.type === "add-workflow") return <>added workflow <em style={{ color: "#1e2024" }}>"{a.text}"</em></>;
    if (a.type === "del-workflow") return <>deleted workflow{a.text ? <> <em style={{ color: "#1e2024" }}>"{a.text}"</em></> : ""}</>;
    if (a.type === "edit-workflow") return <>edited a workflow</>;
    return <>made a change</>;
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "rgba(30,32,36,0.35)",
      display: "flex", justifyContent: "flex-end",
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: 420, maxWidth: "100%", height: "100%", background: "#fff",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.12)",
          display: "flex", flexDirection: "column",
        }}>
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid #dedfe2",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <h3 style={{
              margin: 0, fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif",
              fontWeight: 500, fontSize: 18, color: "#1e2024",
            }}>Activity</h3>
            <div style={{ fontSize: 11.5, color: "#8a8e99", marginTop: 2 }}>
              Last 100 edits across the pod
            </div>
          </div>
          <button onClick={onClose}
            style={{
              background: "transparent", border: "none", fontSize: 20,
              color: "#6f7480", cursor: "pointer", padding: 4,
            }}>×</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {activity.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#8a8e99", fontSize: 13 }}>
              No edits yet. Changes by anyone in the pod will appear here.
            </div>
          ) : activity.map(a => (
            <div key={a._key} style={{
              padding: "12px 22px",
              borderBottom: "1px solid #f4f5f6",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <Avatar name={a.by} size={28}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "#1e2024", lineHeight: 1.4 }}>
                  <strong>{a.by}</strong> {describe(a)}
                  {a.gate && <> <span style={{ color: "#8a8e99" }}>· gate {a.gate}</span></>}
                </div>
                <div style={{ fontSize: 11.5, color: "#8a8e99", marginTop: 2 }}>
                  {relTime(a.at)} · {new Date(a.at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { ActivityLog });
