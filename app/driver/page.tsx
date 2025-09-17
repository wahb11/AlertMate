"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import DrowsinessDetector from "@/components/drowsiness-detector"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { CameraTest } from "@/components/camera-test"
import { Shield, Activity, Battery } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"

// Live data buffer for charts
type ChartPoint = { time: string; alertness: number; eyeClosure: number }

const mockTripData: any[] = []

export default function DriverDashboard() {
  const [currentAlertness, setCurrentAlertness] = useState(82)
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [tripDuration, setTripDuration] = useState("0m")
  const [detectorOpen, setDetectorOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [ear, setEar] = useState(0)
  const [mar, setMar] = useState(0)
  const [series, setSeries] = useState<ChartPoint[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getAlertnessBadge = (level: number) => {
    if (level >= 85) return <Badge className="bg-green-500">Excellent</Badge>
    if (level >= 75) return <Badge className="bg-yellow-500">Good</Badge>
    if (level >= 65) return <Badge className="bg-orange-500">Caution</Badge>
    return <Badge className="bg-red-500">Critical</Badge>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation userRole="driver" />

      {/* Main content with proper spacing for navigation */}
      <div className="flex-1 lg:ml-64">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Driver Dashboard</h1>
              <p className="text-muted-foreground">Real-time drowsiness monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog open={detectorOpen} onOpenChange={setDetectorOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2" onClick={() => setIsMonitoring(true)}>
                    <span>👁️</span>
                    <span>Start Monitoring</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Live Drowsiness Detection</DialogTitle>
                  </DialogHeader>
                  <DrowsinessDetector
                    autoStart
                    showControls={false}
                    onClose={() => setDetectorOpen(false)}
                    onMetrics={({ score, ear, mar }) => {
                      setCurrentAlertness(Math.max(0, Math.min(100, 100 - score)))
                      setEar(ear)
                      setMar(mar)
                      setSeries((prev) => {
                        const next = {
                          time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
                          alertness: Math.max(0, Math.min(100, 100 - score)),
                          eyeClosure: Math.round(Math.max(0, Math.min(100, (0.3 - ear) * 1000)))
                        }
                        const arr = [...prev, next]
                        return arr.length > 24 ? arr.slice(arr.length - 24) : arr
                      })
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Critical Alert */}
          {currentAlertness < 70 && (
            <Alert className="border-destructive bg-destructive/10">
              <span className="text-destructive">⚠️</span>
              <AlertDescription className="text-destructive font-medium">
                Critical drowsiness detected! Please pull over safely and take a break.
              </AlertDescription>
            </Alert>
          )}

          {/* Real-time Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Alertness</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentAlertness}%</div>
                <div className="flex items-center space-x-2 mt-2">{getAlertnessBadge(currentAlertness)}</div>
                <Progress value={currentAlertness} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">EAR / MAR</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">EAR {ear.toFixed(2)} • MAR {mar.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Live from camera</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">All Systems Active</span>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Battery: 87%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="monitoring" className="space-y-4">
            <TabsList>
              <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
              <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
              <TabsTrigger value="camera-test">Camera Test</TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Real-time Alertness</CardTitle>
                    <CardDescription>Live drowsiness detection from the camera</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isClient && (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={series.length ? series : []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[60, 100]} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="alertness"
                            stroke="hsl(var(--chart-1))"
                            fill="hsl(var(--chart-1))"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Eye Closure Detection</CardTitle>
                    <CardDescription>Percentage of time with eyes closed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isClient && (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={series.length ? series : []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="eyeClosure"
                            stroke="hsl(var(--chart-2))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--chart-2))" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions removed */}
            </TabsContent>


            <TabsContent value="alerts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Configuration</CardTitle>
                  <CardDescription>Customize your drowsiness detection alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Audio Alerts</h4>
                        <p className="text-sm text-muted-foreground">Sound alarm when drowsiness detected</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {alertsEnabled ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Vibration Alerts</h4>
                        <p className="text-sm text-muted-foreground">Device vibration for alerts</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Enabled
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Emergency Contacts</h4>
                        <p className="text-sm text-muted-foreground">Auto-notify contacts on critical alerts</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Sensitivity Level</h4>
                        <p className="text-sm text-muted-foreground">Adjust detection sensitivity</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Medium
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="camera-test" className="space-y-4">
              <div className="flex justify-center">
                <CameraTest />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
