"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Navigation is provided by app/owner/layout.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Car,
  Users,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  Settings,
  Phone,
} from "lucide-react"

// Mock data for fleet overview
const mockFleetData = [
  {
    id: "V001",
    driver: "John Smith",
    status: "Active",
    alertness: 85,
    location: "Highway 101",
    lastUpdate: "2 min ago",
  },
  {
    id: "V002",
    driver: "Sarah Johnson",
    status: "Break",
    alertness: 92,
    location: "Rest Area",
    lastUpdate: "15 min ago",
  },
  { id: "V003", driver: "Mike Chen", status: "Active", alertness: 78, location: "I-5 North", lastUpdate: "1 min ago" },
  {
    id: "V004",
    driver: "Lisa Wong",
    status: "Critical",
    alertness: 65,
    location: "Highway 99",
    lastUpdate: "30 sec ago",
  },
  { id: "V005", driver: "David Brown", status: "Active", alertness: 88, location: "I-405", lastUpdate: "3 min ago" },
]

const mockAnalyticsData = [
  { month: "Jan", incidents: 12, avgAlertness: 82 },
  { month: "Feb", incidents: 8, avgAlertness: 85 },
  { month: "Mar", incidents: 15, avgAlertness: 79 },
  { month: "Apr", incidents: 6, avgAlertness: 87 },
  { month: "May", incidents: 10, avgAlertness: 83 },
  { month: "Jun", incidents: 4, avgAlertness: 89 },
]

const mockDriverPerformance = [
  { name: "John Smith", trips: 45, avgAlertness: 85, incidents: 2, score: 8.5 },
  { name: "Sarah Johnson", trips: 52, avgAlertness: 92, incidents: 0, score: 9.8 },
  { name: "Mike Chen", trips: 38, avgAlertness: 78, incidents: 5, score: 7.2 },
  { name: "Lisa Wong", trips: 41, avgAlertness: 81, incidents: 3, score: 8.1 },
  { name: "David Brown", trips: 47, avgAlertness: 88, incidents: 1, score: 9.2 },
]

const statusColors = [
  { name: "Active", value: 60, color: "#22c55e" },
  { name: "Break", value: 25, color: "#3b82f6" },
  { name: "Critical", value: 10, color: "#ef4444" },
  { name: "Offline", value: 5, color: "#6b7280" },
]

export default function OwnerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [totalVehicles] = useState(25)
  const [activeDrivers, setActiveDrivers] = useState(18)
  const [criticalAlerts, setCriticalAlerts] = useState(2)
  const [fleetScore, setFleetScore] = useState(8.4)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDrivers((prev) => prev + Math.floor(Math.random() * 3) - 1)
      setCriticalAlerts((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      setFleetScore((prev) => Math.max(7.0, Math.min(10.0, prev + (Math.random() - 0.5) * 0.2)))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredFleetData = mockFleetData.filter((vehicle) => {
    const matchesSearch =
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string, alertness: number) => {
    if (status === "Critical" || alertness < 70) {
      return <Badge className="bg-red-500 text-white">Critical</Badge>
    }
    if (status === "Break") {
      return <Badge className="bg-blue-500 text-white">Break</Badge>
    }
    if (status === "Active") {
      return <Badge className="bg-green-500 text-white">Active</Badge>
    }
    return <Badge variant="secondary">Offline</Badge>
  }

  return (
    <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Fleet Management</h1>
              <p className="text-muted-foreground">Monitor and manage your vehicle fleet</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalVehicles}</div>
                <p className="text-xs text-muted-foreground">Fleet size</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeDrivers}</div>
                <p className="text-xs text-muted-foreground">Currently driving</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
                <p className="text-xs text-muted-foreground">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fleet Safety Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{fleetScore.toFixed(1)}/10</div>
                <p className="text-xs text-muted-foreground">Overall performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="fleet" className="space-y-4">
            <TabsList>
              <TabsTrigger value="fleet">Live Fleet</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="drivers">Driver Management</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="fleet" className="space-y-4">
              {/* Search and Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Overview</CardTitle>
                  <CardDescription>Real-time monitoring of all vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by driver name or vehicle ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="break">On Break</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Alertness</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFleetData.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.id}</TableCell>
                          <TableCell>{vehicle.driver}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status, vehicle.alertness)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{vehicle.alertness}%</span>
                              <Progress value={vehicle.alertness} className="w-16" />
                            </div>
                          </TableCell>
                          <TableCell>{vehicle.location}</TableCell>
                          <TableCell className="text-muted-foreground">{vehicle.lastUpdate}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Fleet Status Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Fleet Status Distribution</CardTitle>
                    <CardDescription>Current status of all vehicles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusColors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusColors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Alerts</CardTitle>
                    <CardDescription>Recent system notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Critical drowsiness detected</p>
                        <p className="text-xs text-muted-foreground">Vehicle V004 - Lisa Wong - 30 sec ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Driver break overdue</p>
                        <p className="text-xs text-muted-foreground">Vehicle V003 - Mike Chen - 5 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Vehicle entered rest area</p>
                        <p className="text-xs text-muted-foreground">Vehicle V002 - Sarah Johnson - 15 min ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Incident Trends</CardTitle>
                    <CardDescription>Drowsiness incidents over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="incidents" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Fleet Alertness</CardTitle>
                    <CardDescription>Monthly alertness trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockAnalyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[70, 95]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="avgAlertness"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--chart-2))" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Performance Summary</CardTitle>
                  <CardDescription>Key metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">94.2%</div>
                      <div className="text-sm text-muted-foreground">On-time Performance</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.3</div>
                      <div className="text-sm text-muted-foreground">Avg Incidents/Month</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">847</div>
                      <div className="text-sm text-muted-foreground">Total Miles (Today)</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">$2,340</div>
                      <div className="text-sm text-muted-foreground">Cost Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drivers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Driver Performance</CardTitle>
                  <CardDescription>Individual driver statistics and scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Driver Name</TableHead>
                        <TableHead>Total Trips</TableHead>
                        <TableHead>Avg Alertness</TableHead>
                        <TableHead>Incidents</TableHead>
                        <TableHead>Safety Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDriverPerformance.map((driver, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{driver.name}</TableCell>
                          <TableCell>{driver.trips}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span>{driver.avgAlertness}%</span>
                              <Progress value={driver.avgAlertness} className="w-16" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                driver.incidents === 0 ? "default" : driver.incidents <= 2 ? "secondary" : "destructive"
                              }
                            >
                              {driver.incidents}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">{driver.score}</span>
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  driver.score >= 9
                                    ? "bg-green-500"
                                    : driver.score >= 8
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-3 w-3" />
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
                    <CardTitle>Top Performers</CardTitle>
                    <CardDescription>Highest safety scores this month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockDriverPerformance
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 3)
                      .map((driver, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span className="font-medium">{driver.name}</span>
                          </div>
                          <Badge className="bg-green-500 text-white">{driver.score}/10</Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Training Recommendations</CardTitle>
                    <CardDescription>Suggested improvements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <p className="text-sm font-medium">Mike Chen</p>
                      <p className="text-xs text-muted-foreground">Recommend fatigue management training</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm font-medium">Lisa Wong</p>
                      <p className="text-xs text-muted-foreground">Schedule wellness check-in</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-sm font-medium">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Excellent performance - consider mentoring role</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Reports</CardTitle>
                  <CardDescription>Create detailed fleet and driver reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-24 flex-col space-y-2 bg-transparent">
                      <TrendingUp className="h-6 w-6" />
                      <span>Fleet Performance Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 bg-transparent">
                      <Users className="h-6 w-6" />
                      <span>Driver Safety Report</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 bg-transparent">
                      <AlertTriangle className="h-6 w-6" />
                      <span>Incident Analysis</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 bg-transparent">
                      <Clock className="h-6 w-6" />
                      <span>Time & Attendance</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 bg-transparent">
                      <MapPin className="h-6 w-6" />
                      <span>Route Analysis</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex-col space-y-2 bg-transparent">
                      <Shield className="h-6 w-6" />
                      <span>Compliance Report</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                  <CardDescription>Previously generated reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Monthly Fleet Performance - June 2024</p>
                        <p className="text-sm text-muted-foreground">Generated 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Driver Safety Analysis - Q2 2024</p>
                        <p className="text-sm text-muted-foreground">Generated 1 week ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Incident Report - May 2024</p>
                        <p className="text-sm text-muted-foreground">Generated 2 weeks ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
    </div>
  )
}
