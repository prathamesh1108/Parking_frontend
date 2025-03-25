// User related types
export interface UserDto {
  id?: number
  firstName: string
  lastName: string
  email: string
  password?: string
}

// Vehicle related types
export interface VehicleDto {
  id?: number
  make: string
  model: string
  year: string
  color: string
  licensePlate: string
  isDefault: boolean
}

// Reservation related types
export interface ReservationDto {
  id?: number
  reservationCode?: string
  startTime: string | Date
  endTime: string | Date
  status?: string
  price?: number
  notes?: string
  vehicleId: number
  parkingSpaceId: number
  locationName?: string
  levelName?: string
  spaceNumber?: string
  vehicleInfo?: string
}

// Parking related types
export interface ParkingLocationDto {
  id: number
  name: string
  address?: string
  levels?: ParkingLevelDto[]
  availableSpaces: number
}

export interface ParkingLevelDto {
  id: number
  name: string
  locationId: number
  locationName: string
  totalSpaces: number
  availableSpaces: number
}

export interface ParkingSpaceDto {
  id: number
  spaceNumber: string
  status: string
  levelId: number
}

export interface ParkedVehicleDto {
  id: number
  parkedTime: string | Date
  expectedExitTime?: string | Date
  vehicleId: number
  vehicleInfo: string
  parkingSpaceId: number
  locationName: string
  levelName: string
  spaceNumber: string
}

