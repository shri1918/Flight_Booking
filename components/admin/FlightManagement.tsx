"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Search } from "lucide-react"

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
  totalSeats: number
  bookedSeats: number
  availableSeats: number
  aircraft: string
  status: "active" | "cancelled"
}

export default function FlightManagement() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null)
  const [newFlight, setNewFlight] = useState<Partial<Flight>>({
    airline: "",
    flightNumber: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: 0,
    totalSeats: 0,
    bookedSeats: 0,
    aircraft: "",
    status: "active",
  })

  useEffect(() => {
    loadFlights()
  }, [])

  const loadFlights = () => {
    const savedFlights = JSON.parse(localStorage.getItem("flights") || "[]")
    setFlights(savedFlights)
  }

  const saveFlights = (updatedFlights: Flight[]) => {
    localStorage.setItem("flights", JSON.stringify(updatedFlights))
    setFlights(updatedFlights)
  }

  const handleAddFlight = () => {
    if (!newFlight.airline || !newFlight.flightNumber || !newFlight.from || !newFlight.to) {
      alert("Please fill in all required fields")
      return
    }

    const flight: Flight = {
      id: `FL${Date.now()}`,
      airline: newFlight.airline!,
      flightNumber: newFlight.flightNumber!,
      from: newFlight.from!,
      to: newFlight.to!,
      departureTime: newFlight.departureTime!,
      arrivalTime: newFlight.arrivalTime!,
      duration: newFlight.duration!,
      price: newFlight.price!,
      totalSeats: newFlight.totalSeats!,
      bookedSeats: newFlight.bookedSeats || 0,
      availableSeats: newFlight.totalSeats! - (newFlight.bookedSeats || 0),
      aircraft: newFlight.aircraft!,
      status: "active",
    }

    const updatedFlights = [...flights, flight]
    saveFlights(updatedFlights)
    setNewFlight({
      airline: "",
      flightNumber: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      price: 0,
      totalSeats: 0,
      bookedSeats: 0,
      aircraft: "",
      status: "active",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight)
    setNewFlight(flight)
  }

  const handleUpdateFlight = () => {
    if (!editingFlight) return

    const updatedFlights = flights.map((f) =>
      f.id === editingFlight.id
        ? ({
            ...newFlight,
            id: editingFlight.id,
            availableSeats: (newFlight.totalSeats || 0) - (newFlight.bookedSeats || 0),
          } as Flight)
        : f,
    )
    saveFlights(updatedFlights)
    setEditingFlight(null)
    setNewFlight({
      airline: "",
      flightNumber: "",
      from: "",
      to: "",
      departureTime: "",
      arrivalTime: "",
      duration: "",
      price: 0,
      totalSeats: 0,
      bookedSeats: 0,
      aircraft: "",
      status: "active",
    })
  }

  const handleDeleteFlight = (flightId: string) => {
    if (confirm("Are you sure you want to delete this flight?")) {
      const updatedFlights = flights.filter((f) => f.id !== flightId)
      saveFlights(updatedFlights)
    }
  }

  const filteredFlights = flights.filter(
    (flight) =>
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.to.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Flight Management</h2>
          <p className="text-gray-600">Manage your airline's flight schedule</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Flight
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Flight</DialogTitle>
              <DialogDescription>Enter the details for the new flight</DialogDescription>
            </DialogHeader>
            <FlightForm
              flight={newFlight}
              onChange={setNewFlight}
              onSubmit={handleAddFlight}
              submitLabel="Add Flight"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search flights..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Flights List */}
      <div className="space-y-4">
        {filteredFlights.map((flight) => (
          <Card key={flight.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="font-semibold text-lg">{flight.airline}</h3>
                    <Badge variant="secondary">{flight.flightNumber}</Badge>
                    <Badge variant={flight.status === "active" ? "default" : "destructive"}>{flight.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xl font-bold">{flight.departureTime}</div>
                      <div className="text-gray-600">{flight.from}</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{flight.arrivalTime}</div>
                      <div className="text-gray-600">{flight.to}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium">{flight.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Aircraft</div>
                      <div className="font-medium">{flight.aircraft}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      Seats: {flight.bookedSeats}/{flight.totalSeats}({flight.availableSeats} available)
                    </span>
                    <span className="font-bold text-green-600">₹{flight.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="ml-4 flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditFlight(flight)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Flight</DialogTitle>
                        <DialogDescription>Update the flight details</DialogDescription>
                      </DialogHeader>
                      <FlightForm
                        flight={newFlight}
                        onChange={setNewFlight}
                        onSubmit={handleUpdateFlight}
                        submitLabel="Update Flight"
                      />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteFlight(flight.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No flights found</p>
        </div>
      )}
    </div>
  )
}

interface FlightFormProps {
  flight: Partial<Flight>
  onChange: (flight: Partial<Flight>) => void
  onSubmit: () => void
  submitLabel: string
}

function FlightForm({ flight, onChange, onSubmit, submitLabel }: FlightFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Airline</Label>
          <Select value={flight.airline} onValueChange={(value) => onChange({ ...flight, airline: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select airline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Air India">Air India</SelectItem>
              <SelectItem value="IndiGo">IndiGo</SelectItem>
              <SelectItem value="SpiceJet">SpiceJet</SelectItem>
              <SelectItem value="Vistara">Vistara</SelectItem>
              <SelectItem value="GoAir">GoAir</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Flight Number</Label>
          <Input
            value={flight.flightNumber}
            onChange={(e) => onChange({ ...flight, flightNumber: e.target.value })}
            placeholder="e.g., AI101"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <Input
            value={flight.from}
            onChange={(e) => onChange({ ...flight, from: e.target.value })}
            placeholder="Departure city"
          />
        </div>
        <div className="space-y-2">
          <Label>To</Label>
          <Input
            value={flight.to}
            onChange={(e) => onChange({ ...flight, to: e.target.value })}
            placeholder="Destination city"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Departure Time</Label>
          <Input
            type="time"
            value={flight.departureTime}
            onChange={(e) => onChange({ ...flight, departureTime: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Arrival Time</Label>
          <Input
            type="time"
            value={flight.arrivalTime}
            onChange={(e) => onChange({ ...flight, arrivalTime: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <Input
            value={flight.duration}
            onChange={(e) => onChange({ ...flight, duration: e.target.value })}
            placeholder="e.g., 2h 30m"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Price (₹)</Label>
          <Input
            type="number"
            value={flight.price}
            onChange={(e) => onChange({ ...flight, price: Number.parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Total Seats</Label>
          <Input
            type="number"
            value={flight.totalSeats}
            onChange={(e) => onChange({ ...flight, totalSeats: Number.parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Booked Seats</Label>
          <Input
            type="number"
            value={flight.bookedSeats}
            onChange={(e) => onChange({ ...flight, bookedSeats: Number.parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Aircraft</Label>
        <Select value={flight.aircraft} onValueChange={(value) => onChange({ ...flight, aircraft: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select aircraft" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Boeing 737">Boeing 737</SelectItem>
            <SelectItem value="Airbus A320">Airbus A320</SelectItem>
            <SelectItem value="Boeing 777">Boeing 777</SelectItem>
            <SelectItem value="Airbus A330">Airbus A330</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onSubmit} className="w-full">
        {submitLabel}
      </Button>
    </div>
  )
}
