"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { reservationApi } from "@/lib/api"
import type { ReservationDto } from "@/types"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function ReservationsPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [reservations, setReservations] = useState<ReservationDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchReservations = async () => {
      if (!token) return

      try {
        const data = await reservationApi.getUserReservations(token)
        setReservations(data)
      } catch (error) {
        console.error("Error fetching reservations:", error)
        toast({
          title: "Error",
          description: "Failed to load reservations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [token, toast])

  const handleCancelReservation = async (reservationId: number) => {
    if (!token) return

    try {
      await reservationApi.cancelReservation(token, reservationId)

      // Update the local state
      setReservations((prevReservations) =>
        prevReservations.map((res) => (res.id === reservationId ? { ...res, status: "CANCELLED" } : res)),
      )

      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled successfully.",
      })
    } catch (error) {
      console.error("Error cancelling reservation:", error)
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.locationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.spaceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h2 className="text-3xl font-bold tracking-tight">Reservations</h2>
        <Link href="/dashboard/reservations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reservations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Reservations</CardTitle>
          <CardDescription>View and manage your parking reservations</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReservations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Spot</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.reservationCode}</TableCell>
                    <TableCell>{reservation.locationName}</TableCell>
                    <TableCell>{reservation.spaceNumber}</TableCell>
                    <TableCell>
                      {format(new Date(reservation.startTime), "MM/dd/yyyy")}{" "}
                      {format(new Date(reservation.startTime), "HH:mm")} -{" "}
                      {format(new Date(reservation.endTime), "HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          reservation.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : reservation.status === "UPCOMING"
                              ? "bg-blue-100 text-blue-800"
                              : reservation.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {reservation.status}
                      </div>
                    </TableCell>
                    <TableCell>${reservation.price?.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={reservation.status === "CANCELLED" || reservation.status === "COMPLETED"}
                        onClick={() => reservation.id && handleCancelReservation(reservation.id)}
                      >
                        {reservation.status === "CANCELLED" || reservation.status === "COMPLETED" ? "View" : "Cancel"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No reservations found</p>
              <Link href="/dashboard/reservations/new" className="mt-4">
                <Button variant="outline" size="sm">
                  Create Reservation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

