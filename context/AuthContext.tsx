"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Mock user data
const MOCK_USERS = [
  { id: "1", email: "witallo.jw@gmail.com", password: "123", name: "Witallo gostoso" },
  { id: "2", email: "test@example.com", password: "test123", name: "Jane Smith" },
]

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Check for stored user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Failed to load user from storage", error)
      }
    }

    loadUser()
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      const userInfo = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      }
      setUser(userInfo)
      await AsyncStorage.setItem("user", JSON.stringify(userInfo))
      return true
    }

    return false
  }

  const signUp = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const userExists = MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (userExists) {
      return false
    }

    // In a real app, you would add the user to your database
    // Here we're just simulating a successful registration
    return true
  }

  const signOut = async () => {
    setUser(null)
    await AsyncStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
