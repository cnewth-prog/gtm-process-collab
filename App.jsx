const App = () => {
  const auth = useAuth();
  const store = useStore(auth.user);
  const { state, user, resetAll, syncStatus, syncError, activity } = store;

  const [motion, setMotion] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [highlightedId, setHighlightedId] = React.useState(null);
  const [view, setView] = React.useState("overview"); // overview | matrix
  const [logOpen, setLogOpen] = React.useState(false);

  // Derive owner list per gate from its workflows
  const workflowOwners = (g) => {
    const set = new Set();
    (g.workflows || []).forEach(w => { if (w.owner) set.add(w.owner); });
    return Array.from(set);
  };

  const gates = state?.gates || [];

  const visibleGates = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return gates.filter(g => {
      if (motion && g.motion !== motion) return false;
      const owners = workflowOwners(g);
      if (role && !owners.includes(role)) return false;
      if (q) {
        const hay = [
          g.stage, g.trigger,
          ...(g.workflows || []).map(w => w.text),
          ...(g.workflows || []).filter(w => w.output).map(w => w.output.name),
          ...owners, g.note || "",
        ].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [gates, motion, role, search]);

  const counts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = gates.filter(g => {
      if (motion && g.motion !== motion) return false;
      if (q) {
        const owners = workflowOwners(g);
        const hay = [g.stage, g.trigger, ...(g.workflows || []).map(w => w.text), ...(g.workflows || []).filter(w => w.output).map(w => w.output.name), ...owners].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const roleCounts = {};
    window.ROLES.forEach(r => {
      roleCounts[r] = base.filter(g => workflowOwners(g).includes(r)).length;
    });
    return { total: gates.length, visible: visibleGates.length, role: roleCounts };
  }, [gates, motion, search, visibleGates]);

  const editors = React.useMemo(() => {
    const set = new Set();
    gates.forEach(g => {
      (g.workflows || []).forEach(w => { if (w.by && w.by !== "Seed") set.add(w.by); });
    });
    return Array.from(set);
  }, [gates]);

  const onJump = React.useCallback((id) => {
    setHighlightedId(id);
    const el = document.getElementById(`detail-${id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setTimeout(() => setHighlightedId(cur => cur === id ? null : cur), 2200);
  }, []);

  const reset = () => { setMotion(null); setRole(null); setSearch(""); };

  const gatesByMotion = window.MOTIONS.map(m => ({
    motion: m,
    gates: visibleGates.filter(g => g.motion === m.id),
  }));

  // ---- Gating: loading → sign in → wrong domain → loading state → main app ----

  if (auth.status === "loading") {
    return <FullScreenMessage title="Connecting…" subtitle="Checking your session"/>;
  }
  if (auth.status !== "signed-in") {
    return <SignInScreen auth={auth}/>;
  }
  if (!state) {
    if (syncError) {
      return <FullScreenMessage title="Can't reach the database"
        subtitle={syncError} showRetry/>;
    }
    return <FullScreenMessage title="Loading shared state…"
      subtitle="Syncing with Firebase"/>;
  }

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 32px 80px" }}>
      {/* Header */}
      <header style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="assets/logo-mark-blue.svg" alt="Amplitude" style={{ height: 22 }}/>
            <span className="section-label" style={{ color: "#6f7480" }}>
              GTM Orchestration · Customer Engagement Model
            </span>
            <SyncPill status={syncStatus}/>
          </div>
          <PresenceBar user={user} currentUser={auth.user}
            editors={editors}
            onOpenLog={() => setLogOpen(true)}
            onSignOut={auth.signOut}
            onReset={resetAll}/>
        </div>
        <h1 style={{
          fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
          fontSize: 32, lineHeight: 1.15, letterSpacing: "-0.5px", color: "#1e2024",
          margin: 0, marginBottom: 10,
        }}>End-to-end process flow</h1>
        <p style={{ fontSize: 15, lineHeight: 1.55, color: "#5a5e68", maxWidth: 860, margin: 0 }}>
          Every stage transition is a trigger. Each one lists the sub-workflows to execute, with
          their primary owner and optional asset output. Filter by motion or role. Switch to the
          role matrix to see per-workflow ownership across all gates. Edit any gate to add,
          change owners, or adjust — all changes sync live across the pod.
        </p>
      </header>

      {/* Filter bar */}
      <div style={{ marginBottom: 20 }}>
        <FilterBar
          motion={motion} setMotion={setMotion}
          role={role} setRole={setRole}
          search={search} setSearch={setSearch}
          counts={counts} reset={reset}
        />
      </div>

      {/* View tabs */}
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        padding: 4, background: "#f4f5f6", borderRadius: 9999,
        width: "fit-content", marginBottom: 16,
      }}>
        {[
          { id: "overview", label: "Overview table" },
          { id: "matrix", label: "Role matrix" },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            style={{
              height: 30, padding: "0 14px", borderRadius: 9999,
              background: view === t.id ? "#fff" : "transparent",
              border: "none",
              color: view === t.id ? "#1e2024" : "#5a5e68",
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500,
              cursor: "pointer",
              boxShadow: view === t.id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            }}>{t.label}</button>
        ))}
      </div>

      {/* Overview / Matrix */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <h2 style={{
            fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
            fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.3px", color: "#1e2024", margin: 0,
          }}>
            {view === "overview" ? "Process flow overview" : "Gate × role matrix"}
          </h2>
          <span style={{ color: "#8a8e99", fontSize: 13 }}>
            {view === "overview"
              ? "All gates end-to-end · click any row to jump to its detail card"
              : "Every gate crossed with every role · filled cells = ownership · click to jump"}
          </span>
        </div>
        {view === "overview"
          ? <OverviewTable gates={visibleGates} onJump={onJump} roleFilter={role}/>
          : <Matrix gates={visibleGates} onJump={onJump} activeRole={role} activeMotion={motion}/>}
      </section>

      {/* Detail */}
      <section style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{
            fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
            fontSize: 20, lineHeight: 1.2, letterSpacing: "-0.3px", color: "#1e2024", margin: 0,
          }}>Gate detail</h2>
          <span style={{ color: "#8a8e99", fontSize: 13 }}>
            Click <strong style={{ color: "#1e2024" }}>Edit</strong> on any gate to add, edit, or delete sub-workflows
          </span>
        </div>

        {gatesByMotion.map(({ motion: m, gates }) => (
          <DetailSection key={m.id} motion={m} gates={gates}
            highlightedId={highlightedId} roleFilter={role} store={store}/>
        ))}
      </section>

      {/* Legend */}
      <footer style={{
        marginTop: 48, padding: "20px 24px",
        border: "1px solid #dedfe2", borderRadius: 12, background: "#fafbfc",
      }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Legend</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, rowGap: 10 }}>
          {Object.entries(window.ASSET_KINDS).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 24, textAlign: "center", fontSize: 14, color: "#6f7480" }}>{v.glyph}</span>
              <span style={{ fontSize: 13, color: "#1e2024" }}>{v.label}</span>
            </div>
          ))}
          <div style={{ width: 1, background: "#dedfe2", alignSelf: "stretch" }}/>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#e77427", fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 13, color: "#1e2024" }}>Stage-transition trigger</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 700,
              color: "#0f5350", letterSpacing: 0.5,
              padding: "3px 6px", borderRadius: 3, background: "#e3f0ef",
            }}>PS</span>
            <span style={{ fontSize: 13, color: "#1e2024" }}>Professional Services owns primary workflow</span>
          </div>
        </div>
        <p style={{
          marginTop: 14, fontSize: 11.5, color: "#8a8e99", lineHeight: 1.5, maxWidth: 820,
        }}>
          <strong style={{ color: "#5a5e68" }}>Live sync:</strong> all changes persist to a shared
          Firebase database and stream to every signed-in teammate in real time. Every edit is stamped
          with your name and appears in the Activity drawer. Access is restricted to @amplitude.com accounts.
        </p>
      </footer>

      <ActivityLog activity={activity} open={logOpen} onClose={() => setLogOpen(false)}/>
    </div>
  );
};

// --- Small helper components used only by App ---

const FullScreenMessage = ({ title, subtitle, showRetry }) => (
  <div style={{
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#fafbfc", padding: 24,
  }}>
    <div style={{ textAlign: "center", maxWidth: 440 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9999, margin: "0 auto 16px",
        border: "3px solid #dedfe2", borderTopColor: "#1e61f0",
        animation: "spin 0.9s linear infinite",
      }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{
        fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
        fontSize: 18, color: "#1e2024", marginBottom: 6,
      }}>{title}</div>
      <div style={{ fontSize: 13, color: "#6f7480", lineHeight: 1.5 }}>{subtitle}</div>
      {showRetry && (
        <button onClick={() => location.reload()} style={{
          marginTop: 16, height: 34, padding: "0 14px", borderRadius: 8,
          background: "#1e61f0", color: "#fff", border: "none",
          fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 500,
          cursor: "pointer",
        }}>Retry</button>
      )}
    </div>
  </div>
);

const SyncPill = ({ status }) => {
  const cfg = {
    connecting: { dot: "#fac400", label: "Connecting", bg: "#fff8ea", border: "#fce4c7" },
    synced:     { dot: "#33a66c", label: "Live",        bg: "#e8f3ec", border: "#c7e3d2" },
    error:      { dot: "#b41823", label: "Offline",    bg: "#fae2e2", border: "#f3b5b5" },
  }[status] || { dot: "#8a8e99", label: "…", bg: "#f4f5f6", border: "#dedfe2" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 9999,
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      fontSize: 11, fontWeight: 600, color: "#1e2024", letterSpacing: 0.2,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 9999, background: cfg.dot,
        ...(status === "connecting" ? { animation: "pulse 1.2s ease-in-out infinite" } : {}),
      }}/>
      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      {cfg.label}
    </span>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
