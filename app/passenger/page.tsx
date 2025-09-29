"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Navigation is provided by app/passenger/layout.tsx
import {
  Phone,
  AlertTriangle,
  Shield,
  Eye,
  MapPin,
  Clock,
  Activity,
  Volume2,
  MessageSquare,
  Car,
  Heart,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock real-time driver data
const mockDriverData = [
  { time: "14:00", alertness: 95 },
  { time: "14:15", alertness: 92 },
  { time: "14:30", alertness: 88 },
  { time: "14:45", alertness: 85 },
  { time: "15:00", alertness: 82 },
  { time: "15:15", alertness: 78 },
]

export default function PassengerDashboard() {
  const [driverAlertness, setDriverAlertness] = useState(82)
  const [currentSpeed, setCurrentSpeed] = useState(65)
  const [tripProgress, setTripProgress] = useState(45)
  const [estimatedArrival, setEstimatedArrival] = useState("3:45 PM")
  const [sosActive, setSosActive] = useState(false)
  const [emergencyContacted, setEmergencyContacted] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverAlertness((prev) => {
        const change = (Math.random() - 0.5) * 8
        return Math.max(60, Math.min(100, prev + change))
      })
      setCurrentSpeed((prev) => {
        const change = (Math.random() - 0.5) * 10
        return Math.max(0, Math.min(80, prev + change))
      })
      setTripProgress((prev) => Math.min(100, prev + 0.5))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleSOS = () => {
    setSosActive(true)
    setEmergencyContacted(true)
    // In a real app, this would trigger emergency protocols
    setTimeout(() => {
      setSosActive(false)
    }, 5000)
  }

  const getDriverStatus = (alertness: number) => {
    if (alertness >= 85) return { status: "Excellent", color: "bg-green-500", textColor: "text-green-700" }
    if (alertness >= 75) return { status: "Good", color: "bg-yellow-500", textColor: "text-yellow-700" }
    if (alertness >= 65) return { status: "Caution", color: "bg-orange-500", textColor: "text-orange-700" }
    return { status: "Critical", color: "bg-red-500", textColor: "text-red-700" }
  }

  const driverStatus = getDriverStatus(driverAlertness)

  return (
    <div className="p-4 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Passenger Safety Monitor</h1>
            <p className="text-muted-foreground">Real-time driver monitoring and emergency controls</p>
          </div>

          {/* Critical Alert */}
          {driverAlertness < 70 && (
            <Alert className="border-destructive bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive font-medium">
                Driver showing signs of drowsiness. Consider suggesting a break or using emergency controls.
              </AlertDescription>
            </Alert>
          )}

          {/* SOS Emergency Button */}
          <Card className="border-2 border-red-200 dark:border-red-800">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600 dark:text-red-400">Emergency Controls</CardTitle>
              <CardDescription>Use only in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button
                size="lg"
                className={`w-full h-16 text-lg font-bold ${
                  sosActive ? "bg-red-600 hover:bg-red-700 animate-pulse" : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={handleSOS}
                disabled={sosActive}
              >
                <Phone className="h-6 w-6 mr-2" />
                {sosActive ? "SOS ACTIVATED" : "EMERGENCY SOS"}
              </Button>
              {emergencyContacted && (
                <div className="text-sm text-green-600 dark:text-green-400">
                  ✓ Emergency contacts have been notified
                </div>
              )}
            </CardContent>
          </Card>

          {/* Driver Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Driver Alertness</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{driverAlertness}%</div>
                <Badge className={`${driverStatus.color} text-white mt-2`}>{driverStatus.status}</Badge>
                <Progress value={driverAlertness} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Speed</CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentSpeed} mph</div>
                <p className="text-xs text-muted-foreground">Highway 101 North</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trip Progress</CardTitle>
                <Navigation className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tripProgress.toFixed(0)}%</div>
                <Progress value={tripProgress} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">ETA: {estimatedArrival}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Safety Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-2 w-2 rounded-full ${driverAlertness >= 75 ? "bg-green-500" : "bg-orange-500"}`}
                  ></div>
                  <span className="text-sm">{driverAlertness >= 75 ? "Safe" : "Monitor"}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">All systems active</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="monitoring" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="monitoring">Live Status</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="safety">Safety Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Driver Alertness Trend</CardTitle>
                    <CardDescription>Real-time monitoring over the last 90 minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockDriverData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[60, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="alertness"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trip Information</CardTitle>
                    <CardDescription>Current journey details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Departure</span>
                      <span className="text-sm">San Francisco, CA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Destination</span>
                      <span className="text-sm">Los Angeles, CA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Distance Remaining</span>
                      <span className="text-sm">245 miles</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Estimated Arrival</span>
                      <span className="text-sm font-bold">{estimatedArrival}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Driver Break Due</span>
                      <span className="text-sm text-orange-600">In 45 minutes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Driver Health Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle>Driver Health Indicators</CardTitle>
                  <CardDescription>Real-time biometric and behavioral monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Eye className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">Normal</div>
                      <div className="text-xs text-muted-foreground">Eye Movement</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                      <div className="text-2xl font-bold">72 BPM</div>
                      <div className="text-xs text-muted-foreground">Heart Rate</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">Stable</div>
                      <div className="text-xs text-muted-foreground">Head Position</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">2h 15m</div>
                      <div className="text-xs text-muted-foreground">Drive Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Driver Communication</CardTitle>
                    <CardDescription>Safe communication options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Pre-written Message
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Voice Message
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Suggest Rest Stop
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Request Call Back
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Messages</CardTitle>
                    <CardDescription>Pre-written safe messages</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <div className="font-medium">"How are you feeling?"</div>
                        <div className="text-xs text-muted-foreground">Check driver wellness</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <div className="font-medium">"Let's take a break soon"</div>
                        <div className="text-xs text-muted-foreground">Suggest rest stop</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <div className="font-medium">"I'm concerned about your alertness"</div>
                        <div className="text-xs text-muted-foreground">Express safety concern</div>
                      </div>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left h-auto p-3">
                      <div>
                        <div className="font-medium">"Everything looks good!"</div>
                        <div className="text-xs text-muted-foreground">Positive feedback</div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Location</CardTitle>
                  <CardDescription>Real-time vehicle tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-muted-foreground">Interactive map would be displayed here</p>
                      <p className="text-sm text-muted-foreground">Current: Highway 101, Mile Marker 245</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">65 mph</div>
                      <div className="text-xs text-muted-foreground">Current Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">245 mi</div>
                      <div className="text-xs text-muted-foreground">Distance Left</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nearby Services</CardTitle>
                  <CardDescription>Rest stops and emergency services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Shell Gas Station</div>
                      <div className="text-sm text-muted-foreground">2.3 miles ahead</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Navigate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Rest Area - Mile 250</div>
                      <div className="text-sm text-muted-foreground">5.1 miles ahead</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Navigate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Hospital - Mercy General</div>
                      <div className="text-sm text-muted-foreground">8.7 miles away</div>
                    </div>
                    <Button size="sm" variant="outline">
                      Navigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="safety" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Actions</CardTitle>
                    <CardDescription>Immediate safety controls</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="destructive" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Call 911
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-orange-500 text-orange-600 bg-transparent"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Alert Driver (Sound)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Emergency Contacts
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MapPin className="h-4 w-4 mr-2" />
                      Share Location with Family
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Safety Checklist</CardTitle>
                    <CardDescription>Pre-trip and ongoing safety measures</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Driver alertness monitoring active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Emergency contacts configured</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">GPS tracking enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Driver break recommended in 45 min</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Vehicle systems normal</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact Information</CardTitle>
                  <CardDescription>Quick access to important contacts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium">Primary Emergency Contact</div>
                      <div className="text-sm text-muted-foreground">Sarah Johnson (Spouse)</div>
                      <div className="text-sm">+1 (555) 123-4567</div>
                      <Button size="sm" className="mt-2">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium">Fleet Manager</div>
                      <div className="text-sm text-muted-foreground">Mike Chen</div>
                      <div className="text-sm">+1 (555) 987-6543</div>
                      <Button size="sm" className="mt-2">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
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
