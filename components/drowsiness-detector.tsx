"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaceMesh } from "@mediapipe/face_mesh"
import { Camera } from "@mediapipe/camera_utils"
import * as drawingUtils from "@mediapipe/drawing_utils"

// Safe logging function
const safeLog = (message: string, ...args: any[]) => {
  try {
    if (typeof window !== 'undefined' && window.console && window.console.log) {
      window.console.log(message, ...args)
    }
  } catch (e) {
    // Silently fail if console is not available
  }
}

const safeWarn = (message: string, ...args: any[]) => {
  try {
    if (typeof window !== 'undefined' && window.console && window.console.warn) {
      window.console.warn(message, ...args)
    }
  } catch (e) {
    // Silently fail if console is not available
  }
}

const safeError = (message: string, ...args: any[]) => {
  try {
    if (typeof window !== 'undefined' && window.console && window.console.error) {
      window.console.error(message, ...args)
    }
  } catch (e) {
    // Silently fail if console is not available
  }
}

// Lightweight helpers
type Point = { x: number; y: number; z?: number }

function euclideanDistance(a: Point, b: Point) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.hypot(dx, dy)
}

// EAR using 6 landmarks: [p1, p2, p3, p4, p5, p6]
function computeEAR(eye: Point[]) {
  if (eye.length < 6) return 0
  const A = euclideanDistance(eye[1], eye[5])
  const B = euclideanDistance(eye[2], eye[4])
  const C = euclideanDistance(eye[0], eye[3])
  if (C === 0) return 0
  return (A + B) / (2.0 * C)
}

// MAR using MediaPipe FaceMesh landmarks
// MediaPipe lip landmarks: 
// - Upper lip: 12, 15 (center top)
// - Lower lip: 16, 17 (center bottom) 
// - Left corner: 61
// - Right corner: 291
function computeMAR(landmarks: Point[]) {
  if (!landmarks || landmarks.length < 468) {
    return 0
  }
  
  try {
    // Using more reliable MediaPipe mouth landmarks
    const upperLipCenter = landmarks[12] // Upper lip center
    const lowerLipCenter = landmarks[15] // Lower lip center
    const leftCorner = landmarks[61]     // Left mouth corner
    const rightCorner = landmarks[291]   // Right mouth corner
    
    // Validate landmarks exist
    if (!upperLipCenter || !lowerLipCenter || !leftCorner || !rightCorner) {
      return 0
    }
    
    const verticalDistance = euclideanDistance(upperLipCenter, lowerLipCenter)
    const horizontalDistance = euclideanDistance(leftCorner, rightCorner)
    
    if (horizontalDistance === 0) return 0
    
    const mar = verticalDistance / horizontalDistance
    return mar
  } catch (error) {
    safeWarn("MAR calculation error:", error)
    return 0
  }
}

// FaceMesh landmark indices used for EAR (from MediaPipe FaceMesh 468-landmarks)
// Left eye: 33 (outer), 160, 158, 133 (inner), 153, 144
// Right eye: 362 (outer), 385, 387, 263 (inner), 373, 380
const LEFT_EYE_IDXS = [33, 160, 158, 133, 153, 144]
const RIGHT_EYE_IDXS = [362, 385, 387, 263, 373, 380]

// Thresholds aligned with Python logic but tuned for normalized 2D landmarks
const DEFAULT_EAR_THRESHOLD = 0.25
const MAR_THRESHOLD = 0.6
const HEAD_TILT_THRESHOLD_DEG = 20
const EAR_CONSEC_FRAMES = 20
const YAWN_CONSEC_FRAMES = 15

// Utilities to estimate simple head movement proxy from selected landmark triples
function estimateHeadAngles(face: Point[]) {
  // Use nose tip (1), chin (152), left eye outer (33), right eye outer (263)
  // This is a rough 2D proxy; for robust 3D use solvePnP with depth/camera matrix.
  const nose = face[1]
  const chin = face[152]
  const left = face[33]
  const right = face[263]
  if (!nose || !chin || !left || !right) return { pitch: 0, yaw: 0 }
  // Yaw proxy: horizontal nose offset relative to eye line midpoint
  const eyeMidX = (left.x + right.x) / 2
  const yaw = Math.abs(nose.x - eyeMidX) * 180 // heuristic scaling
  // Pitch proxy: vertical nose-to-chin distance vs eye-to-nose
  const eyeMidY = (left.y + right.y) / 2
  const pitch = Math.abs(eyeMidY - nose.y) / Math.max(Math.abs(chin.y - nose.y), 1e-6) * 90
  return { pitch, yaw }
}

// Simplified FaceMesh loading - now using direct imports

type DrowsinessDetectorProps = {
  onClose?: () => void
  onMetrics?: (data: { score: number; ear: number; mar: number }) => void
  autoStart?: boolean
  showControls?: boolean
}

export function DrowsinessDetector({ onClose, onMetrics, autoStart = false, showControls = true }: DrowsinessDetectorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const faceMeshRef = useRef<any>(null)
  const rafIdRef = useRef<number | null>(null)

  const [running, setRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [ear, setEar] = useState(0)
  const [mar, setMar] = useState(0)
  const [statusText, setStatusText] = useState("Ready")
  const [error, setError] = useState<string | null>(null)
  const [earThreshold, setEarThreshold] = useState(DEFAULT_EAR_THRESHOLD)
  const [isInitializing, setIsInitializing] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const earCounterRef = useRef<number>(0)
  const yawnCounterRef = useRef<number>(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const beepRef = useRef<{ stop: () => void } | null>(null)

  const start = useCallback(async () => {
    if (isInitializing || running) {
      safeLog("⚠️ Already initializing or running")
      return
    }
    
    try {
      setIsInitializing(true)
      setLoadingProgress(0)
      safeLog("🚀 Starting drowsiness detector...")
      setError(null)
      setStatusText("Initializing...")
      setRunning(false) // Ensure we start from stopped state
      
      // Check for camera API availability
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available. Use a modern browser with HTTPS/localhost.")
      }
      
      setStatusText("Requesting camera access...")
      setLoadingProgress(10)
      safeLog("📷 Requesting camera access...")
      let stream: MediaStream | null = null
      
      try {
        // First attempt with ideal constraints
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: "user" }, 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            frameRate: { ideal: 30 }
          },
          audio: false,
        })
        safeLog("✅ Camera stream obtained with ideal constraints")
        setLoadingProgress(30)
      } catch (primaryErr) {
        safeWarn("⚠️ Failed with ideal constraints, trying fallback...", primaryErr)
        
        try {
          // Fallback: Try with basic constraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          })
          safeLog("✅ Camera stream obtained with basic constraints")
        } catch (basicErr) {
          safeWarn("⚠️ Basic constraints failed, trying device enumeration...", basicErr)
          
          // Final fallback: enumerate and try specific devices
          const devices = await navigator.mediaDevices.enumerateDevices()
          const cams = devices.filter((d) => d.kind === "videoinput")
          safeLog(`📹 Found ${cams.length} camera devices:`, cams)
          
          if (cams.length === 0) {
            throw new Error("No camera devices found. Please connect a camera and refresh.")
          }
          
          // Try each camera device
          let lastError = basicErr
          for (const cam of cams) {
            try {
              stream = await navigator.mediaDevices.getUserMedia({ 
                video: { deviceId: { exact: cam.deviceId } }, 
                audio: false 
              })
              safeLog(`✅ Camera stream obtained using device: ${cam.label || cam.deviceId}`)
              break
            } catch (deviceErr) {
              safeWarn(`❌ Failed with device ${cam.label || cam.deviceId}:`, deviceErr)
              lastError = deviceErr
            }
          }
          
          if (!stream) {
            throw lastError
          }
        }
      }
      // Setup video element
      if (!videoRef.current) {
        throw new Error("Video element not available")
      }
      
      safeLog("📹 Setting up video stream...")
      setLoadingProgress(40)
      videoRef.current.srcObject = stream
      
      // Wait for video metadata to load with better error handling
      setStatusText("Loading video...")
      await new Promise<void>((resolve, reject) => {
        const video = videoRef.current!
        let resolved = false
        
        const onLoaded = () => {
          if (resolved) return
          resolved = true
          safeLog(`✅ Video metadata loaded: ${video.videoWidth}x${video.videoHeight}`)
          video.removeEventListener("loadedmetadata", onLoaded)
          video.removeEventListener("error", onError)
          resolve()
        }
        
        const onError = (e: Event) => {
          if (resolved) return
          resolved = true
          safeError("❌ Video error:", e)
          video.removeEventListener("loadedmetadata", onLoaded)
          video.removeEventListener("error", onError)
          reject(new Error("Video failed to load"))
        }
        
        video.addEventListener("loadedmetadata", onLoaded)
        video.addEventListener("error", onError)
        
        // Safety timeout with longer delay
        setTimeout(() => {
          if (resolved) return
          resolved = true
          safeWarn("⚠️ Video metadata timeout, proceeding anyway...")
          video.removeEventListener("loadedmetadata", onLoaded)
          video.removeEventListener("error", onError)
          resolve()
        }, 3000)
      })
      
      // Ensure proper video attributes
      videoRef.current.setAttribute("playsinline", "")
      videoRef.current.muted = true
      
      // Try to start video playback
      safeLog("▶️ Starting video playback...")
      try {
        await videoRef.current.play()
        safeLog("✅ Video playback started successfully")
        setLoadingProgress(50)
      } catch (playErr) {
        safeWarn("⚠️ Autoplay blocked, user interaction required:", playErr)
        setStatusText("Click Start to begin (autoplay blocked)")
        
        // Try to play on next user interaction
        const playOnInteraction = async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.play()
              safeLog("✅ Video playback started after user interaction")
              document.removeEventListener("click", playOnInteraction)
            } catch (e) {
              safeError("❌ Failed to play video even after interaction:", e)
            }
          }
        }
        document.addEventListener("click", playOnInteraction, { once: true })
      }
      setStatusText("Loading face mesh...")
      setLoadingProgress(60)
      safeLog("🤖 Initializing MediaPipe FaceMesh...")
      
      setLoadingProgress(75)
      safeLog("✅ FaceMesh constructor loaded")
      
      setStatusText("Initializing FaceMesh model...")
      
      const faceMesh = new FaceMesh({
        locateFile: (file) => `/mediapipe/${file}`,
      })
      
      if (!faceMesh) {
        throw new Error("Failed to create FaceMesh instance")
      }
      
      faceMeshRef.current = faceMesh
      safeLog("⚙️ Configuring FaceMesh options...")
      
      faceMesh.setOptions({
        selfieMode: true,
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
      
      safeLog("✅ FaceMesh configured successfully")
      setLoadingProgress(85)
      
      // Test FaceMesh with a small delay to ensure it's ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatusText("FaceMesh ready, starting detection...")
      setLoadingProgress(90)

      let lastEmit = 0
      let earEma = 0
      let marEma = 0
      const smoothing = 0.2
      faceMesh.onResults((results) => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) {
          safeWarn("⚠️ Canvas or video not available for results")
          return
        }
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          safeWarn("⚠️ Canvas context not available")
          return
        }

        // Update canvas size and draw video frame
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          safeLog(`🖼️ Canvas resized to: ${canvas.width}x${canvas.height}`)
        }
        
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height)

        if (results.multiFaceLandmarks) {
          for (const landmarks of results.multiFaceLandmarks) {
            // Draw face mesh
            drawingUtils.drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_TESSELATION, {
              color: "#C0C0C070",
              lineWidth: 1,
            })
            drawingUtils.drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_RIGHT_EYE, {
              color: "#FF3030",
            })
            drawingUtils.drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_LEFT_EYE, {
              color: "#30FF30",
            })
            drawingUtils.drawConnectors(ctx, landmarks, FaceMesh.FACEMESH_FACE_OVAL, {
              color: "#E0E0E0",
            })
          }
          
          const lm: Point[] = results.multiFaceLandmarks[0]
        
          
          // Build eyes arrays for EAR - with validation
          const leftEye = LEFT_EYE_IDXS.map((i) => lm[i]).filter(p => p && typeof p.x === 'number' && typeof p.y === 'number')
          const rightEye = RIGHT_EYE_IDXS.map((i) => lm[i]).filter(p => p && typeof p.x === 'number' && typeof p.y === 'number')
          
          safeLog(`👁️ Left eye landmarks: ${leftEye.length}, Right eye landmarks: ${rightEye.length}`)
          
          const earLeft = leftEye.length >= 6 ? computeEAR(leftEye) : 0
          const earRight = rightEye.length >= 6 ? computeEAR(rightEye) : 0
          const earAvg = leftEye.length >= 6 && rightEye.length >= 6 ? (earLeft + earRight) / 2 : 0

          safeLog(`👁️ EAR - Left: ${earLeft.toFixed(3)}, Right: ${earRight.toFixed(3)}, Avg: ${earAvg.toFixed(3)}`)

          // MAR using the fixed computeMAR function
          const marVal = computeMAR(lm)
          safeLog(`👄 MAR value: ${marVal.toFixed(3)} (threshold: ${MAR_THRESHOLD})`)

          // Head proxy
          const { pitch, yaw } = estimateHeadAngles(lm)
          safeLog(`👤 Head angles - Pitch: ${pitch.toFixed(1)}°, Yaw: ${yaw.toFixed(1)}°`)

          // Scores similar to Python normalization with debugging
          const eyeScore = Math.min(100, Math.max(0, (earThreshold - earAvg) * 400))
          const mouthScore = Math.min(100, Math.max(0, (marVal - MAR_THRESHOLD) * 200))
          const headMovement = Math.max(Math.abs(pitch), Math.abs(yaw))
          const headScore = Math.min(100, Math.max(0, (headMovement - HEAD_TILT_THRESHOLD_DEG) * 2))
          const drowsinessScore = Math.round(0.5 * eyeScore + 0.3 * mouthScore + 0.2 * headScore)
          
          safeLog(`📊 Scores - Eye: ${eyeScore.toFixed(1)}, Mouth: ${mouthScore.toFixed(1)}, Head: ${headScore.toFixed(1)}, Total: ${drowsinessScore}`)

          earEma = earEma === 0 ? earAvg : earEma * (1 - smoothing) + earAvg * smoothing
          marEma = marEma === 0 ? marVal : marEma * (1 - smoothing) + marVal * smoothing
          setEar(Number(earEma.toFixed(3)))
          setMar(Number(marEma.toFixed(3)))
          setScore(drowsinessScore)

          // Consecutive frame alerting like Python
          if (earEma < earThreshold) {
            earCounterRef.current += 1
          } else {
            earCounterRef.current = 0
          }
          if (marEma > MAR_THRESHOLD) {
            yawnCounterRef.current += 1
          } else {
            yawnCounterRef.current = 0
          }

          const drowsy = earCounterRef.current >= EAR_CONSEC_FRAMES
          const yawning = yawnCounterRef.current >= YAWN_CONSEC_FRAMES

          // Beep on alerts
          if ((drowsy || yawning) && !beepRef.current) {
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
              audioCtxRef.current = ctx
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.frequency.value = 1000
              gain.gain.value = 0.05
              osc.connect(gain).connect(ctx.destination)
              osc.start()
              const stop = () => {
                try { osc.stop() } catch {}
                try { gain.disconnect() } catch {}
                try { ctx.close() } catch {}
                beepRef.current = null
                audioCtxRef.current = null
              }
              beepRef.current = { stop }
              setTimeout(stop, 500)
            } catch {}
          }

          const now = Date.now()
          if (onMetrics && now - lastEmit > 200) {
            lastEmit = now
            onMetrics({ score: drowsinessScore, ear: Number(earEma.toFixed(3)), mar: Number(marEma.toFixed(3)) })
          }

          // Overlay status text
          let label = "Monitoring"
          if (drowsy) label = "DROWSINESS ALERT"
          else if (yawning) label = "YAWNING ALERT"
          ctx.fillStyle = drowsy ? "#ef4444" : yawning ? "#3b82f6" : "#22c55e"
          ctx.font = "16px sans-serif"
          ctx.fillText(`${label} | EAR: ${earEma.toFixed(2)} MAR: ${marEma.toFixed(2)} Score: ${drowsinessScore}`, 10, 24)
          setStatusText(label)
        } else {
          safeLog("🚫 No face detected in current frame")
          setStatusText("No face detected")
          // Reset metrics when no face is detected
          setEar(0)
          setMar(0)
          setScore(0)
          
          if (onMetrics) {
            onMetrics({ score: 0, ear: 0, mar: 0 })
          }
        }
        
        ctx.restore()
      })

      // Use MediaPipe Camera utility for better integration
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current! })
        },
        width: 640,
        height: 480,
      })

      setEarThreshold(DEFAULT_EAR_THRESHOLD)
      setStatusText("Starting monitoring...")
      
      // Start camera
      camera.start()
      
      // Set running state after everything is set up
      setLoadingProgress(100)
      setRunning(true)
      setIsInitializing(false)
      setStatusText("Monitoring...")
      safeLog("✅ Drowsiness detector started successfully")
    } catch (e: any) {
      const message = String(e?.message || e)
      safeError("🚨 Camera initialization failed:", e)
      
      let userFriendlyMessage = ""
      if (message.toLowerCase().includes("notallowederror") || message.toLowerCase().includes("permission")) {
        userFriendlyMessage = "Camera permission denied. Please allow camera access and try again."
      } else if (message.toLowerCase().includes("notfounderror") || message.toLowerCase().includes("overconstrained")) {
        userFriendlyMessage = "No camera found or selected device unavailable. Connect a camera and retry."
      } else if (message.toLowerCase().includes("notreadableerror")) {
        userFriendlyMessage = "Camera is already in use by another application. Please close other camera apps and try again."
      } else if (message.toLowerCase().includes("aborterror")) {
        userFriendlyMessage = "Camera access was aborted. Please try again."
      } else if (message.toLowerCase().includes("timeout")) {
        userFriendlyMessage = "Camera initialization timed out. Please check your camera connection and try again."
      } else {
        userFriendlyMessage = `Camera error: ${message}. Please check your camera connection and browser settings.`
      }
      
      setError(userFriendlyMessage)
      setStatusText("Failed to start")
      setLoadingProgress(0)
      setIsInitializing(false)
      stop()
    } finally {
      setIsInitializing(false)
      setLoadingProgress(0)
    }
  }, [running, isInitializing])

  const stop = useCallback(() => {
    setRunning(false)
    setIsInitializing(false)
    setLoadingProgress(0)
    const video = videoRef.current
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
      video.srcObject = null
    }
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    if (faceMeshRef.current?.close) {
      try { faceMeshRef.current.close() } catch {}
      faceMeshRef.current = null
    }
    // Stop any beep audio
    if (beepRef.current) {
      beepRef.current.stop()
      beepRef.current = null
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close() } catch {}
      audioCtxRef.current = null
    }
    setStatusText("Stopped")
  }, [])

  useEffect(() => {
    if (autoStart && !running) {
      // fire and forget
      start()
    }
    return () => {
      // cleanup on unmount
      const video = videoRef.current
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach((t) => t.stop())
      }
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (faceMeshRef.current?.close) {
        try { faceMeshRef.current.close() } catch {}
      }
      // Stop any beep audio
      if (beepRef.current) {
        beepRef.current.stop()
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close() } catch {}
      }
    }
  }, [autoStart, running])

  const statusBadge = useMemo(() => {
    if (!running) return <span className="text-xs px-2 py-1 rounded bg-muted">Idle</span>
    if (score > 70) return <span className="text-xs px-2 py-1 rounded bg-red-500 text-white">Alert</span>
    return <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">Monitoring</span>
  }, [running, score])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Drowsiness Detector</CardTitle>
        <div className="flex items-center gap-2">
          {statusBadge}
          {showControls && (
            running ? (
              <Button variant="outline" size="sm" onClick={stop}>Stop</Button>
            ) : isInitializing ? (
              <Button size="sm" disabled>Starting...</Button>
            ) : (
              <>
                <Button size="sm" onClick={start}>Start</Button>
                {error && (
                  <Button size="sm" variant="outline" onClick={() => { setError(null); start(); }}>Retry</Button>
                )}
              </>
            )
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={() => { stop(); onClose() }}>Close</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-3">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isInitializing && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Loading: {Math.round(loadingProgress)}%</span>
              <span className="text-muted-foreground">{statusText}</span>
            </div>
            <Progress value={loadingProgress} className="h-2" />
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black">
              <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{statusText}</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Drowsiness Score</span>
                <span className="text-sm font-medium">{score}</span>
              </div>
              <Progress value={score} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded border">
                <p className="text-xs text-muted-foreground">EAR</p>
                <p className="text-lg font-semibold">{ear.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded border">
                <p className="text-xs text-muted-foreground">MAR</p>
                <p className="text-lg font-semibold">{mar.toFixed(2)}</p>
              </div>
            </div>
            <div className="p-3 rounded bg-yellow-50 dark:bg-yellow-950">
              <p className="text-xs">Keep the camera steady and your face well-lit for best results.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DrowsinessDetector






