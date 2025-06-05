"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Search, Calendar } from "lucide-react"
import FlightSearch from "@/components/flights/FlightSearch"
import BookingHistory from "@/components/bookings/BookingHistory"

export default function UserDashboard() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    // Load user bookings
    const allBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
    const userBookings = allBookings.filter((booking: any) => booking.userId === user?.id)
    setBookings(userBookings)
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Flight Explorer</h1>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search Flights</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>My Bookings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Flights</span>
                </CardTitle>
                <CardDescription>Find and book flights for your next journey</CardDescription>
              </CardHeader>
              <CardContent>
                <FlightSearch />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>My Bookings</span>
                </CardTitle>
                <CardDescription>View and manage your flight bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingHistory bookings={bookings} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
