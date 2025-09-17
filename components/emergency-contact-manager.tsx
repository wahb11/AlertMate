"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Phone, Plus, Edit, Trash2, AlertTriangle, CheckCircle, Clock, MessageSquare, Mail } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email?: string
  priority: "primary" | "secondary" | "tertiary"
  notificationMethods: ("sms" | "call" | "email")[]
  isActive: boolean
}

interface EmergencyContactManagerProps {
  userRole: "driver" | "passenger" | "owner" | "admin"
}

const mockContacts: EmergencyContact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    relationship: "Spouse",
    phone: "+1 (555) 123-4567",
    email: "sarah@example.com",
    priority: "primary",
    notificationMethods: ["call", "sms", "email"],
    isActive: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    relationship: "Fleet Manager",
    phone: "+1 (555) 987-6543",
    email: "mike@company.com",
    priority: "secondary",
    notificationMethods: ["sms", "email"],
    isActive: true,
  },
  {
    id: "3",
    name: "Emergency Services",
    relationship: "911",
    phone: "911",
    priority: "primary",
    notificationMethods: ["call"],
    isActive: true,
  },
]

export function EmergencyContactManager({ userRole }: EmergencyContactManagerProps) {
  const [contacts, setContacts] = useState<EmergencyContact[]>(mockContacts)
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [lastEmergencyTest, setLastEmergencyTest] = useState("2 weeks ago")

  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    priority: "secondary",
    notificationMethods: ["sms"],
    isActive: true,
  })

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: EmergencyContact = {
        id: Date.now().toString(),
        name: newContact.name,
        relationship: newContact.relationship || "",
        phone: newContact.phone,
        email: newContact.email,
        priority: newContact.priority as "primary" | "secondary" | "tertiary",
        notificationMethods: newContact.notificationMethods || ["sms"],
        isActive: true,
      }
      setContacts([...contacts, contact])
      setNewContact({
        name: "",
        relationship: "",
        phone: "",
        email: "",
        priority: "secondary",
        notificationMethods: ["sms"],
        isActive: true,
      })
      setIsAddingContact(false)
    }
  }

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id))
  }

  const handleToggleContact = (id: string) => {
    setContacts(contacts.map((contact) => (contact.id === id ? { ...contact, isActive: !contact.isActive } : contact)))
  }

  const triggerEmergencyTest = () => {
    setEmergencyActive(true)
    setLastEmergencyTest("Just now")
    setTimeout(() => {
      setEmergencyActive(false)
    }, 3000)
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      primary: "bg-red-500 text-white",
      secondary: "bg-orange-500 text-white",
      tertiary: "bg-blue-500 text-white",
    }
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>
  }

  const getNotificationIcons = (methods: string[]) => {
    return (
      <div className="flex space-x-1">
        {methods.includes("call") && <Phone className="h-3 w-3 text-green-500" />}
        {methods.includes("sms") && <MessageSquare className="h-3 w-3 text-blue-500" />}
        {methods.includes("email") && <Mail className="h-3 w-3 text-purple-500" />}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Emergency Status Alert */}
      {emergencyActive && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 dark:text-red-300 font-medium">
            Emergency notification system activated! All contacts are being notified.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Emergency Actions */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Emergency Actions</CardTitle>
          <CardDescription>Quick access to emergency functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              size="lg"
              className="h-16 bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setEmergencyActive(true)}
            >
              <Phone className="h-6 w-6 mr-2" />
              Emergency Alert
            </Button>
            <Button size="lg" variant="outline" className="h-16 bg-transparent" onClick={triggerEmergencyTest}>
              <CheckCircle className="h-6 w-6 mr-2" />
              Test System
            </Button>
            <Button size="lg" variant="outline" className="h-16 bg-transparent">
              <Clock className="h-6 w-6 mr-2" />
              View History
            </Button>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Last system test: {lastEmergencyTest} • {contacts.filter((c) => c.isActive).length} active contacts
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>Manage your emergency contact list</CardDescription>
            </div>
            <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>Add a new contact to your emergency notification list</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        placeholder="Spouse, Manager, etc."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={newContact.priority}
                      onValueChange={(value) =>
                        setNewContact({ ...newContact, priority: value as "primary" | "secondary" | "tertiary" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary (Immediate notification)</SelectItem>
                        <SelectItem value="secondary">Secondary (After 30 seconds)</SelectItem>
                        <SelectItem value="tertiary">Tertiary (After 2 minutes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notification Methods</Label>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="call"
                          checked={newContact.notificationMethods?.includes("call")}
                          onChange={(e) => {
                            const methods = newContact.notificationMethods || []
                            if (e.target.checked) {
                              setNewContact({ ...newContact, notificationMethods: [...methods, "call"] })
                            } else {
                              setNewContact({
                                ...newContact,
                                notificationMethods: methods.filter((m) => m !== "call"),
                              })
                            }
                          }}
                        />
                        <Label htmlFor="call">Phone Call</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sms"
                          checked={newContact.notificationMethods?.includes("sms")}
                          onChange={(e) => {
                            const methods = newContact.notificationMethods || []
                            if (e.target.checked) {
                              setNewContact({ ...newContact, notificationMethods: [...methods, "sms"] })
                            } else {
                              setNewContact({
                                ...newContact,
                                notificationMethods: methods.filter((m) => m !== "sms"),
                              })
                            }
                          }}
                        />
                        <Label htmlFor="sms">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="email-method"
                          checked={newContact.notificationMethods?.includes("email")}
                          onChange={(e) => {
                            const methods = newContact.notificationMethods || []
                            if (e.target.checked) {
                              setNewContact({ ...newContact, notificationMethods: [...methods, "email"] })
                            } else {
                              setNewContact({
                                ...newContact,
                                notificationMethods: methods.filter((m) => m !== "email"),
                              })
                            }
                          }}
                        />
                        <Label htmlFor="email-method">Email</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddContact}>Add Contact</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Methods</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.relationship}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{contact.phone}</div>
                      {contact.email && <div className="text-xs text-muted-foreground">{contact.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(contact.priority)}</TableCell>
                  <TableCell>{getNotificationIcons(contact.notificationMethods)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={contact.isActive}
                      onCheckedChange={() => handleToggleContact(contact.id)}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(contact.id)}>
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

      {/* Emergency Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Message Templates</CardTitle>
          <CardDescription>Pre-configured messages for different emergency scenarios</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-red-600">Critical Drowsiness Alert</h4>
              <p className="text-sm text-muted-foreground mt-1">
                "EMERGENCY: Driver showing critical drowsiness signs. Vehicle: [VEHICLE_ID], Location: [GPS_LOCATION],
                Time: [TIMESTAMP]. Immediate attention required."
              </p>
              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                Edit Template
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-orange-600">SOS Alert</h4>
              <p className="text-sm text-muted-foreground mt-1">
                "SOS ALERT: Emergency assistance requested. Driver: [DRIVER_NAME], Vehicle: [VEHICLE_ID], Location:
                [GPS_LOCATION]. Please respond immediately."
              </p>
              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                Edit Template
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-blue-600">System Malfunction</h4>
              <p className="text-sm text-muted-foreground mt-1">
                "SYSTEM ALERT: Drowsiness detection system malfunction detected. Vehicle: [VEHICLE_ID], Driver:
                [DRIVER_NAME]. Manual monitoring recommended."
              </p>
              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                Edit Template
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-green-600">All Clear</h4>
              <p className="text-sm text-muted-foreground mt-1">
                "UPDATE: Previous alert resolved. Driver is alert and safe. Vehicle: [VEHICLE_ID], Status: Normal
                operations resumed."
              </p>
              <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                Edit Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency System Settings</CardTitle>
          <CardDescription>Configure emergency notification behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-escalation">Auto-escalation</Label>
                  <p className="text-sm text-muted-foreground">Automatically escalate to next priority level</p>
                </div>
                <Switch id="auto-escalation" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="location-sharing">Share GPS Location</Label>
                  <p className="text-sm text-muted-foreground">Include precise location in emergency alerts</p>
                </div>
                <Switch id="location-sharing" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="driver-info">Include Driver Details</Label>
                  <p className="text-sm text-muted-foreground">Add driver name and photo to alerts</p>
                </div>
                <Switch id="driver-info" defaultChecked />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="escalation-delay">Escalation Delay</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retry-attempts">Retry Attempts</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 attempt</SelectItem>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-hours">Quiet Hours</Label>
                <div className="flex space-x-2">
                  <Input placeholder="10:00 PM" />
                  <span className="self-center">to</span>
                  <Input placeholder="6:00 AM" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency History */}
      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Emergency Alert History</CardTitle>
            <CardDescription>Recent emergency notifications and system tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Critical drowsiness alert sent</p>
                  <p className="text-xs text-muted-foreground">Vehicle V004 - Lisa Wong - 2 hours ago</p>
                </div>
                <Badge className="bg-red-500 text-white">Critical</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System test completed successfully</p>
                  <p className="text-xs text-muted-foreground">All contacts notified - 2 weeks ago</p>
                </div>
                <Badge className="bg-green-500 text-white">Test</Badge>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <Phone className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">SOS alert triggered</p>
                  <p className="text-xs text-muted-foreground">Vehicle V002 - Sarah Johnson - 1 week ago</p>
                </div>
                <Badge className="bg-orange-500 text-white">SOS</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
