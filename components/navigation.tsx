"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-context"

const navigation = [
  { name: "Dashboard", href: "/driver", icon: "🏠", role: "driver" },
  { name: "Emergency", href: "/emergency", icon: "📞", role: "driver" },
  { name: "Passenger View", href: "/passenger", icon: "👥", role: "passenger" },
  { name: "Emergency", href: "/emergency", icon: "📞", role: "passenger" },
  { name: "Fleet Overview", href: "/owner", icon: "🛡️", role: "owner" },
  { name: "Emergency", href: "/emergency", icon: "📞", role: "owner" },
  { name: "Admin Panel", href: "/admin", icon: "⚙️", role: "admin" },
  { name: "Emergency", href: "/emergency", icon: "📞", role: "admin" },
]

interface NavigationProps {
  userRole?: "driver" | "passenger" | "owner" | "admin"
}

export function Navigation({ userRole = "driver" }: NavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { logout, user } = useAuth()
  const router = useRouter()

  const filteredNavigation = navigation.filter((item) => item.role === (user?.role || userRole))

  const handleSignOut = () => {
    logout()
    router.push("/")
  }

  const handleBackToRoleSelection = () => {
    logout()
    router.push("/")
  }

  const NavItems = () => (
    <>
      <Button
        variant="outline"
        className="w-full justify-start mb-4 bg-transparent"
        onClick={handleBackToRoleSelection}
      >
        <span className="mr-2">←</span>
        Back to Role Selection
      </Button>

      {filteredNavigation.map((item) => {
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            onClick={() => setIsOpen(false)}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <span>☰</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xl">🛡️</span>
              <span className="text-lg font-bold">AlertMate</span>
            </div>
            <nav className="space-y-2">
              <NavItems />
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
                onClick={handleSignOut}
              >
                <span className="mr-2">🚪</span>
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          <div className="flex items-center space-x-2 p-4 border-b border-border">
            <span className="text-xl">🛡️</span>
            <span className="text-lg font-bold">AlertMate</span>
            <Badge variant="secondary" className="ml-auto">
              {userRole}
            </Badge>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavItems />
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <span>👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="icon">
                <span>🔔</span>
              </Button>
            </div>
            <Button variant="outline" className="w-full justify-start bg-transparent" size="sm" onClick={handleSignOut}>
              <span className="mr-2">🚪</span>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
