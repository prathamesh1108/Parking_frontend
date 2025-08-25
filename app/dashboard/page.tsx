"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Calendar, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { reservationApi, parkingApi } from "@/lib/api"
import type { ReservationDto, ParkedVehicleDto } from "@/types"
import { format } from "date-fns"
import { ErrorMessage } from "@/components/ui/error-message"

export default function DashboardPage() {
  const { token } = useAuth()
  const [activeReservations, setActiveReservations] = useState<ReservationDto[]>([])
  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicleDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return

      setIsLoading(true)
      setError(null)

      try {
        const [reservationsResponse, parkedVehiclesResponse] = await Promise.all([
          reservationApi.getActiveReservations(token),
          parkingApi.getUserParkedVehicles(token),
        ])

        setActiveReservations(reservationsResponse)
        setParkedVehicles(parkedVehiclesResponse)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        let errorMessage = "Failed to load dashboard data. Please try again."
        if (error instanceof Error) {
          errorMessage = error.message
        }
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  if (isLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/reservations/new">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeReservations.length}</div>
                  <p className="text-xs text-muted-foreground">Current active reservations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parked Vehicles</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{parkedVehicles.length}</div>
                  <p className="text-xs text-muted-foreground">Currently parked vehicles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Spots</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Across all locations</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Current Reservations</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeReservations.length > 0 ? (
                    <div className="space-y-4">
                      {activeReservations.map((reservation) => (
                        <div key={reservation.id} className="flex items-center justify-between border-b pb-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Car className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {reservation.locationName} - {reservation.levelName}
                              </p>
                              <p className="text-sm text-muted-foreground">Spot #{reservation.spaceNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {format(new Date(reservation.startTime), "MMM d, h:mm a")} -
                              {format(new Date(reservation.endTime), "h:mm a")}
                            </p>
                            <p className="text-sm text-muted-foreground">{reservation.vehicleInfo}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No active reservations</p>
                      <Link href="/dashboard/reservations/new" className="mt-4">
                        <Button variant="outline" size="sm">
                          Create Reservation
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Parked Vehicle Location</CardTitle>
                  <CardDescription>Your currently parked vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  {parkedVehicles.length > 0 ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-40 w-full rounded-md bg-muted flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-1 w-full">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-primary" />
                          <p className="font-medium">{parkedVehicles[0].vehicleInfo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <p className="text-sm">
                            {parkedVehicles[0].locationName} - {parkedVehicles[0].levelName}, Spot #
                            {parkedVehicles[0].spaceNumber}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <p className="text-sm">
                            Parked at {format(new Date(parkedVehicles[0].parkedTime), "h:mm a")}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Get Directions
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6">
                      <MapPin className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No vehicles currently parked</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parking Analytics</CardTitle>
                <CardDescription>Your parking usage over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Analytics Coming Soon</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We're working on providing detailed analytics for your parking usage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parking Reports</CardTitle>
                <CardDescription>Download and view your parking reports</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">Reports Coming Soon</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We're working on providing detailed reports for your parking usage.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

