"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/jobs",         label: "Jobs",         icon: "💼" },
  { href: "/applications", label: "Applications", icon: "📋" },
  { href: "/leads",        label: "Leads",        icon: "👤" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="
      hidden md:flex flex-col shrink-0
      w-14 lg:w-[220px]
      h-full border-r border-border bg-base
      transition-all duration-200
    ">
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 lg:px-4 h-14 border-b border-border">
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">JA</span>
        </div>
        <span className="hidden lg:block text-text-primary font-semibold text-sm tracking-tight truncate">
          Job Assistant
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium
                transition-colors duration-100
                ${active
                  ? "bg-accent/15 text-accent"
                  : "text-text-muted hover:bg-elevated hover:text-text-primary"
                }
              `}
            >
              <span className="text-base shrink-0">{icon}</span>
              <span className="hidden lg:block">{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
