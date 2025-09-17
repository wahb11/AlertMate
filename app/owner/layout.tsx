import type React from "react"
import { Navigation } from "@/components/navigation"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <Navigation userRole="owner" />
      <main className="flex-1 lg:ml-64 overflow-auto">{children}</main>
    </div>
  )
}
