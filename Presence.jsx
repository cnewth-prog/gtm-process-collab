// Presence bar: shows current signed-in user + others who have edited, plus
// Activity log + Reset buttons. No more name-entry dialog — identity comes
// from Firebase auth.

const Avatar = ({ name, size = 24, title }) => (
  <span title={title || name} style={{
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: size, height: size, borderRadius: 9999,
    background: colorFromName(name || "?"), color: "#fff",
    fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 700,
    fontSize: Math.round(size * 0.4), letterSpacing: 0.3,
    border: "2px solid #fff",
  }}>{initials(name)}</span>
);

const PresenceBar = ({ user, currentUser, editors, onOpenLog, onSignOut, onReset }) => {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "8px 14px", background: "#fff",
      border: "1px solid #dedfe2", borderRadius: 9999,
    }}>
      <Avatar name={user} size={28}/>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, lineHeight: 1.1 }}>
        <span style={{ fontSize: 12, color: "#8a8e99" }}>Signed in as</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1e2024" }}
          title={currentUser?.email}>{user}</span>
      </div>
      <button onClick={onSignOut}
        title="Sign out"
        style={{
          background: "transparent", border: "none", color: "#6f7480",
          fontSize: 11, cursor: "pointer", padding: "2px 6px",
        }}>Sign out</button>
      {editors.length > 1 && (
        <>
          <div style={{ width: 1, alignSelf: "stretch", background: "#dedfe2" }}/>
          <div style={{ display: "flex", alignItems: "center" }}>
            {editors.slice(0, 5).map((n, i) => (
              <div key={n} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                <Avatar name={n} size={26} title={`${n} has made edits`}/>
              </div>
            ))}
            {editors.length > 5 && (
              <span style={{
                marginLeft: -8, width: 26, height: 26, borderRadius: 9999,
                background: "#f4f5f6", color: "#5a5e68", border: "2px solid #fff",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
              }}>+{editors.length - 5}</span>
            )}
          </div>
          <span style={{ fontSize: 11.5, color: "#6f7480" }}>
            {editors.length} {editors.length === 1 ? "editor" : "editors"}
          </span>
        </>
      )}
      <div style={{ width: 1, alignSelf: "stretch", background: "#dedfe2" }}/>
      <button onClick={onOpenLog} style={miniBtn()}>Activity</button>
      <button onClick={onReset} style={{ ...miniBtn(), color: "#b41823" }}>Reset</button>
    </div>
  );
};

function miniBtn() {
  return {
    background: "transparent", border: "none",
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 500,
    color: "#1e61f0", cursor: "pointer", padding: "4px 8px", borderRadius: 6,
  };
}

Object.assign(window, { Avatar, PresenceBar });
