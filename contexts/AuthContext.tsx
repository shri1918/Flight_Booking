"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import CryptoJS from "crypto-js"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string, role: "user" | "admin") => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const SECRET_KEY = "flight-explorer-secret-key"
const INACTIVITY_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const router = useRouter()

  // Encrypt password
  const encryptPassword = (password: string): string => {
    return CryptoJS.AES.encrypt(password, SECRET_KEY).toString()
  }

  // Decrypt password
  const decryptPassword = (encryptedPassword: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  // Update activity timestamp
  const updateActivity = () => {
    setLastActivity(Date.now())
  }

  // Check for inactivity
  useEffect(() => {
    const checkInactivity = () => {
      if (user && Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout()
      }
    }

    const interval = setInterval(checkInactivity, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [user, lastActivity])

  // Track user activity
  useEffect(() => {
    const handleActivity = () => updateActivity()

    document.addEventListener("mousedown", handleActivity)
    document.addEventListener("keydown", handleActivity)
    document.addEventListener("scroll", handleActivity)

    return () => {
      document.removeEventListener("mousedown", handleActivity)
      document.removeEventListener("keydown", handleActivity)
      document.removeEventListener("scroll", handleActivity)
    }
  }, [])

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find((u: any) => u.email === email)

      if (foundUser && decryptPassword(foundUser.password) === password) {
        const userObj = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
        }
        setUser(userObj)
        localStorage.setItem("currentUser", JSON.stringify(userObj))
        updateActivity()
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (email: string, password: string, name: string, role: "user" | "admin"): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password: encryptPassword(password),
        name,
        role,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      const userObj = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      }
      setUser(userObj)
      localStorage.setItem("currentUser", JSON.stringify(userObj))
      updateActivity()
      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
