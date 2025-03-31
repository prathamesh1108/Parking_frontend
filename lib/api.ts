import type { UserDto, VehicleDto, ReservationDto, ParkingLocationDto, ParkedVehicleDto } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Enhanced error handling function
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = "Invalid Credentials"

    try {
      // Try to parse as JSON first
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json()
        // Extract error message from various possible formats
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorData.errorMessage ||
          (typeof errorData === "string" ? errorData : errorMessage)
      } else {
        // If not JSON, try to get text
        const errorText = await response.text()
        if (errorText && errorText.length < 200) {
          // Only use text if it's reasonably short
          errorMessage = errorText
        }
      }
    } catch (e) {
      console.error("Error parsing error response:", e)
      // Fall back to HTTP status text if parsing fails
      errorMessage = `${response.status}: ${response.statusText || "Unknown error"}`
    }

    // Create error object with additional properties
    const error = new Error(errorMessage)
    ;(error as any).status = response.status
    ;(error as any).statusText = response.statusText
    throw error
  }

  return response.json()
}

// Authentication API calls
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      return handleResponse<{ accessToken: string; tokenType: string }>(response)
    } catch (error) {
      console.error("Login API error:", error)
      throw error
    }
  },

  register: async (userData: UserDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      return handleResponse<UserDto>(response)
    } catch (error) {
      console.error("Register API error:", error)
      throw error
    }
  },
}

// User API calls
export const userApi = {
  getCurrentUser: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<UserDto>(response)
    } catch (error) {
      console.error("Get current user API error:", error)
      throw error
    }
  },

  updateProfile: async (token: string, userData: UserDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })
      return handleResponse<UserDto>(response)
    } catch (error) {
      console.error("Update profile API error:", error)
      throw error
    }
  },
}

// Vehicle API calls
export const vehicleApi = {
  getUserVehicles: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<VehicleDto[]>(response)
    } catch (error) {
      console.error("Get user vehicles API error:", error)
      throw error
    }
  },

  getVehicle: async (token: string, vehicleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<VehicleDto>(response)
    } catch (error) {
      console.error("Get vehicle API error:", error)
      throw error
    }
  },

  addVehicle: async (token: string, vehicleData: VehicleDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      })
      return handleResponse<VehicleDto>(response)
    } catch (error) {
      console.error("Add vehicle API error:", error)
      throw error
    }
  },

  updateVehicle: async (token: string, vehicleId: number, vehicleData: VehicleDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      })
      return handleResponse<VehicleDto>(response)
    } catch (error) {
      console.error("Update vehicle API error:", error)
      throw error
    }
  },

  deleteVehicle: async (token: string, vehicleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<void>(response)
    } catch (error) {
      console.error("Delete vehicle API error:", error)
      throw error
    }
  },
}

// Reservation API calls
export const reservationApi = {
  getUserReservations: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<ReservationDto[]>(response)
    } catch (error) {
      console.error("Get user reservations API error:", error)
      throw error
    }
  },

  getActiveReservations: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/active`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<ReservationDto[]>(response)
    } catch (error) {
      console.error("Get active reservations API error:", error)
      throw error
    }
  },

  getReservation: async (token: string, reservationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<ReservationDto>(response)
    } catch (error) {
      console.error("Get reservation API error:", error)
      throw error
    }
  },

  createReservation: async (token: string, reservationData: ReservationDto) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      })
      return handleResponse<ReservationDto>(response)
    } catch (error) {
      console.error("Create reservation API error:", error)
      throw error
    }
  },

  cancelReservation: async (token: string, reservationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<ReservationDto>(response)
    } catch (error) {
      console.error("Cancel reservation API error:", error)
      throw error
    }
  },
}

// Parking API calls
export const parkingApi = {
  getAllParkingLocations: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/locations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<ParkingLocationDto[]>(response)
    } catch (error) {
      console.error("Get all parking locations API error:", error)
      throw error
    }
  },

  getLevelsByLocation: async (token: string, locationId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/locations/${locationId}/levels`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<any[]>(response)
    } catch (error) {
      console.error("Get levels by location API error:", error)
      throw error
    }
  },

  parkVehicle: async (token: string, vehicleId: number, spaceId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/park`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vehicleId, spaceId }),
      })
      return handleResponse<ParkedVehicleDto>(response)
    } catch (error) {
      console.error("Park vehicle API error:", error)
      throw error
    }
  },

  removeParkedVehicle: async (token: string, parkedVehicleId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/parked/${parkedVehicleId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<void>(response)
    } catch (error) {
      console.error("Remove parked vehicle API error:", error)
      throw error
    }
  },

  getUserParkedVehicles: async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking/parked`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return handleResponse<ParkedVehicleDto[]>(response)
    } catch (error) {
      console.error("Get user parked vehicles API error:", error)
      throw error
    }
  },
}

