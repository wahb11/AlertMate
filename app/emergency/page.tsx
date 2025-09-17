"use client"

import { EmergencyContactManager } from "@/components/emergency-contact-manager"

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Emergency Contact Management</h1>
          <p className="text-muted-foreground">Configure and manage your emergency notification system</p>
        </div>
        <EmergencyContactManager userRole="driver" />
      </div>
    </div>
  )
}
