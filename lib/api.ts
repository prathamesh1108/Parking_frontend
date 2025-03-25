import type { UserDto, VehicleDto, ReservationDto, ParkingLocationDto, ParkedVehicleDto } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    console.error("API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    })

    let errorMessage = "An error occurred"
    try {
      const errorJson = JSON.parse(errorText)
      errorMessage = errorJson.message || errorMessage
    } catch (e) {
      // If the response is not JSON, use the text as the error message
      if (errorText) errorMessage = errorText
    }

    throw new Error(errorMessage)
  }
  return response.json()
}

// Authentication API calls
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse<{ accessToken: string; tokenType: string }>(response)
  },

  register: async (userData: UserDto) => {
    console.log("Registering user with data:", JSON.stringify(userData))
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
    console.log("Registration response status:", response.status)
    return handleResponse<UserDto>(response)
  },
}

// User API calls
export const userApi = {
  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<UserDto>(response)
  },

  updateProfile: async (token: string, userData: UserDto) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
    return handleResponse<UserDto>(response)
  },
}

// Vehicle API calls
export const vehicleApi = {
  getUserVehicles: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<VehicleDto[]>(response)
  },

  getVehicle: async (token: string, vehicleId: number) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<VehicleDto>(response)
  },

  addVehicle: async (token: string, vehicleData: VehicleDto) => {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    })
    return handleResponse<VehicleDto>(response)
  },

  updateVehicle: async (token: string, vehicleId: number, vehicleData: VehicleDto) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicleData),
    })
    return handleResponse<VehicleDto>(response)
  },

  deleteVehicle: async (token: string, vehicleId: number) => {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "An error occurred")
    }
    return true
  },
}

// Reservation API calls
export const reservationApi = {
  getUserReservations: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<ReservationDto[]>(response)
  },

  getActiveReservations: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/reservations/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<ReservationDto[]>(response)
  },

  getReservation: async (token: string, reservationId: number) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<ReservationDto>(response)
  },

  createReservation: async (token: string, reservationData: ReservationDto) => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reservationData),
    })
    return handleResponse<ReservationDto>(response)
  },

  cancelReservation: async (token: string, reservationId: number) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<ReservationDto>(response)
  },
}

// Parking API calls
export const parkingApi = {
  getAllParkingLocations: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/parking/locations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<ParkingLocationDto[]>(response)
  },

  getLevelsByLocation: async (token: string, locationId: number) => {
    const response = await fetch(`${API_BASE_URL}/parking/locations/${locationId}/levels`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<any[]>(response)
  },

  parkVehicle: async (token: string, vehicleId: number, spaceId: number) => {
    const response = await fetch(`${API_BASE_URL}/parking/park`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vehicleId, spaceId }),
    })
    return handleResponse<ParkedVehicleDto>(response)
  },

  removeParkedVehicle: async (token: string, parkedVehicleId: number) => {
    const response = await fetch(`${API_BASE_URL}/parking/parked/${parkedVehicleId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || "An error occurred")
    }
    return true
  },

  getUserParkedVehicles: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/parking/parked`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return handleResponse<ParkedVehicleDto[]>(response)
  },
}

