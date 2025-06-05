"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Minus, Search, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { fetchFlights } from "@/app/flights/search-results/services"

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

interface SearchCriteria {
  tripType: "one-way" | "round-trip" | "multi-city"
  destinations: Array<{
    from: string
    to: string
    date: string
  }>
  passengers: number
  class: string
  filters: {
    priceRange: [number, number]
    airlines: string[]
    stops: string[]
    timeSlots: string[]
  }
}

// Add city to IATA code mapping
const cityToIata: Record<string, string> = {
  "pune": "PNQ",
  "mumbai": "BOM",
  "delhi": "DEL",
  "bengaluru": "BLR",
  "bangalore": "BLR",
  "chennai": "MAA",
  "hyderabad": "HYD",
  "kolkata": "CCU",
  "ahmedabad": "AMD",
  "goa": "GOI",
  "jaipur": "JAI",
  "indore": "IDR",
  "bhopal": "BHO",
  "lucknow": "LKO",
  "patna": "PAT",
  "ranchi": "IXR",
  "surat": "STV",
  "vadodara": "BDQ",
  "coimbatore": "CJB",
  "nagpur": "NAG",
  "visakhapatnam": "VTZ",
  "guwahati": "GAU",
  "amritsar": "ATQ",
  "varanasi": "VNS",
  "trivandrum": "TRV",
  "kochi": "COK",
  "madurai": "IXM",
  "srinagar": "SXR",
  "kanpur": "KNU",
  "raipur": "RPR",
  "dehradun": "DED",
  "aurangabad": "IXU",
  "mysore": "MYQ",
  "shimla": "SLV",
  "jammu": "IXJ",
  "udaipur": "UDR",
  "agartala": "IXA",
  "dimapur": "DMU",
  "pondicherry": "PNY",

  // 🌍 Popular International Cities
  "new york": "JFK",
  "los angeles": "LAX",
  "chicago": "ORD",
  "san francisco": "SFO",
  "london": "LHR",
  "paris": "CDG",
  "frankfurt": "FRA",
  "dubai": "DXB",
  "singapore": "SIN",
  "hong kong": "HKG",
  "tokyo": "NRT",
  "seoul": "ICN",
  "sydney": "SYD",
  "melbourne": "MEL",
  "toronto": "YYZ",
  "vancouver": "YVR",
  "doha": "DOH",
  "kuala lumpur": "KUL",
  "shanghai": "PVG",
  "beijing": "PEK",
  "bangkok": "BKK",
  "istanbul": "IST",
  "johannesburg": "JNB",
  "moscow": "SVO",
  "amsterdam": "AMS",
  "zurich": "ZRH",
  "rome": "FCO",
  "madrid": "MAD",
  "barcelona": "BCN",
};


export default function FlightSearch() {
  const router = useRouter()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    tripType: "one-way",
    destinations: [{ from: "", to: "", date: "" }],
    passengers: 1,
    class: "economy",
    filters: {
      priceRange: [0, 2000],
      airlines: [],
      stops: [],
      timeSlots: [],
    },
  })

  const [showFilters, setShowFilters] = useState(false)

  // New state for flights, loading, error
  const [flights, setFlights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0, count: 0 })
  const [currentPage, setCurrentPage] = useState(1)

  const fetchAndSetFlights = async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      const offset = (page - 1) * pagination.limit
      const data = await fetchFlights({ limit: pagination.limit, offset })
      setFlights(data.data || [])
      setPagination({
        limit: data.pagination?.limit || 20,
        offset: data.pagination?.offset || 0,
        total: data.pagination?.total || 0,
        count: data.pagination?.count || 0,
      })
      setCurrentPage(page)
    } catch (err: any) {
      setError("Failed to fetch flights. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetFlights(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) return
    fetchAndSetFlights(newPage)
  }

  const addDestination = () => {
    if (searchCriteria.destinations.length < 3) {
      setSearchCriteria({
        ...searchCriteria,
        destinations: [...searchCriteria.destinations, { from: "", to: "", date: "" }],
      })
    }
  }

  const removeDestination = (index: number) => {
    if (searchCriteria.destinations.length > 1) {
      const newDestinations = searchCriteria.destinations.filter((_, i) => i !== index)
      setSearchCriteria({ ...searchCriteria, destinations: newDestinations })
    }
  }

  const updateDestination = (index: number, field: string, value: string) => {
    const newDestinations = [...searchCriteria.destinations]
    newDestinations[index] = { ...newDestinations[index], [field]: value }
    setSearchCriteria({ ...searchCriteria, destinations: newDestinations })
  }

  const handleSearch = async () => {
    // For Multi City, require at least 3 destinations
    if (
      searchCriteria.tripType === "multi-city" &&
      (!searchCriteria.destinations || searchCriteria.destinations.length < 3)
    ) {
      alert("Please add at least 3 destinations for Multi City search.");
      return;
    }

    // Prepare a deep copy of searchCriteria with IATA codes for all destinations
    const criteriaCopy = { ...searchCriteria, destinations: searchCriteria.destinations.map(dest => ({ ...dest })) };

    criteriaCopy.destinations.forEach((dest, idx) => {
      const from = dest.from.trim().toLowerCase();
      const to = dest.to.trim().toLowerCase();
      if (cityToIata[from]) {
        criteriaCopy.destinations[idx].from = cityToIata[from];
      }
      if (cityToIata[to]) {
        criteriaCopy.destinations[idx].to = cityToIata[to];
      }
    });

    // Store search criteria in localStorage for the results page
    localStorage.setItem("searchCriteria", JSON.stringify(criteriaCopy));
    router.push("/flights/search-results");
  };

  const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoAir"]
  const stops = ["Non-stop", "1 Stop", "2+ Stops"]
  const timeSlots = ["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (6PM-12AM)", "Night (12AM-6AM)"]

  const handleBookFlight = (flight: any) => {
    localStorage.setItem("selectedFlight", JSON.stringify({
      id: flight.flight?.iata || flight.flight?.number || flight.flight?.icao || Math.random().toString(),
      airline: flight.airline?.name || "Unknown",
      flightNumber: flight.flight?.number || "",
      from: flight.departure?.airport || flight.departure?.iata || "",
      to: flight.arrival?.airport || flight.arrival?.iata || "",
      departureTime: flight.departure?.scheduled ? new Date(flight.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      arrivalTime: flight.arrival?.scheduled ? new Date(flight.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      duration: flight.flight_time || "-",
      price: Math.floor(Math.random() * 3000) + 2000, // No price in API, so mock
      stops: 0, // Not available in API
      availableSeats: Math.floor(Math.random() * 50) + 10, // Mock
      aircraft: flight.aircraft?.icao || flight.aircraft?.registration || "-",
    }))
    router.push("/booking/details")
  }

  return (
    <div className="space-y-6">
      {/* Trip Type Selection */}
      <Tabs
        value={searchCriteria.tripType}
        onValueChange={(value) =>
          setSearchCriteria({
            ...searchCriteria,
            tripType: value as "one-way" | "round-trip" | "multi-city",
            destinations: value === "multi-city" ? searchCriteria.destinations : [{ from: "", to: "", date: "" }],
          })
        }
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="one-way">One Way</TabsTrigger>
          <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
          <TabsTrigger value="multi-city">Multi City</TabsTrigger>
        </TabsList>

        <TabsContent value="one-way" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                placeholder="Departure city"
                value={searchCriteria.destinations[0]?.from || ""}
                onChange={(e) => updateDestination(0, "from", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                placeholder="Destination city"
                value={searchCriteria.destinations[0]?.to || ""}
                onChange={(e) => updateDestination(0, "to", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                value={searchCriteria.destinations[0]?.date || ""}
                onChange={(e) => updateDestination(0, "date", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="round-trip" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                placeholder="Departure city"
                value={searchCriteria.destinations[0]?.from || ""}
                onChange={(e) => updateDestination(0, "from", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                placeholder="Destination city"
                value={searchCriteria.destinations[0]?.to || ""}
                onChange={(e) => updateDestination(0, "to", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Input
                type="date"
                value={searchCriteria.destinations[0]?.date || ""}
                onChange={(e) => updateDestination(0, "date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Input type="date" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="multi-city" className="space-y-4">
          {searchCriteria.destinations.map((destination, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Flight {index + 1}</h4>
                {searchCriteria.destinations.length > 1 && (
                  <Button variant="outline" size="sm" onClick={() => removeDestination(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    placeholder="Departure city"
                    value={destination.from}
                    onChange={(e) => updateDestination(index, "from", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    placeholder="Destination city"
                    value={destination.to}
                    onChange={(e) => updateDestination(index, "to", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={destination.date}
                    onChange={(e) => updateDestination(index, "date", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {searchCriteria.destinations.length < 3 && (
            <Button variant="outline" onClick={addDestination} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Flight
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* Passengers and Class */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Passengers</Label>
          <Select
            value={searchCriteria.passengers.toString()}
            onValueChange={(value) => setSearchCriteria({ ...searchCriteria, passengers: Number.parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} Passenger{num > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Class</Label>
          <Select
            value={searchCriteria.class}
            onValueChange={(value) => setSearchCriteria({ ...searchCriteria, class: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium-economy">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Advanced Filters</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label>
                Price Range: ₹{searchCriteria.filters.priceRange[0]} - ₹{searchCriteria.filters.priceRange[1]}
              </Label>
              <Slider
                value={searchCriteria.filters.priceRange}
                onValueChange={(value) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    filters: { ...searchCriteria.filters, priceRange: value as [number, number] },
                  })
                }
                max={5000}
                min={0}
                step={100}
                className="w-full"
              />
            </div>

            {/* Airlines */}
            <div className="space-y-3">
              <Label>Airlines</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {airlines.map((airline) => (
                  <div key={airline} className="flex items-center space-x-2">
                    <Checkbox
                      id={airline}
                      checked={searchCriteria.filters.airlines.includes(airline)}
                      onCheckedChange={(checked) => {
                        const newAirlines = checked
                          ? [...searchCriteria.filters.airlines, airline]
                          : searchCriteria.filters.airlines.filter((a) => a !== airline)
                        setSearchCriteria({
                          ...searchCriteria,
                          filters: { ...searchCriteria.filters, airlines: newAirlines },
                        })
                      }}
                    />
                    <Label htmlFor={airline} className="text-sm">
                      {airline}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Stops */}
            <div className="space-y-3">
              <Label>Stops</Label>
              <div className="flex flex-wrap gap-2">
                {stops.map((stop) => (
                  <div key={stop} className="flex items-center space-x-2">
                    <Checkbox
                      id={stop}
                      checked={searchCriteria.filters.stops.includes(stop)}
                      onCheckedChange={(checked) => {
                        const newStops = checked
                          ? [...searchCriteria.filters.stops, stop]
                          : searchCriteria.filters.stops.filter((s) => s !== stop)
                        setSearchCriteria({
                          ...searchCriteria,
                          filters: { ...searchCriteria.filters, stops: newStops },
                        })
                      }}
                    />
                    <Label htmlFor={stop} className="text-sm">
                      {stop}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <Label>Departure Time</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <Checkbox
                      id={slot}
                      checked={searchCriteria.filters.timeSlots.includes(slot)}
                      onCheckedChange={(checked) => {
                        const newSlots = checked
                          ? [...searchCriteria.filters.timeSlots, slot]
                          : searchCriteria.filters.timeSlots.filter((s) => s !== slot)
                        setSearchCriteria({
                          ...searchCriteria,
                          filters: { ...searchCriteria.filters, timeSlots: newSlots },
                        })
                      }}
                    />
                    <Label htmlFor={slot} className="text-sm">
                      {slot}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search Button */}
      <Button onClick={handleSearch} className="w-full" size="lg">
        <Search className="h-5 w-5 mr-2" />
        Search Flights
      </Button>

      {/* Show flights below search */}
      <div className="mt-8">
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
        )}
        {!isLoading && !error && flights.length > 0 && (
          <>
            <div className="space-y-4">
              {flights.map((flight, idx) => (
                <Card key={flight.flight?.iata || flight.flight?.number || idx} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">{flight.airline?.name || "Unknown"}</span>
                        <span className="text-gray-500">{flight.flight?.number || ""}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {flight.departure?.airport} → {flight.arrival?.airport}
                      </div>
                      <div className="text-xs text-gray-400">
                        {flight.flight_date} | Status: {flight.flight_status}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <div className="text-lg font-bold text-green-600">
                        ₹{Math.floor(Math.random() * 3000) + 2000}
                      </div>
                      <div className="text-xs text-gray-500">{flight.aircraft?.icao || "-"}</div>
                      <div className="text-xs text-gray-500">{flight.flight_status || "-"}</div>
                      {/* book now button */}
                      <Button variant="outline" size="sm" onClick={() => handleBookFlight(flight)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {Math.max(1, Math.ceil(pagination.total / pagination.limit))}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(pagination.total / pagination.limit) || isLoading}
              >
                Next
              </Button>
            </div>
          </>
        )}
        {!isLoading && !error && flights.length === 0 && (
          <div className="text-center text-gray-500 py-8">No flights found.</div>
        )}
      </div>
    </div>
  )
}
