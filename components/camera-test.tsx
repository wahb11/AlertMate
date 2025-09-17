"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CameraTest() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState("Ready to test")
  const [cameraInfo, setCameraInfo] = useState<string>("")

  const testCamera = async () => {
    try {
      setError(null)
      setStatus("Testing camera access...")
      console.log("🎬 Starting camera test...")

      // First, list available devices
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      console.log("📹 Available video devices:", videoDevices)
      setCameraInfo(`Found ${videoDevices.length} camera device(s)`)

      if (videoDevices.length === 0) {
        throw new Error("No camera devices found")
      }

      // Try to get user media with basic constraints
      setStatus("Requesting camera permission...")
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false 
      })

      console.log("✅ Camera stream obtained:", stream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        
        // Wait for metadata
        videoRef.current.onloadedmetadata = () => {
          console.log("📺 Video metadata loaded:", {
            width: videoRef.current?.videoWidth,
            height: videoRef.current?.videoHeight
          })
          setStatus(`Camera active: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`)
        }

        // Start playing
        await videoRef.current.play()
        setIsRunning(true)
        console.log("▶️ Video playback started")
      }

    } catch (err: any) {
      console.error("❌ Camera test failed:", err)
      setError(`Camera test failed: ${err.message}`)
      setStatus("Camera test failed")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => {
        console.log("🛑 Stopping track:", track.kind)
        track.stop()
      })
      videoRef.current.srcObject = null
    }
    setIsRunning(false)
    setStatus("Camera stopped")
    console.log("🛑 Camera test stopped")
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Camera Test</CardTitle>
        <p className="text-sm text-muted-foreground">Test camera access separately from face detection</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Status: {status}</p>
            {cameraInfo && <p className="text-sm text-muted-foreground">{cameraInfo}</p>}
          </div>
          <div className="space-x-2">
            {!isRunning ? (
              <Button onClick={testCamera}>Test Camera</Button>
            ) : (
              <Button onClick={stopCamera} variant="outline">Stop</Button>
            )}
          </div>
        </div>

        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />
          {!isRunning && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <span>Click "Test Camera" to start</span>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>This test helps debug camera access issues. Check the browser console for detailed logs.</p>
        </div>
      </CardContent>
    </Card>
  )
}
