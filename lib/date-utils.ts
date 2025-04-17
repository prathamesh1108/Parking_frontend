// Server time offset in milliseconds
let serverTimeOffset = 0
let syncAttempted = false

/**
 * Checks if the API URL is properly configured
 */
function hasValidApiUrl(): boolean {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  return !!apiUrl && apiUrl.trim() !== ""
}

/**
 * Synchronizes the client clock with the server
 * Returns true if synchronization was successful, false otherwise
 */
export async function syncWithServerTime(): Promise<boolean> {
  // Only run in browser environment
  if (typeof window === "undefined") {
    return false
  }

  // Mark that we've attempted sync
  syncAttempted = true

  // Try local API route first (this should always work)
  try {
    const beforeRequest = Date.now()
    const response = await fetch("/api/time", {
      cache: "no-store",
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(3000),
    })

    if (response.ok) {
      const afterRequest = Date.now()
      const networkLatency = Math.round((afterRequest - beforeRequest) / 2)
      const data = await response.json()
      const serverTime = data.timestamp
      const clientTime = beforeRequest + networkLatency
      serverTimeOffset = serverTime - clientTime
      console.log(`Clock synchronized with local API. Offset: ${serverTimeOffset}ms`)
      return true
    }
  } catch (localError) {
    console.warn("Local time sync failed, trying remote API:", localError)
  }

  // Only try the remote API if we have a valid URL
  if (hasValidApiUrl()) {
    try {
      // Record the time before the request
      const beforeRequest = Date.now()

      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      // Fetch server time with timeout and error handling
      const response = await fetch(`${apiUrl}/api/time/server-time`, {
        cache: "no-store",
        // Don't include credentials by default as it can cause CORS issues
        // credentials: 'include',
        // Add a timeout to prevent hanging requests
        signal: AbortSignal.timeout(3000),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }

      // Record the time after the request
      const afterRequest = Date.now()

      // Calculate the network latency (round trip / 2)
      const networkLatency = Math.round((afterRequest - beforeRequest) / 2)

      const data = await response.json()
      const serverTime = data.timestamp

      // Client time at the moment the server responded (accounting for network latency)
      const clientTime = beforeRequest + networkLatency

      // Calculate the offset
      serverTimeOffset = serverTime - clientTime

      console.log(`Clock synchronized with remote API. Offset: ${serverTimeOffset}ms`)
      return true
    } catch (error) {
      console.error("Failed to sync with remote server time:", error)
    }
  } else {
    console.warn("NEXT_PUBLIC_API_URL is not properly configured")
  }

  // If all sync attempts failed, use fallback
  initializeFallbackTimeSync()
  return false
}

/**
 * Fallback method to estimate server time without making a network request
 * This is less accurate but better than nothing if the server time endpoint fails
 */
export function initializeFallbackTimeSync(): void {
  // If we already have a time offset from a successful sync, don't override it
  if (syncAttempted && serverTimeOffset !== 0) return

  console.log("Using fallback time synchronization")
  // Don't set any offset - just use the client's local time
  // This is safer than setting an arbitrary offset that might cause issues
  serverTimeOffset = 0
}

/**
 * Gets the current time adjusted to match the server time
 * Falls back to local time if no sync has occurred
 */
export function getAdjustedTime(): Date {
  return new Date(Date.now() + serverTimeOffset)
}

/**
 * Validates if a date is in the future (according to server time)
 * Adds a 5-minute tolerance to account for clock differences
 */
export function isDateInFuture(date: Date): boolean {
  const now = getAdjustedTime()
  // Add 5 minutes tolerance
  now.setMinutes(now.getMinutes() - 5)
  return date > now
}

/**
 * Validates if an end date is after a start date
 */
export function isEndDateAfterStartDate(startDate: Date, endDate: Date): boolean {
  return endDate > startDate
}

/**
 * Validates if a reservation duration is valid (between 30 minutes and 24 hours)
 */
export function isReservationDurationValid(startDate: Date, endDate: Date): boolean {
  const durationMs = endDate.getTime() - startDate.getTime()
  const minDurationMs = 30 * 60 * 1000 // 30 minutes
  const maxDurationMs = 24 * 60 * 60 * 1000 // 24 hours

  return durationMs >= minDurationMs && durationMs <= maxDurationMs
}

