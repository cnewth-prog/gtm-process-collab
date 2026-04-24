// GTM Customer Engagement Model — gate data
// Each gate: id, motion, stage label, trigger, tasks[], assets[] (with kind), owners[], notes?
// Asset kinds: doc (📄 Generic), sfdc (🗃), legal (📜), tech (⚙), milestone (🎯)

const ROLES = ["SDR","AE","FLM","Partner","SE","VC","TSM","CSA","Deal Desk","Legal","PS Ops","SubCo","FDE"];

const MOTIONS = [
  { id: "presales", label: "Pre-Sales · New Business", count: 8, range: "S0 Engagement → S6.5 / 7 Closed Won", accent: "#1e61f0" },
  { id: "postsales", label: "Post-Sales · Customer Journey", count: 7, range: "CS1 Transition → CS6 Optimize (then into Renewals)", accent: "#22bbb3" },
  { id: "renewals", label: "Renewals", count: 6, range: "S2 R-180 → S7 Closed Won (R-0)", accent: "#686ce9" },
];

const GATES = [
  // ---------- PRE-SALES ----------
  {
    id: "s0-s1", motion: "presales", stage: "S0 → S1",
    trigger: "S0 meeting booked + qualification notes logged in SFDC",
    tasks: [
      "ICP validation and outbound outreach (SDR)",
      "S0 qualification call held",
      "SDR → AE handoff with context brief",
      "Calendar invite for S1 discovery confirmed",
    ],
    assets: [
      { kind: "doc", name: "SDR handoff brief" },
      { kind: "doc", name: "3 Whys draft" },
      { kind: "sfdc", name: "Opp record" },
      { kind: "sfdc", name: "S0 qualification notes" },
    ],
    owners: ["SDR","AE"],
  },
  {
    id: "s1-s2", motion: "presales", stage: "S1 → S2",
    trigger: "3 Whys documented + Champion identified + FLM validation",
    tasks: [
      "Discovery call held (AE-led)",
      "Pain, urgency, context validated",
      "Champion / EB identified and engaged",
      "MEDDPICC fields initialised in SFDC",
      "FLM validation of 3 Whys (blocking)",
    ],
    assets: [
      { kind: "doc", name: "3 Whys document" },
      { kind: "doc", name: "Stakeholder map" },
      { kind: "sfdc", name: "Initial MEDDPICC scorecard" },
      { kind: "sfdc", name: "S1 Qualification Notes" },
    ],
    owners: ["AE","FLM"],
    note: "FLM owns validation gate",
  },
  {
    id: "s2-s3", motion: "presales", stage: "S2 → S3",
    trigger: "Full MEDDPICC validated with Champion / EB + FLM sign-off",
    tasks: [
      "Full MEDDPICC validation with Champion / EB",
      "Budget, decision process, timeline confirmed",
      "Mutual Action Plan (MAP) initiated (≥ $100K)",
      "Value Map initiated (≥ $100K)",
      "Partner (PTR) discovery (if engaged)",
      "FLM sign-off before advancing to S3",
    ],
    assets: [
      { kind: "milestone", name: "Mutual Action Plan (MAP)" },
      { kind: "doc", name: "Value Map" },
      { kind: "sfdc", name: "Validated MEDDPICC" },
      { kind: "sfdc", name: "Partner discovery record" },
    ],
    owners: ["AE","FLM","Partner"],
  },
  {
    id: "s3-s4", motion: "presales", stage: "S3 → S4",
    trigger: "Evaluation Plan agreed (mutual) + Value Map initiated",
    tasks: [
      "Build Evaluation Plan jointly with customer (AE + SE)",
      "Technical use-case deep dive (SE-led)",
      "Custom demo / workshop delivered",
      "Champion coaching sessions",
      "BVA / success story delivery",
      "Update MAP with mutual milestones",
    ],
    assets: [
      { kind: "milestone", name: "Evaluation Plan" },
      { kind: "tech", name: "Technical Win Plan" },
      { kind: "doc", name: "Business Case (draft)" },
      { kind: "doc", name: "Champion coaching notes" },
      { kind: "milestone", name: "Updated MAP" },
    ],
    owners: ["AE","SE","VC"],
  },
  {
    id: "s4-s5", motion: "presales", stage: "S4 → S5", ps: true,
    trigger: "Technical Win confirmed + Services forecasted + Path to Production complete",
    tasks: [
      "POV / technical use-case testing",
      "Track success metrics vs. goals",
      "Path to Production deck delivered",
      "Security & Legal steps scoped",
      "AE services forecast; TSM pitch",
      "Deployment plan drafted (TSM; Phase 1 ≥ $100K, Phase 2 ≥ $50K)",
    ],
    assets: [
      { kind: "tech", name: "Technical Win doc" },
      { kind: "doc", name: "Path to Production deck" },
      { kind: "tech", name: "Architecture Diagram" },
      { kind: "milestone", name: "Deployment plan (draft)" },
      { kind: "sfdc", name: "Services forecast" },
    ],
    owners: ["AE","SE","TSM","CSA"],
  },
  {
    id: "s5-s6", motion: "presales", stage: "S5 → S6", ps: true,
    trigger: "Proposal delivered + Vendor of Choice confirmed",
    tasks: [
      "Post-Sales Overview call held with customer",
      "Pricing and scope finalised",
      "Proposal + executive summary drafted",
      "SOW scoped (for services lands)",
      "TSM generates Requirements Document v0.1",
      "Legal / security timelines tracked",
    ],
    assets: [
      { kind: "doc", name: "Proposal + exec summary" },
      { kind: "doc", name: "Requirements Document v0.1" },
      { kind: "legal", name: "SOW (draft)" },
      { kind: "doc", name: "Post-Sales Overview notes" },
    ],
    owners: ["AE","TSM","Deal Desk"],
  },
  {
    id: "s6-s65", motion: "presales", stage: "S6 → S6.5",
    trigger: "Redlines resolved + MSA / SOW finalised + EB approved",
    tasks: [
      "Legal review coordinated",
      "Procurement and finance timeline managed",
      "SOW scope finalised (TSM Mgr review on custom)",
      "Partner requirement doc shared (anonymised) if co-delivered",
      "Commercial buyer formal approval",
      "Signature process started / DocuSign sent",
    ],
    assets: [
      { kind: "legal", name: "MSA" },
      { kind: "legal", name: "Final SOW" },
      { kind: "legal", name: "DocuSign envelope" },
      { kind: "doc", name: "Internal kickoff plan" },
    ],
    owners: ["AE","Legal","TSM"],
  },
  {
    id: "s65-s7", motion: "presales", stage: "S6.5 → S7", ps: true,
    trigger: "Contract signed & reflected in SFDC — Closed Won",
    tasks: [
      "Booking QA (commercial, legal, tax, data completeness)",
      "TSM assigned and introduced to customer",
      "Implementation staffing confirmed",
      "PS Ops initiates PO process (for sub-co)",
      "Kickoff details confirmed (AE)",
      "AE → TSM handoff doc auto-generated",
    ],
    assets: [
      { kind: "legal", name: "Signed contract" },
      { kind: "doc", name: "AE → TSM handoff doc" },
      { kind: "milestone", name: "Kickoff package" },
      { kind: "sfdc", name: "TSM assignment" },
    ],
    owners: ["AE","TSM","PS Ops","CSA"],
  },

  // ---------- POST-SALES ----------
  {
    id: "cs1", motion: "postsales", stage: "→ CS1", ps: true,
    trigger: "Closed Won (new land) — internal transition required",
    tasks: [
      "TSM holds internal transition call (TSM, CSA, AE, SE, PSM, sub-co)",
      "Customer kickoff scheduled",
      "Pre-read materials + prep requirements sent to customer",
      "AE intro email drafted; EB / Project Sponsor invited",
      "Partnership kickoff call held",
    ],
    assets: [
      { kind: "doc", name: "Transition pre-read pack" },
      { kind: "milestone", name: "Customer kickoff agenda" },
      { kind: "doc", name: "Intro email (AE → customer)" },
      { kind: "doc", name: "Documented use cases" },
    ],
    owners: ["TSM","AE","SE","SubCo","CSA"],
  },
  {
    id: "cs1-cs2", motion: "postsales", stage: "CS1 → CS2", ps: true,
    trigger: "Internal transition + customer partnership kickoff completed",
    tasks: [
      "Engineering Kickoff scheduled (instrumentation walkthrough)",
      "AI Agents walkthrough training",
      "Use Case Alignment meetings to finalise KPIs & taxonomy",
      "Taxonomy working sessions booked",
    ],
    assets: [
      { kind: "tech", name: "Engineering kickoff deck" },
      { kind: "doc", name: "Use Case Alignment notes" },
      { kind: "tech", name: "Taxonomy design (draft)" },
      { kind: "milestone", name: "Deployment plan (updated)" },
    ],
    owners: ["TSM","SubCo","CSA"],
  },
  {
    id: "cs2-cs3", motion: "postsales", stage: "CS2 → CS3", ps: true,
    trigger: "Deployment plan validated + EB signoff on use cases/KPIs",
    tasks: [
      "Customer sends data to Test project, then Production",
      "SubCo / CSA run Data & Taxonomy QA",
      "Go-Live Readiness assessment",
      "Data Governance Workshop delivered",
      "AI context setup",
    ],
    assets: [
      { kind: "milestone", name: "Deployment plan (validated)" },
      { kind: "tech", name: "Taxonomy design (final)" },
      { kind: "tech", name: "Design diagram" },
      { kind: "sfdc", name: "Status reports / gates" },
    ],
    owners: ["SubCo","CSA","TSM","FDE"],
    note: "FDE pulled in for complex / non-standard",
  },
  {
    id: "cs3-cs4", motion: "postsales", stage: "CS3 → CS4",
    trigger: "Production data ingested + Go-Live Data Readiness passed",
    tasks: [
      "Build certified dashboards against deployment plan KPIs",
      "AI context + agents setup complete",
      "Foundational training delivered",
      "Implementation readout with customer",
      "First Verified Outcome logged",
    ],
    assets: [
      { kind: "tech", name: "Certified dashboards" },
      { kind: "tech", name: "AI context + agents" },
      { kind: "doc", name: "Training materials" },
      { kind: "milestone", name: "Implementation readout doc" },
      { kind: "doc", name: "First Verified Outcome (WIP)" },
    ],
    owners: ["TSM","SubCo","CSA","SE","AE"],
  },
  {
    id: "cs4-cs5", motion: "postsales", stage: "CS4 → CS5",
    trigger: "Implementation readout + first Verified Outcome logged",
    tasks: [
      "Switch to Adopt cadence (Health Audits, Success Planning)",
      "Establish executive cadence with EB",
      "EBR scheduling",
      "Ongoing use-case onboarding",
      "Chart / Dashboard office hours",
    ],
    assets: [
      { kind: "milestone", name: "Success Plan" },
      { kind: "doc", name: "EBR cadence" },
      { kind: "doc", name: "Health Audit template" },
      { kind: "doc", name: "Exec cadence plan" },
    ],
    owners: ["TSM","AE","CSA"],
  },
  {
    id: "cs5-cs6", motion: "postsales", stage: "CS5 → CS6",
    trigger: "Adoption / consumption / data-quality thresholds achieved",
    tasks: [
      "Continuous usage monitoring (>10% variance watch)",
      "Verified Outcomes logged and updated",
      "CSQLs identified and routed to AE",
      "New use-case instrumentation support",
      "Experimentation audit + recommendations",
    ],
    assets: [
      { kind: "doc", name: "Verified Outcomes log" },
      { kind: "sfdc", name: "CSQLs" },
      { kind: "sfdc", name: "Expansion opp pipeline" },
      { kind: "tech", name: "Context Management audit" },
    ],
    owners: ["TSM","AE","CSA"],
  },
  {
    id: "cs6-renewal", motion: "postsales", stage: "CS6 → Renewal",
    trigger: "Renewal window opens (T-180 days — time-based trigger)",
    tasks: [
      "Renewal opp auto-created in SFDC (forecast + MEDDPICC shell)",
      "Health Check prep",
      "Verified Outcomes summary compiled",
      "Renewal Outlook refreshed",
      "Internal Renewal Review scheduled",
    ],
    assets: [
      { kind: "sfdc", name: "Renewal opp" },
      { kind: "doc", name: "Customer Health Check" },
      { kind: "doc", name: "Verified Outcomes summary" },
      { kind: "doc", name: "Renewal Outlook" },
      { kind: "doc", name: "EBR content (draft)" },
    ],
    owners: ["TSM","AE","CSA"],
  },

  // ---------- RENEWALS ----------
  {
    id: "r180", motion: "renewals", stage: "R-180 · S2 → S3",
    trigger: "Renewal motion confirmed (flat / expand / partial / full churn) + EBR delivered",
    tasks: [
      "Customer Health Check prep (TSM)",
      "Internal Renewal Review to align on account plan & risk",
      "EBR preparation and delivery (AE + TSM)",
      "Renewal forecast + MEDDPICC fields updated",
      "Champion / EB confirmed; decision timeline captured",
    ],
    assets: [
      { kind: "doc", name: "Customer Health Check" },
      { kind: "milestone", name: "EBR deck" },
      { kind: "milestone", name: "Renewal MAP (draft)" },
      { kind: "sfdc", name: "Updated renewal opp" },
      { kind: "doc", name: "Verified Outcomes (captured)" },
    ],
    owners: ["AE","TSM","CSA"],
  },
  {
    id: "r120", motion: "renewals", stage: "R-120 · S3 → S4",
    trigger: "Renewal Readiness Call held + decision criteria confirmed with EB",
    tasks: [
      "Renewal Readiness Call with customer",
      "Draft Renewal Mutual Action Plan",
      "Qualify expansion opportunity + draft business case",
      "Document / validate technical use cases for new blade expansions",
      "Risk identification and mitigation plan",
    ],
    assets: [
      { kind: "doc", name: "Renewal readiness notes" },
      { kind: "milestone", name: "Renewal MAP" },
      { kind: "doc", name: "Expansion business case" },
      { kind: "doc", name: "Risk mitigation plan" },
      { kind: "sfdc", name: "Updated renewal opp" },
    ],
    owners: ["AE","TSM","SE","CSA"],
    note: "SE on expansions with new blades",
  },
  {
    id: "r90", motion: "renewals", stage: "R-90 · S4 → S5",
    trigger: "Customer agrees value delivered + procurement process mapped",
    tasks: [
      "Confirm value realisation with customer",
      "Technical evaluation for expansion (if any)",
      "Confirm technical win with key stakeholders",
      "Update MAP with confirmed dates",
    ],
    assets: [
      { kind: "doc", name: "Value realisation summary" },
      { kind: "tech", name: "Expansion technical win" },
      { kind: "milestone", name: "Updated MAP" },
      { kind: "sfdc", name: "Procurement contact log" },
    ],
    owners: ["AE","TSM","SE","CSA"],
  },
  {
    id: "r60", motion: "renewals", stage: "R-60 · S5 → S6",
    trigger: "Renewal proposal delivered + EB / Champion confirm intent",
    tasks: [
      "Deliver renewal proposal",
      "EB / Champion renewal conversation",
      "Update MAP with contracting steps",
      "Confirm expansion (if applicable)",
    ],
    assets: [
      { kind: "doc", name: "Renewal Proposal" },
      { kind: "milestone", name: "Updated MAP" },
      { kind: "doc", name: "Expansion scope" },
      { kind: "sfdc", name: "Updated renewal opp" },
    ],
    owners: ["AE","TSM","CSA"],
  },
  {
    id: "r30", motion: "renewals", stage: "R-30 · S6 → S6.5",
    trigger: "Redlines resolved + final ARR set",
    tasks: [
      "Manage final commercial redlines",
      "Legal review follow-up (internal + customer)",
      "EB / Champion status checks",
      "PO / procurement management",
      "SFDC + forecast hygiene",
      "FLM / Exec escalation if needed",
    ],
    assets: [
      { kind: "legal", name: "Order Form" },
      { kind: "legal", name: "MSA / SOW (if applicable)" },
      { kind: "legal", name: "PO" },
      { kind: "sfdc", name: "Final ARR" },
    ],
    owners: ["AE","TSM","Legal","FLM"],
  },
  {
    id: "r0", motion: "renewals", stage: "R-0 · S7", ps: true,
    trigger: "Renewal contract signed & logged — Closed Won",
    tasks: [
      "Finalise signatures",
      "Sales ↔ CS handoff refreshed (with TSM + CSA / SubCo)",
      "Celebrate renewal with customer",
      "Success Plan updated with post-renewal priorities",
      "PSP plan prepared for new term (if applicable)",
    ],
    assets: [
      { kind: "legal", name: "Signed renewal contract" },
      { kind: "milestone", name: "Refreshed Success Plan" },
      { kind: "doc", name: "Post-renewal priorities" },
      { kind: "doc", name: "PSP plan (new term)" },
    ],
    owners: ["AE","TSM","CSA","SubCo"],
  },
];

const ASSET_KINDS = {
  doc:       { glyph: "📄", label: "Generic asset" },
  sfdc:      { glyph: "🗃", label: "SFDC record" },
  legal:     { glyph: "📜", label: "Legal / contract" },
  tech:      { glyph: "⚙",  label: "Technical artifact" },
  milestone: { glyph: "🎯", label: "Kickoff / milestone" },
};

Object.assign(window, { ROLES, MOTIONS, GATES, ASSET_KINDS });
