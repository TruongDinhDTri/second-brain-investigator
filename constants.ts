import React from 'react';

// Using simple SVG strings for icons to avoid external dependencies for this demo
export const ICONS = {
  Brain: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("path", { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }),
    React.createElement("path", { d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" }),
    React.createElement("path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" }),
    React.createElement("path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375" }),
    React.createElement("path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }),
    React.createElement("path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }),
    React.createElement("path", { d: "M19.938 10.5a4 4 0 0 1 .585.396" }),
    React.createElement("path", { d: "M6 18a4 4 0 0 1-1.97-3.465" }),
    React.createElement("path", { d: "M20 14.535A4 4 0 0 1 18 18" })
  ),
  Search: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("circle", { cx: "11", cy: "11", r: "8" }),
    React.createElement("path", { d: "m21 21-4.3-4.3" })
  ),
  Sparkles: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" }),
    React.createElement("path", { d: "M5 3v4" }),
    React.createElement("path", { d: "M9 3v4" }),
    React.createElement("path", { d: "M3 5h4" }),
    React.createElement("path", { d: "M3 9h4" })
  ),
  ArrowRight: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("path", { d: "M5 12h14" }),
    React.createElement("path", { d: "m12 5 7 7-7 7" })
  ),
  Loader: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: "animate-spin"
    },
    React.createElement("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
  ),
  Notion: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      stroke: "none"
    },
    React.createElement("path", { d: "M4.366 3.193a.85.85 0 0 0-.256-.046c-.503 0-1.042.378-1.57.886l.035.03c1.04-.26 1.48.243 1.48.974v14.473c0 .356-.168.625-.498.818l-.04.04c.83.69 1.83 1.543 2.658 2.228.328.272.585.197.585-.224v-8.81L12.7 22.37c.1.18.325.32.555.32.42 0 1.21-.655 2.122-1.42l2.905-2.45c.87-.733 1.623-1.433 1.623-1.782V4.71c0-.422-.174-.707-.535-.888l-.023-.016c-.328-.153-.695-.084-1.082.268l-.05.045c.42.13.565.378.565.753v10.55L11.516 3.73a1.44 1.44 0 0 0-.964-.537Zm7.66 1.63v10.23L8.252 5.08c.55-.17 1.13-.257 1.774-.257Z" })
  ),
  Settings: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("path", { d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
    React.createElement("circle", { cx: "12", cy: "12", r: "3" })
  ),
  Close: () => React.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    React.createElement("path", { d: "M18 6 6 18" }),
    React.createElement("path", { d: "m6 6 12 12" })
  )
};