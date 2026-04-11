/**
 * Design tokens — single source of truth for all design decisions.
 *
 * Color values are mirrored in app/globals.css via @theme for Tailwind v4.
 * Import this file directly in components that need token values outside of
 * Tailwind utility classes (e.g. inline styles, canvas, charting libraries).
 *
 * To change the theme, update both this file AND the @theme block in globals.css.
 */

export const tokens = {
  colors: {
    base:        "#0D0F14",   // page background
    surface:     "#161920",   // cards, panels
    elevated:    "#1E2130",   // hover states, dropdowns
    border:      "#2A2D3A",   // all borders
    textPrimary: "#F0F2F5",   // headings, labels
    textMuted:   "#8B8FA8",   // secondary text, metadata
    accent:      "#3B82F6",   // buttons, links, active nav
    scoreHigh:   "#10B981",   // score ≥ 70
    scoreMid:    "#F59E0B",   // score 40–69
    scoreLow:    "#EF4444",   // score < 40
  },

  // Component tokens describe intent and base values.
  // Responsive sizing is applied via Tailwind sm:/md:/lg: prefixes in components.
  components: {
    sidebar: {
      collapsedWidth: "3.5rem",   // icon-only on mobile
      expandedWidth:  "13.75rem", // full on md+
    },
    kanbanColumn: {
      minWidth: "17rem",          // columns scroll horizontally on small screens
    },
  },
} as const
