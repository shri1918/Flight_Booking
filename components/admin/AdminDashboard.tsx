"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Plane, Users, Calendar } from "lucide-react"
import FlightManagement from "@/components/admin/FlightManagement"
import BookingManagement from "@/components/admin/BookingManagement"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
  })

  useEffect(() => {
    // Calculate stats
    const flights = JSON.parse(localStorage.getItem("flights") || "[]")
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    const revenue = bookings.reduce((sum: number, booking: any) => sum + booking.totalPrice, 0)

    setStats({
      totalFlights: flights.length,
      totalBookings: bookings.length,
      totalRevenue: revenue,
      totalUsers: users.length,
    })

    // Initialize with sample flights if none exist
    if (flights.length === 0) {
      initializeSampleFlights()
    }
  }, [])

  const initializeSampleFlights = () => {
    const sampleFlights = [
      {
        id: "FL001",
        airline: "Air India",
        flightNumber: "AI101",
        from: "Pune",
        to: "Mumbai",
        departureTime: "08:00",
        arrivalTime: "09:30",
        duration: "1h 30m",
        price: 3500,
        totalSeats: 50,
        bookedSeats: 12,
        availableSeats: 38,
        aircraft: "Boeing 737",
        status: "active",
      },
      {
        id: "FL002",
        airline: "IndiGo",
        flightNumber: "6E202",
        from: "Mumbai",
        to: "Delhi",
        departureTime: "14:30",
        arrivalTime: "16:45",
        duration: "2h 15m",
        price: 4200,
        totalSeats: 180,
        bookedSeats: 95,
        availableSeats: 85,
        aircraft: "Airbus A320",
        status: "active",
      },
    ]

    localStorage.setItem("flights", JSON.stringify(sampleFlights))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Welcome, {user?.name}</span>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFlights}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="text-sm text-green-600">₹</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="flights" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="flights" className="flex items-center space-x-2">
              <Plane className="h-4 w-4" />
              <span>Flight Management</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Booking Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flights">
            <FlightManagement />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
