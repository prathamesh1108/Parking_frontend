"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"
import { parkingApi, vehicleApi, reservationApi } from "@/lib/api"
import type { ParkingLocationDto, VehicleDto, ReservationDto, ParkingSpaceDto } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function NewReservationPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState("14:00")
  const [endTime, setEndTime] = useState("18:00")
  const [locationId, setLocationId] = useState("")
  const [levelId, setLevelId] = useState("")
  const [spaceId, setSpaceId] = useState("")
  const [vehicleId, setVehicleId] = useState("")
  const [notes, setNotes] = useState("")

  const [locations, setLocations] = useState<ParkingLocationDto[]>([])
  const [levels, setLevels] = useState<any[]>([])
  const [spaces, setSpaces] = useState<ParkingSpaceDto[]>([])
  const [vehicles, setVehicles] = useState<VehicleDto[]>([])

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return

      try {
        const [locationsData, vehiclesData] = await Promise.all([
          parkingApi.getAllParkingLocations(token),
          vehicleApi.getUserVehicles(token),
        ])

        setLocations(locationsData)
        setVehicles(vehiclesData)

        // Set default vehicle if available
        const defaultVehicle = vehiclesData.find((v) => v.isDefault)
        if (defaultVehicle) {
          setVehicleId(defaultVehicle.id!.toString())
        } else if (vehiclesData.length > 0) {
          setVehicleId(vehiclesData[0].id!.toString())
        }
      } catch (error) {
        console.error("Error fetching initial data:", error)
        toast({
          title: "Error",
          description: "Failed to load required data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchInitialData()
  }, [token, toast])

  useEffect(() => {
    const fetchLevels = async () => {
      if (!token || !locationId) return

      try {
        const levelsData = await parkingApi.getLevelsByLocation(token, Number.parseInt(locationId))
        setLevels(levelsData)
        setLevelId("")
        setSpaceId("")
        setSpaces([])
      } catch (error) {
        console.error("Error fetching levels:", error)
        toast({
          title: "Error",
          description: "Failed to load parking levels. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchLevels()
  }, [token, locationId, toast])

  useEffect(() => {
    const fetchSpaces = async () => {
      if (!token || !levelId) return

      try {
        // This is a mock implementation - you'll need to create this endpoint in your backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parking/levels/${levelId}/spaces`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch parking spaces")
        }

        const spacesData = await response.json()
        setSpaces(spacesData)
        setSpaceId("")
      } catch (error) {
        console.error("Error fetching spaces:", error)
        // For now, let's create some dummy spaces for demonstration
        const dummySpaces = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          spaceNumber: `Space-${i + 1}`,
          status: "AVAILABLE",
          levelId: Number(levelId),
        }))
        setSpaces(dummySpaces)
        setSpaceId("")
      }
    }

    fetchSpaces()
  }, [token, levelId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsLoading(true)

    try {
      // Combine date and time
      const startDateTime = new Date(date)
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      startDateTime.setHours(startHours, startMinutes, 0, 0)

      const endDateTime = new Date(date)
      const [endHours, endMinutes] = endTime.split(":").map(Number)
      endDateTime.setHours(endHours, endMinutes, 0, 0)

      const reservationData: ReservationDto = {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        vehicleId: Number.parseInt(vehicleId),
        parkingSpaceId: Number.parseInt(spaceId),
        notes: notes,
      }

      await reservationApi.createReservation(token, reservationData)

      toast({
        title: "Reservation created",
        description: "Your parking reservation has been created successfully.",
      })

      router.push("/dashboard/reservations")
    } catch (error) {
      console.error("Error creating reservation:", error)

      let errorMessage = "Failed to create reservation. Please try again."
      if (error instanceof Error) {
        if (error.message.includes("Parking space is not available")) {
          errorMessage = "This parking space is not available for the selected time."
        } else if (error.message.includes("overlapping")) {
          errorMessage = "This space is already reserved for the selected time period."
        } else if (error.message) {
          errorMessage = error.message
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isDataLoading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">New Reservation</h2>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Reserve a Parking Spot</CardTitle>
            <CardDescription>Fill in the details to reserve your parking spot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Parking Location</Label>
              <Select value={locationId} onValueChange={setLocationId} required>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select parking location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name} ({loc.availableSpaces} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {locationId && (
              <div className="space-y-2">
                <Label htmlFor="level">Parking Level</Label>
                <Select value={levelId} onValueChange={setLevelId} required>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select parking level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((lvl) => (
                      <SelectItem key={lvl.id} value={lvl.id.toString()}>
                        {lvl.name} ({lvl.availableSpaces} available)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {levelId && (
              <div className="space-y-2">
                <Label htmlFor="space">Parking Space</Label>
                <Select value={spaceId} onValueChange={setSpaceId} required>
                  <SelectTrigger id="space">
                    <SelectValue placeholder="Select parking space" />
                  </SelectTrigger>
                  <SelectContent>
                    {spaces.map((space) => (
                      <SelectItem key={space.id} value={space.id.toString()}>
                        Space #{space.spaceNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger id="start-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger id="end-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                          {`${i.toString().padStart(2, "0")}:00`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Select value={vehicleId} onValueChange={setVehicleId} required>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id!.toString()}>
                      {vehicle.make} {vehicle.model} ({vehicle.color}) - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                  <SelectItem value="add">+ Add new vehicle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Special Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any special requirements or notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating reservation..." : "Reserve Spot"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

