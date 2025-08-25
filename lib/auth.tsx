"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, userApi } from "./api"
import type { UserDto } from "../types"

interface AuthContextType {
  user: UserDto | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: UserDto) => Promise<UserDto>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const userData = await userApi.getCurrentUser(authToken)
      setUser(userData)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      // Only logout if it's an authentication error
      if (
        error instanceof Error &&
        ((error as any).status === 401 ||
          (error as any).status === 403 ||
          error.message.includes("Invalid Credentials") ||
          error.message.includes("authentication"))
      ) {
        logout()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { accessToken } = await authApi.login(email, password)
      localStorage.setItem("token", accessToken)
      setToken(accessToken)
      await fetchUser(accessToken)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: UserDto) => {
    setIsLoading(true)
    try {
      const response = await authApi.register(userData)
      // Only auto login after successful registration
      await login(userData.email, userData.password!)
      return response
    } catch (error) {
      console.error("Registration failed:", error)
      setIsLoading(false)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  // Add a function to refresh the token if needed
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!token) return false

      // Check if token exists in localStorage
      const storedToken = localStorage.getItem("token")
      if (!storedToken) {
        logout()
        return false
      }

      // Call the refresh token endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })

      if (!response.ok) {
        // If refresh fails, log the user out
        logout()
        return false
      }

      const data = await response.json()

      // If we got a new token, update it
      if (data.accessToken) {
        localStorage.setItem("token", data.accessToken)
        setToken(data.accessToken)
        return true
      }

      // If no new token but response is OK, token is still valid
      return true
    } catch (error) {
      console.error("Token refresh failed:", error)
      logout()
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}