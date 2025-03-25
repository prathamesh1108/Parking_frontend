"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, CarIcon, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import { vehicleApi } from "@/lib/api"
import type { VehicleDto } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function VehiclesPage() {
  const { token } = useAuth()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<VehicleDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null)
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<VehicleDto | null>(null)
  const [vehicleForm, setVehicleForm] = useState<VehicleDto>({
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    isDefault: false,
  })

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!token) return

      try {
        const data = await vehicleApi.getUserVehicles(token)
        setVehicles(data)
      } catch (error) {
        console.error("Error fetching vehicles:", error)
        toast({
          title: "Error",
          description: "Failed to load vehicles. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicles()
  }, [token, toast])

  const handleAddEditVehicle = (vehicle: VehicleDto | null = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle)
      setVehicleForm({
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        licensePlate: vehicle.licensePlate,
        isDefault: vehicle.isDefault,
      })
    } else {
      setEditingVehicle(null)
      setVehicleForm({
        make: "",
        model: "",
        year: "",
        color: "",
        licensePlate: "",
        isDefault: false,
      })
    }
    setVehicleFormOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setVehicleForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmitVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsSubmitting(true)

    try {
      let updatedVehicle: VehicleDto

      if (editingVehicle) {
        // Update existing vehicle
        updatedVehicle = await vehicleApi.updateVehicle(token, editingVehicle.id!, vehicleForm)
        setVehicles((prev) => prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v)))
        toast({
          title: "Vehicle updated",
          description: "Your vehicle has been updated successfully.",
        })
      } else {
        // Add new vehicle
        updatedVehicle = await vehicleApi.addVehicle(token, vehicleForm)
        setVehicles((prev) => [...prev, updatedVehicle])
        toast({
          title: "Vehicle added",
          description: "Your vehicle has been added successfully.",
        })
      }

      setVehicleFormOpen(false)
    } catch (error) {
      console.error("Error saving vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to save vehicle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDeleteVehicle = (vehicleId: number) => {
    setVehicleToDelete(vehicleId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteVehicle = async () => {
    if (!token || vehicleToDelete === null) return

    setIsSubmitting(true)

    try {
      await vehicleApi.deleteVehicle(token, vehicleToDelete)
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleToDelete))
      toast({
        title: "Vehicle removed",
        description: "Your vehicle has been removed successfully.",
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Error deleting vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to remove vehicle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <h2 className="text-3xl font-bold tracking-tight">My Vehicles</h2>
        <Button onClick={() => handleAddEditVehicle()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="overflow-hidden">
            <div className="h-40 bg-muted flex items-center justify-center">
              <CarIcon className="h-20 w-20 text-muted-foreground" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {vehicle.make} {vehicle.model}
                </CardTitle>
                {vehicle.isDefault && (
                  <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</div>
                )}
              </div>
              <CardDescription>
                {vehicle.year} • {vehicle.color} • {vehicle.licensePlate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleAddEditVehicle(vehicle)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => confirmDeleteVehicle(vehicle.id!)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="flex flex-col items-center justify-center h-[250px] border-dashed">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Add a new vehicle</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-[200px]">
            Add your vehicle details for easier parking management
          </p>
          <Button onClick={() => handleAddEditVehicle()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </Card>
      </div>

      {/* Vehicle Form Dialog */}
      <Dialog open={vehicleFormOpen} onOpenChange={setVehicleFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            <DialogDescription>
              {editingVehicle
                ? "Update your vehicle information below."
                : "Enter your vehicle details to add it to your account."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitVehicle}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" value={vehicleForm.make} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" value={vehicleForm.model} onChange={handleFormChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" value={vehicleForm.year} onChange={handleFormChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" value={vehicleForm.color} onChange={handleFormChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input id="licensePlate" value={vehicleForm.licensePlate} onChange={handleFormChange} required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDefault"
                  checked={vehicleForm.isDefault}
                  onCheckedChange={(checked) => setVehicleForm((prev) => ({ ...prev, isDefault: checked === true }))}
                />
                <Label htmlFor="isDefault">Set as default vehicle</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVehicleFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this vehicle? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteVehicle} disabled={isSubmitting}>
              {isSubmitting ? "Removing..." : "Remove Vehicle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

