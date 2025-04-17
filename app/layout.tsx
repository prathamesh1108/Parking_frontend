import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"
import { TimeSync } from "@/components/time-sync"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ParkingApp - Smart Parking Management",
  description: "Manage parking spaces and vehicle locations efficiently",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {/* TimeSync component will only run on the client */}
            <TimeSync />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



