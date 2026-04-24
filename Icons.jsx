// Amplitude Analytics — Icons (Lucide-style, stroke 1.5)
const Icon = ({ d, size = 16, stroke = "currentColor", fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);

const IconSearch    = (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>}/>;
const IconHome      = (p) => <Icon {...p} d={<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11z"/>}/>;
const IconChart     = (p) => <Icon {...p} d={<><path d="M3 3v18h18"/><path d="M7 14l4-5 3 3 5-7"/></>}/>;
const IconFunnel    = (p) => <Icon {...p} d={<path d="M3 4h18l-7 9v7l-4-2v-5L3 4z"/>}/>;
const IconUsers     = (p) => <Icon {...p} d={<><circle cx="9" cy="8" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1"/><circle cx="17" cy="6" r="3"/><path d="M22 21v-1a5 5 0 0 0-5-5"/></>}/>;
const IconFolder    = (p) => <Icon {...p} d={<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"/>}/>;
const IconBook      = (p) => <Icon {...p} d={<><path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V4z"/><path d="M4 18a2 2 0 0 1 2-2h12"/></>}/>;
const IconSettings  = (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></>}/>;
const IconPlus      = (p) => <Icon {...p} d={<><path d="M12 5v14"/><path d="M5 12h14"/></>}/>;
const IconChevron   = (p) => <Icon {...p} d={<path d="M6 9l6 6 6-6"/>}/>;
const IconChevronR  = (p) => <Icon {...p} d={<path d="M9 6l6 6-6 6"/>}/>;
const IconFilter    = (p) => <Icon {...p} d={<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>}/>;
const IconSparkle   = (p) => <Icon {...p} d={<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/>}/>;
const IconDots      = (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}/>;
const IconCheck     = (p) => <Icon {...p} d={<path d="M5 12l5 5L20 7"/>}/>;
const IconShare     = (p) => <Icon {...p} d={<><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></>}/>;
const IconUp        = (p) => <Icon {...p} d={<path d="M6 15l6-6 6 6"/>}/>;
const IconDown      = (p) => <Icon {...p} d={<path d="M6 9l6 6 6-6"/>}/>;
const IconStar      = (p) => <Icon {...p} d={<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8l-5.8 3.1 1.1-6.5L2.6 9.8l6.5-.9L12 3z"/>}/>;

Object.assign(window, {
  IconSearch, IconHome, IconChart, IconFunnel, IconUsers, IconFolder,
  IconBook, IconSettings, IconPlus, IconChevron, IconChevronR, IconFilter,
  IconSparkle, IconDots, IconCheck, IconShare, IconUp, IconDown, IconStar,
});
