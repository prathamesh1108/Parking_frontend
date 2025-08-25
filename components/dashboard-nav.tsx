"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Car, Calendar, CreditCard, MapPin, Settings, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Car className="h-5 w-5" />,
  },
  {
    title: "Reservations",
    href: "/dashboard/reservations",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "My Vehicles",
    href: "/dashboard/vehicles",
    icon: <MapPin className="h-5 w-5" />,
  }
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <div className="hidden md:flex h-screen w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Car className="h-5 w-5" />
            <span>ParkingApp</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground",
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          {user && (
            <div className="mb-4 px-3 py-2">
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-b">
        <div className="flex h-14 items-center px-4 justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Car className="h-5 w-5" />
            <span>ParkingApp</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileNavOpen && (
          <nav className="grid items-start gap-2 p-4 text-sm font-medium border-t">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground",
                )}
                onClick={() => setMobileNavOpen(false)}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
            {user && (
              <div className="mt-4 px-3 py-2 border-t">
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <Button variant="outline" className="mt-4 w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        )}
      </div>
    </>
  )
}

