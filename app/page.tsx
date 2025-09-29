"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Dock from "@/components/Dock"
import Logo from "@/components/Logo"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"driver" | "passenger" | "owner" | "admin">("driver")
  const { login, user, isLoading } = useAuth()
  const router = useRouter()

  if (user) {
    router.push(`/${user.role}`)
    return null
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await login(email, password, selectedRole)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const email = (formData.get("signupEmail") as string) || ""
    const countryCode = ((formData.get("countryCode") as string) || "+1").trim()
    const phoneLocal = ((formData.get("signupPhone") as string) || "").trim()
    const phone = phoneLocal ? `${countryCode} ${phoneLocal}` : ""
    const password = formData.get("signupPassword") as string

    try {
      await login(email || phone, password, selectedRole)
    } catch (error) {
      console.error("Sign up failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <ScrollReveal variant="up">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
        </ScrollReveal>

        {/* Role Selection Dock */}
        <ScrollReveal variant="fade">
          <Dock
            className="mx-auto"
            items={[
              {
                icon: <span className="text-2xl">🚗</span>,
                label: <span>Driver</span>,
                onClick: () => setSelectedRole("driver"),
                className: selectedRole === "driver" ? "ring-2 ring-primary" : "",
              },
              {
                icon: <span className="text-2xl">👥</span>,
                label: <span>Passenger</span>,
                onClick: () => setSelectedRole("passenger"),
                className: selectedRole === "passenger" ? "ring-2 ring-primary" : "",
              },
              {
                icon: <span className="text-2xl">🛡️</span>,
                label: <span>Owner</span>,
                onClick: () => setSelectedRole("owner"),
                className: selectedRole === "owner" ? "ring-2 ring-primary" : "",
              },
              {
                icon: <span className="text-2xl">⚙️</span>,
                label: <span>Admin</span>,
                onClick: () => setSelectedRole("admin"),
                className: selectedRole === "admin" ? "ring-2 ring-primary" : "",
              },
            ]}
          />
        </ScrollReveal>

        {/* Auth Forms */}
        <ScrollReveal variant="scale">
          <Card className="transition-all duration-300 hover:shadow-md">
            <CardHeader>
              <CardTitle className="transition-opacity duration-300">Welcome Back</CardTitle>
              <CardDescription className="transition-opacity duration-300">Sign in to access your AlertMate dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email or Phone</Label>
                      <Input id="email" name="email" type="text" inputMode="email" placeholder="Email or phone number" required className="transition-all duration-300 focus:shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          required
                          className="transition-all duration-300 focus:shadow-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "🙈"}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full transition-transform duration-300 hover:scale-[1.01]" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="text-center">
                    <Button variant="link" className="text-sm">
                      Forgot your password?
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" required className="transition-all duration-300 focus:shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required className="transition-all duration-300 focus:shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email</Label>
                      <Input id="signupEmail" name="signupEmail" type="email" placeholder="Email (e.g., john@example.com)" className="transition-all duration-300 focus:shadow-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPhone">Phone Number</Label>
                      <div className="flex gap-2">
                        <Select name="countryCode" defaultValue="+1">
                          <SelectTrigger className="w-28">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+1">+1 (US)</SelectItem>
                            <SelectItem value="+44">+44 (UK)</SelectItem>
                            <SelectItem value="+61">+61 (AU)</SelectItem>
                            <SelectItem value="+81">+81 (JP)</SelectItem>
                            <SelectItem value="+91">+91 (IN)</SelectItem>
                            <SelectItem value="+92">+92 (PK)</SelectItem>
                            <SelectItem value="+971">+971 (AE)</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input id="signupPhone" name="signupPhone" type="tel" placeholder="Phone (e.g., 555 123 4567)" className="transition-all duration-300 focus:shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword">Password</Label>
                      <div className="relative">
                        <Input
                          id="signupPassword"
                          name="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          required
                          className="transition-all duration-300 focus:shadow-sm"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "🙈"}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full transition-transform duration-300 hover:scale-[1.01]" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Footer */}
        <ScrollReveal variant="fade">
          <div className="text-center text-sm text-muted-foreground">
            <p>Secure • Reliable • Professional</p>
            <p className="mt-2 text-xs">Demo: Use any email/password to sign in as {selectedRole}</p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
