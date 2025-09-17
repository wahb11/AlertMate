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
import { Badge } from "@/components/ui/badge"

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
    const email = formData.get("signupEmail") as string
    const password = formData.get("signupPassword") as string

    try {
      await login(email, password, selectedRole)
    } catch (error) {
      console.error("Sign up failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
              🛡️
            </div>
            <h1 className="text-3xl font-bold text-foreground">AlertMate</h1>
          </div>
          <p className="text-muted-foreground">Professional drowsiness detection and fleet management</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Badge
            variant={selectedRole === "driver" ? "default" : "outline"}
            className="justify-center p-2 cursor-pointer"
            onClick={() => setSelectedRole("driver")}
          >
            <span className="mr-1">🚗</span>
            Driver
          </Badge>
          <Badge
            variant={selectedRole === "passenger" ? "default" : "outline"}
            className="justify-center p-2 cursor-pointer"
            onClick={() => setSelectedRole("passenger")}
          >
            <span className="mr-1">👥</span>
            Passenger
          </Badge>
          <Badge
            variant={selectedRole === "owner" ? "default" : "outline"}
            className="justify-center p-2 cursor-pointer"
            onClick={() => setSelectedRole("owner")}
          >
            <span className="mr-1">🛡️</span>
            Owner
          </Badge>
          <Badge
            variant={selectedRole === "admin" ? "default" : "outline"}
            className="justify-center p-2 cursor-pointer"
            onClick={() => setSelectedRole("admin")}
          >
            <span className="mr-1">⚙️</span>
            Admin
          </Badge>
        </div>

        {/* Auth Forms */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your AlertMate dashboard</CardDescription>
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
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="Enter your email" required />
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
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
                      <Input id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input id="signupEmail" name="signupEmail" type="email" placeholder="john@example.com" required />
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Secure • Reliable • Professional</p>
          <p className="mt-2 text-xs">Demo: Use any email/password to sign in as {selectedRole}</p>
        </div>
      </div>
    </div>
  )
}
