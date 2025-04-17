"use client"

import { useEffect, useState } from "react"
import { syncWithServerTime, initializeFallbackTimeSync } from "@/lib/date-utils"

export function TimeSync() {
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "failed">("idle")

  useEffect(() => {
    // Only attempt sync once
    if (syncStatus !== "idle") return

    const performSync = async () => {
      setSyncStatus("syncing")

      try {
        // Wrap in a timeout to ensure it doesn't hang indefinitely
        const syncPromise = syncWithServerTime()

        // Set a timeout for the entire sync process
        const timeoutPromise = new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error("Time sync timed out")), 5000)
        })

        // Race the sync against the timeout
        const success = await Promise.race([syncPromise, timeoutPromise])
        setSyncStatus(success ? "success" : "failed")
      } catch (error) {
        console.error("Time sync error:", error)
        // Ensure fallback is initialized
        initializeFallbackTimeSync()
        setSyncStatus("failed")
      }
    }

    // Start the sync process
    performSync()

    // No need for periodic re-sync if the first one failed
    // It will likely fail again and just generate more errors

    // Clean up function
    return () => {
      // No cleanup needed
    }
  }, [syncStatus])

  // This component doesn't render anything
  return null
}

