"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Navigation } from "@/components/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Users,
  Shield,
  Settings,
  Database,
  Activity,
  AlertTriangle,
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Server,
  Lock,
  Car,
  TrendingUp,
} from "lucide-react"

// Mock data for admin dashboard
const mockUsers = [
  { id: 1, name: "John Smith", email: "john@example.com", role: "driver", status: "active", lastLogin: "2 hours ago" },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "passenger",
    status: "active",
    lastLogin: "1 day ago",
  },
  { id: 3, name: "Mike Chen", email: "mike@example.com", role: "owner", status: "active", lastLogin: "30 min ago" },
  { id: 4, name: "Lisa Wong", email: "lisa@example.com", role: "driver", status: "inactive", lastLogin: "1 week ago" },
  { id: 5, name: "David Brown", email: "david@example.com", role: "admin", status: "active", lastLogin: "5 min ago" },
]

const mockSystemStats = [
  { metric: "Total Users", value: 1247, change: "+12%" },
  { metric: "Active Vehicles", value: 89, change: "+5%" },
  { metric: "System Uptime", value: "99.9%", change: "0%" },
  { metric: "Data Storage", value: "2.4TB", change: "+8%" },
]

const mockFleetOverview = [
  { region: "North", vehicles: 25, active: 18, alerts: 2 },
  { region: "South", vehicles: 32, active: 24, alerts: 1 },
  { region: "East", value: 28, active: 21, alerts: 3 },
  { region: "West", vehicles: 19, active: 15, alerts: 0 },
]

const mockUsageData = [
  { month: "Jan", users: 1100, incidents: 45 },
  { month: "Feb", users: 1150, incidents: 38 },
  { month: "Mar", users: 1200, incidents: 52 },
  { month: "Apr", users: 1180, incidents: 41 },
  { month: "May", users: 1220, incidents: 35 },
  { month: "Jun", users: 1247, incidents: 29 },
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [systemHealth, setSystemHealth] = useState(98.5)
  const [activeUsers, setActiveUsers] = useState(1247)
  const [totalAlerts, setTotalAlerts] = useState(6)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => Math.max(95, Math.min(100, prev + (Math.random() - 0.5) * 2)))
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 5) - 2)
      setTotalAlerts((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-purple-500 text-white",
      owner: "bg-blue-500 text-white",
      driver: "bg-green-500 text-white",
      passenger: "bg-orange-500 text-white",
    }
    return <Badge className={colors[role as keyof typeof colors]}>{role}</Badge>
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-500 text-white">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userRole="admin" />

      {/* Main content with proper spacing for navigation */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
              <p className="text-muted-foreground">Manage users, system settings, and monitor platform health</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* System Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{systemHealth.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{totalAlerts}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Storage</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4TB</div>
                <p className="text-xs text-blue-600">+8% this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Admin Tabs */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
              <TabsTrigger value="system">System Settings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user accounts and permissions</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                        <SelectItem value="passenger">Passenger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Role Distribution</CardTitle>
                    <CardDescription>Breakdown of user roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Drivers</span>
                        <Badge className="bg-green-500 text-white">847</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Passengers</span>
                        <Badge className="bg-orange-500 text-white">234</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Owners</span>
                        <Badge className="bg-blue-500 text-white">156</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Admins</span>
                        <Badge className="bg-purple-500 text-white">10</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                    <CardDescription>Latest user registrations and logins</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Users className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-muted-foreground">Alex Thompson - Driver - 2 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Shield className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Admin login</p>
                        <p className="text-xs text-muted-foreground">David Brown - 5 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <Users className="h-4 w-4 text-orange-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Role updated</p>
                        <p className="text-xs text-muted-foreground">Lisa Wong - Driver to Owner - 1 hour ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fleet" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Fleet Status</CardTitle>
                    <CardDescription>Real-time fleet monitoring across all regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockFleetOverview}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="vehicles" fill="hsl(var(--chart-1))" name="Total Vehicles" />
                        <Bar dataKey="active" fill="hsl(var(--chart-2))" name="Active" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Live Fleet Map</CardTitle>
                    <CardDescription>Global vehicle locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">Interactive global fleet map</p>
                        <p className="text-sm text-muted-foreground">104 vehicles currently active</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">78</div>
                        <div className="text-xs text-muted-foreground">Active Vehicles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">6</div>
                        <div className="text-xs text-muted-foreground">Critical Alerts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators across all fleets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Car className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">104</div>
                      <div className="text-xs text-muted-foreground">Total Vehicles</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">87.3%</div>
                      <div className="text-xs text-muted-foreground">Avg Alertness</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-xs text-muted-foreground">Incidents Today</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">94.2%</div>
                      <div className="text-xs text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Core system settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">Enable system maintenance mode</p>
                      </div>
                      <Switch id="maintenance-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-backup">Automatic Backups</Label>
                        <p className="text-sm text-muted-foreground">Daily automated system backups</p>
                      </div>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="real-time-alerts">Real-time Alerts</Label>
                        <p className="text-sm text-muted-foreground">Push notifications for critical events</p>
                      </div>
                      <Switch id="real-time-alerts" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="data-retention">Extended Data Retention</Label>
                        <p className="text-sm text-muted-foreground">Keep data for 2 years instead of 1</p>
                      </div>
                      <Switch id="data-retention" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alert Thresholds</CardTitle>
                    <CardDescription>Configure system alert sensitivity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="drowsiness-threshold">Drowsiness Alert Threshold</Label>
                      <Select defaultValue="75">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="70">70% (High Sensitivity)</SelectItem>
                          <SelectItem value="75">75% (Medium Sensitivity)</SelectItem>
                          <SelectItem value="80">80% (Low Sensitivity)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="critical-threshold">Critical Alert Threshold</Label>
                      <Select defaultValue="65">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">60% (High Sensitivity)</SelectItem>
                          <SelectItem value="65">65% (Medium Sensitivity)</SelectItem>
                          <SelectItem value="70">70% (Low Sensitivity)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notification-delay">Notification Delay</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                  <CardDescription>Database and system maintenance tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                      <Database className="h-6 w-6" />
                      <span>Database Backup</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                      <Server className="h-6 w-6" />
                      <span>System Health Check</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                      <Activity className="h-6 w-6" />
                      <span>Performance Monitor</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                      <Download className="h-6 w-6" />
                      <span>Export Logs</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Usage Trends</CardTitle>
                    <CardDescription>User growth and incident trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockUsageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={2}
                          name="Active Users"
                        />
                        <Line
                          type="monotone"
                          dataKey="incidents"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                          name="Incidents"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Performance</CardTitle>
                    <CardDescription>Key performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>API Response Time</span>
                        <span className="font-bold text-green-600">142ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Database Query Time</span>
                        <span className="font-bold text-green-600">23ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Uptime</span>
                        <span className="font-bold text-green-600">99.97%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Error Rate</span>
                        <span className="font-bold text-green-600">0.03%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Connections</span>
                        <span className="font-bold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage</span>
                        <span className="font-bold text-yellow-600">67%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Global Statistics</CardTitle>
                  <CardDescription>Platform-wide metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mockSystemStats.map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.metric}</div>
                        <div
                          className={`text-xs ${stat.change.startsWith("+") ? "text-green-600" : "text-muted-foreground"}`}
                        >
                          {stat.change}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure system security policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Mandatory 2FA for all admin users</p>
                      </div>
                      <Switch id="two-factor" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-timeout">Auto Session Timeout</Label>
                        <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="audit-logging">Enhanced Audit Logging</Label>
                        <p className="text-sm text-muted-foreground">Detailed activity logging</p>
                      </div>
                      <Switch id="audit-logging" defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-policy">Password Policy</Label>
                      <Select defaultValue="strong">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="strong">Strong (12+ chars, mixed case, numbers)</SelectItem>
                          <SelectItem value="enterprise">Enterprise (16+ chars, symbols required)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Monitoring</CardTitle>
                    <CardDescription>Recent security events and alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <Lock className="h-4 w-4 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Successful admin login</p>
                        <p className="text-xs text-muted-foreground">David Brown - 5 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Failed login attempt</p>
                        <p className="text-xs text-muted-foreground">Unknown user - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Shield className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Security scan completed</p>
                        <p className="text-xs text-muted-foreground">No vulnerabilities found - 1 day ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Backup & Recovery</CardTitle>
                  <CardDescription>Data backup and disaster recovery settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Database className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-lg font-bold">Last Backup</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                      <Button size="sm" className="mt-2">
                        Create Backup
                      </Button>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Server className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-lg font-bold">Backup Size</div>
                      <div className="text-sm text-muted-foreground">2.4 TB</div>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        View Details
                      </Button>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-lg font-bold">Recovery Time</div>
                      <div className="text-sm text-muted-foreground">&lt; 15 minutes</div>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Test Recovery
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
