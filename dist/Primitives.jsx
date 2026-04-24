// Amplitude shared primitives
const Button = ({ variant = "secondary", size = "md", children, icon, onClick, style, disabled }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    height: size === "sm" ? 24 : 32, padding: size === "sm" ? "0 8px" : "0 12px",
    borderRadius: 8, fontFamily: "'IBM Plex Sans',sans-serif",
    fontWeight: 500, fontSize: size === "sm" ? 12 : 14, lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap",
    transition: "background .12s, border-color .12s, color .12s",
  };
  const variants = {
    primary: { background: "#1e61f0", color: "#fff", border: "1px solid #1e61f0" },
    secondary: { background: "#fff", color: "#1e2024", border: "1px solid #dedfe2" },
    tertiary: { background: "transparent", color: "#1e61f0", border: "1px solid transparent" },
    tertiaryAlt: { background: "transparent", color: "#1e2024", border: "1px solid transparent" },
    danger: { background: "#fff", color: "#b41823", border: "1px solid #dedfe2" },
  };
  const dis = disabled ? { background: "#dedfe2", color: "#a8abb3", border: "1px solid #dedfe2" } : {};
  const [hover, setHover] = React.useState(false);
  const hoverStyles = {
    primary: { background: "#558df7", borderColor: "#558df7" },
    secondary: { background: "#f5faff", borderColor: "#b1d3ff", color: "#1e61f0" },
    tertiary: { background: "#f5faff", borderColor: "#b1d3ff" },
    tertiaryAlt: { background: "#f4f5f6" },
    danger: { background: "#fae2e2", borderColor: "#fc6965" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...(hover && !disabled ? hoverStyles[variant] : {}), ...dis, ...style }}>
      {icon}{children}
    </button>
  );
};

const Card = ({ children, style, onClick, active }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff",
        border: `1px solid ${active ? "#1e61f0" : hover && onClick ? "#c2c4ca" : "#dedfe2"}`,
        borderRadius: 8,
        boxShadow: hover && onClick && !active ? "0 2px 8px rgba(0,0,0,.1)" : "none",
        transition: "box-shadow .15s, border-color .15s",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>{children}</div>
  );
};

const Badge = ({ tone = "neutral", children, style }) => {
  const tones = {
    neutral: { bg: "#f4f5f6", fg: "#35373d" },
    info:    { bg: "#ebf5ff", fg: "#1e61f0" },
    success: { bg: "#def2e8", fg: "#0a7640" },
    error:   { bg: "#fae2e2", fg: "#b41823" },
    warning: { bg: "#fadecd", fg: "#9d5125" },
    teal:    { bg: "#e3f0ef", fg: "#0f5350" },
  }[tone];
  return <span style={{
    padding: "2px 8px", borderRadius: 9999, background: tones.bg, color: tones.fg,
    fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 600, fontSize: 12, lineHeight: 1.5, ...style,
  }}>{children}</span>;
};

const SectionLabel = ({ children, style }) => (
  <div style={{
    fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 600, fontSize: 11,
    letterSpacing: 1, color: "#7D7F86", textTransform: "uppercase", ...style,
  }}>{children}</div>
);

const Input = ({ icon, style, ...rest }) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      height: 32, padding: "0 10px", borderRadius: 8, background: "#fff",
      border: `1px solid ${focus ? "#1e61f0" : "#dedfe2"}`,
      boxShadow: focus ? "0 0 0 3px #b1d3ff" : "none", ...style,
    }}>
      {icon && <span style={{ color: "#6f7480", display: "flex" }}>{icon}</span>}
      <input {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ border: "none", outline: "none", background: "transparent", flex: 1,
                 font: "400 14px/1.2 'IBM Plex Sans',sans-serif", color: "#1e2024" }}/>
    </div>
  );
};

Object.assign(window, { Button, Card, Badge, SectionLabel, Input });
