// Firebase-backed store. Single source of truth: /state in Realtime Database.
// All edits push through the same mutation fns as before, but now write to
// Firebase instead of localStorage. Other clients get updates in real-time.
//
// Activity log is separate: /activity/<pushId> entries.

const DB_STATE_PATH = "state";
const DB_ACTIVITY_PATH = "activity";

// ---------- Seed (same as before — initial state when DB is empty) ----------
function makeInitialState() {
  const now = Date.now();
  return {
    gates: window.GATES.map(g => {
      const workflows = [];
      const maxLen = Math.max(g.tasks.length, g.assets.length);
      const ownerPool = g.owners.length ? g.owners : ["AE"];
      const pickOwner = (i) => ownerPool[i % ownerPool.length];
      for (let i = 0; i < maxLen; i++) {
        const task = g.tasks[i];
        const asset = g.assets[i];
        const owner = pickOwner(i);
        if (task && asset) {
          workflows.push({
            id: `${g.id}-w-${i}`, text: task, owner,
            output: { kind: asset.kind, name: asset.name },
            by: "Seed", at: now,
          });
        } else if (task) {
          workflows.push({
            id: `${g.id}-w-${i}`, text: task, owner, output: null,
            by: "Seed", at: now,
          });
        } else if (asset) {
          workflows.push({
            id: `${g.id}-w-${i}`, text: `Produce ${asset.name}`, owner,
            output: { kind: asset.kind, name: asset.name },
            by: "Seed", at: now,
          });
        }
      }
      // Keep a copy of gate metadata without tasks/assets
      return {
        id: g.id, motion: g.motion, stage: g.stage, trigger: g.trigger,
        ps: g.ps || false, note: g.note || null,
        workflows,
      };
    }),
  };
}

// ---------- Utilities ----------
function colorFromName(name) {
  const palette = ["#1e61f0","#22bbb3","#686ce9","#e77427","#33a66c","#d63c90","#fac400","#fc6965","#259991","#0f5350"];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}
function initials(name) {
  const parts = (name || "?").trim().split(/\s+/);
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}
function relTime(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
function shortName(user) {
  if (!user) return "Anonymous";
  // Use email local-part if displayName not set: "tom.smith@amplitude.com" -> "tom.smith"
  if (user.displayName) return user.displayName;
  if (user.email) return user.email.split("@")[0];
  return "Anonymous";
}

// ---------- Firebase store ----------
function useStore(currentUser) {
  const [state, setState] = React.useState(null); // null = not loaded yet
  const [activity, setActivity] = React.useState([]);
  const [syncStatus, setSyncStatus] = React.useState("connecting"); // connecting | synced | error
  const [syncError, setSyncError] = React.useState(null);

  // Subscribe to /state
  React.useEffect(() => {
    if (!window.firebase || !window.firebaseApp || !currentUser) return;
    const db = window.firebase.getDatabase(window.firebaseApp);
    const stateRef = window.firebase.ref(db, DB_STATE_PATH);

    // One-time: if no state yet, seed it
    window.firebase.get(stateRef).then(snap => {
      if (!snap.exists()) {
        const seed = makeInitialState();
        return window.firebase.set(stateRef, seed);
      }
    }).catch(err => {
      setSyncError(err.message);
      setSyncStatus("error");
    });

    const off = window.firebase.onValue(stateRef, (snap) => {
      const val = snap.val();
      if (val) {
        setState(val);
        setSyncStatus("synced");
      }
    }, (err) => {
      setSyncError(err.message);
      setSyncStatus("error");
    });
    return () => off();
  }, [currentUser]);

  // Subscribe to /activity (last 100)
  React.useEffect(() => {
    if (!window.firebase || !window.firebaseApp || !currentUser) return;
    const db = window.firebase.getDatabase(window.firebaseApp);
    const actRef = window.firebase.query(
      window.firebase.ref(db, DB_ACTIVITY_PATH),
      window.firebase.limitToLast(100)
    );
    const off = window.firebase.onValue(actRef, (snap) => {
      const val = snap.val();
      if (!val) { setActivity([]); return; }
      const arr = Object.entries(val).map(([k, v]) => ({ _key: k, ...v }));
      arr.sort((a, b) => (b.at || 0) - (a.at || 0));
      setActivity(arr);
    });
    return () => off();
  }, [currentUser]);

  const getDb = () => window.firebase.getDatabase(window.firebaseApp);
  const user = shortName(currentUser);

  // --- Mutations: write to Firebase, not local state ---
  // Each mutation updates the gate's workflows array and pushes an activity entry.

  const writeGate = async (gateId, updater, activityEntry) => {
    const db = getDb();
    const gatesRef = window.firebase.ref(db, `${DB_STATE_PATH}/gates`);
    const snap = await window.firebase.get(gatesRef);
    const gates = snap.val() || [];
    const next = gates.map(g => g.id === gateId ? updater(g) : g);
    await window.firebase.set(gatesRef, next);
    if (activityEntry) {
      const actRef = window.firebase.ref(db, DB_ACTIVITY_PATH);
      await window.firebase.push(actRef, { ...activityEntry, at: Date.now(), by: user });
    }
  };

  const addWorkflow = async (gateId, { text, owner, output }) => {
    if (!text || !text.trim()) return;
    const id = `w-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    const workflow = {
      id, text: text.trim(),
      owner: owner || "AE",
      output: output && output.name?.trim()
        ? { kind: output.kind, name: output.name.trim() } : null,
      by: user, at: Date.now(),
    };
    await writeGate(gateId,
      g => ({ ...g, workflows: [...(g.workflows || []), workflow] }),
      { type: "add-workflow", gate: gateId, gateStage: null, text: workflow.text, owner: workflow.owner }
    );
  };

  const updateWorkflow = async (gateId, wfId, patch) => {
    await writeGate(gateId, g => {
      const workflows = (g.workflows || []).map(w => {
        if (w.id !== wfId) return w;
        const next = { ...w };
        if (patch.text !== undefined) next.text = patch.text;
        if (patch.owner !== undefined) next.owner = patch.owner;
        if (patch.output !== undefined) {
          if (!patch.output || !patch.output.name?.trim()) next.output = null;
          else next.output = { kind: patch.output.kind, name: patch.output.name.trim() };
        }
        next.by = user;
        next.at = Date.now();
        return next;
      });
      return { ...g, workflows };
    }, { type: "edit-workflow", gate: gateId });
  };

  const deleteWorkflow = async (gateId, wfId) => {
    let removedText = null;
    await writeGate(gateId, g => {
      const workflows = (g.workflows || []).filter(w => {
        if (w.id === wfId) { removedText = w.text; return false; }
        return true;
      });
      return { ...g, workflows };
    }, { type: "del-workflow", gate: gateId, text: removedText });
  };

  const resetAll = async () => {
    if (!confirm("Reset all edits back to the original PDF content? This clears EVERYTHING for all users.")) return;
    const db = getDb();
    await window.firebase.set(window.firebase.ref(db, DB_STATE_PATH), makeInitialState());
    await window.firebase.set(window.firebase.ref(db, DB_ACTIVITY_PATH), null);
  };

  return {
    state, activity,
    user, currentUser,
    syncStatus, syncError,
    addWorkflow, updateWorkflow, deleteWorkflow, resetAll,
  };
}

Object.assign(window, { useStore, colorFromName, initials, relTime, shortName });
