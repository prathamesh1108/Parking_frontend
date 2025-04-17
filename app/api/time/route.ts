import { NextResponse } from "next/server"

export async function GET() {
  // Simple response with current timestamp
  return NextResponse.json({
    timestamp: Date.now(),
    iso8601: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  })
}

