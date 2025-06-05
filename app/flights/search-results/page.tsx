"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plane, Clock, MapPin } from "lucide-react"
import { fetchFlights } from "./services"

interface Flight {
  id: string
  airline: string
  flightNumber: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  stops: number
  availableSeats: number
  aircraft: string
}

export default function SearchResultsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [flights, setFlights] = useState<Flight[]>([])
  const [searchCriteria, setSearchCriteria] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Load search criteria
    const criteria = localStorage.getItem("searchCriteria")
    if (criteria) {
      setSearchCriteria(JSON.parse(criteria))
    }
  }, [user, loading, router])
useEffect(()=>{
  const getRoutes = async () => {
    const data = await fetchFlights({limit:30,offset:0})
    console.log(data.data)
    const flightData = data.data.map((item: any) => ({
      id: item.flight?.iata || item.flight?.number || item.flight?.icao || Math.random().toString(),
      airline: item.airline?.name || "Unknown",
      flightNumber: item.flight?.number || "",
      from: item.departure?.airport || item.departure?.iata || "",
      to: item.arrival?.airport || item.arrival?.iata || "",
    }))
    console.log(flightData)
    setFlights(flightData)
    // setFlights(data.data)
  }
  getRoutes()
},[])
  useEffect(() => {
    const getFlights = async () => {
      setIsLoading(true)
      setError(null)
      try {
        let params: Record<string, any> = {}
        if (searchCriteria) {
          // API-supported filters
          if (searchCriteria.destinations?.[0]?.from) params["dep_iata"] = searchCriteria.destinations[0].from
          if (searchCriteria.destinations?.[0]?.to) params["arr_iata"] = searchCriteria.destinations[0].to
          // if (searchCriteria.destinations?.[0]?.date) params["arr_scheduled_time_arr"] = searchCriteria.destinations[0].date
          // if (searchCriteria.filters?.airlines?.length) params["airline_iata"] = searchCriteria.filters.airlines[0]
          // if (searchCriteria.filters?.arr_scheduled_time_arr) params["arr_scheduled_time_arr"] = searchCriteria.filters.arr_scheduled_time_arr
          // if (searchCriteria.filters?.arr_scheduled_time_dep) params["arr_scheduled_time_dep"] = searchCriteria.filters.arr_scheduled_time_dep
        }
        // Always fetch with default limit/offset (handled in service)
        const data = await fetchFlights(params)
        // Map API data to Flight[]
        let flightsData = (data.data || []).map((item: any) => ({
          id: item.flight?.iata || item.flight?.number || item.flight?.icao || Math.random().toString(),
          airline: item.airline?.name || "Unknown",
          flightNumber: item.flight?.number || "",
          from: item.departure?.airport || item.departure?.iata || "",
          to: item.arrival?.airport || item.arrival?.iata || "",
          departureTime: item.departure?.scheduled ? new Date(item.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          arrivalTime: item.arrival?.scheduled ? new Date(item.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          duration: item.flight_time || "-",
          price: Math.floor(Math.random() * 3000) + 2000, // No price in API, so mock
          stops: 0, // Not available in API
          availableSeats: Math.floor(Math.random() * 50) + 10, // Mock
          aircraft: item.aircraft?.icao || item.aircraft?.registration || "-",
        }))
        // Client-side filters
        if (searchCriteria?.filters?.priceRange) {
          const [min, max] = searchCriteria.filters.priceRange
          flightsData = flightsData.filter((f: Flight) => f.price >= min && f.price <= max)
        }
        if (searchCriteria?.filters?.airlines?.length) {
          flightsData = flightsData.filter((f: Flight) => searchCriteria.filters.airlines.includes(f.airline))
        }
        if (searchCriteria?.filters?.stops?.length) {
          // Not available in API, so skip or mock if you have stops info
        }
        if (searchCriteria?.filters?.timeSlots?.length) {
          // Example: filter by departure hour
          flightsData = flightsData.filter((f: Flight) => {
            if (!f.departureTime) return false
            const hour = parseInt(f.departureTime.split(":")[0])
            return searchCriteria.filters.timeSlots.some((slot: string) => {
              if (slot.includes("Morning")) return hour >= 6 && hour < 12
              if (slot.includes("Afternoon")) return hour >= 12 && hour < 18
              if (slot.includes("Evening")) return hour >= 18 && hour < 24
              if (slot.includes("Night")) return hour < 6
              return false
            })
          })
        }
        // Class and passengers are not supported by API, so only use for display/booking
        setFlights(flightsData)
      } catch (err: any) {
        setError("Failed to fetch flights. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    getFlights()
  }, [searchCriteria])

  const handleBookFlight = (flight: Flight) => {
    localStorage.setItem("selectedFlight", JSON.stringify(flight))
    router.push("/booking/details")
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Flight Search Results</h1>
          </div>
        </div>
      </header>

      {/* Search Summary */}
      {searchCriteria && (
        <div className="bg-blue-50 border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {searchCriteria.destinations[0]?.from} → {searchCriteria.destinations[0]?.to}
                </span>
              </span>
              <span>•</span>
              <span>{searchCriteria.destinations[0]?.date}</span>
              <span>•</span>
              <span>
                {searchCriteria.passengers} passenger{searchCriteria.passengers > 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span className="capitalize">{searchCriteria.class}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        </div>
      )}

      {/* Results */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{flights.length} flights found</h2>
          <p className="text-gray-600">Showing best matches for your search</p>
        </div>
        <div className="space-y-4">
          {flights.map((flight) => (
            flight.airline !== "empty" && (
            <Card key={flight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Plane className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">{flight.airline}</span>
                        <span className="text-gray-500">{flight.flightNumber}</span>
                      </div>
                      <Badge variant="secondary">{flight.aircraft}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-2xl font-bold">{flight.departureTime}</div>
                        <div className="text-gray-600">{flight.from}</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{flight.duration}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                        </div>
                      </div>
                      <div className="text-right md:text-left">
                        <div className="text-2xl font-bold">{flight.arrivalTime}</div>
                        <div className="text-gray-600">{flight.to}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{flight.availableSeats} seats available</span>
                      <span>Refundable</span>
                    </div>
                  </div>

                  <div className="ml-8 text-right">
                    <div className="text-3xl font-bold text-green-600 mb-2">₹{flight.price?.toLocaleString() || 0}</div>
                    <div className="text-sm text-gray-500 mb-4">per person</div>
                    <Button onClick={() => handleBookFlight(flight)} className="w-full">
                      Book Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          ))}
        </div>
      </main>
    </div>
  )
}
