// Initialize sample data for the Flight Explorer App

// Sample flights data
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
  {
    id: "FL003",
    airline: "Vistara",
    flightNumber: "UK303",
    from: "Delhi",
    to: "Bangalore",
    departureTime: "10:15",
    arrivalTime: "13:00",
    duration: "2h 45m",
    price: 5800,
    totalSeats: 150,
    bookedSeats: 67,
    availableSeats: 83,
    aircraft: "Airbus A320",
    status: "active",
  },
  {
    id: "FL004",
    airline: "SpiceJet",
    flightNumber: "SG404",
    from: "Bangalore",
    to: "Chennai",
    departureTime: "16:20",
    arrivalTime: "17:30",
    duration: "1h 10m",
    price: 2800,
    totalSeats: 180,
    bookedSeats: 45,
    availableSeats: 135,
    aircraft: "Boeing 737",
    status: "active",
  },
  {
    id: "FL005",
    airline: "GoAir",
    flightNumber: "G8505",
    from: "Chennai",
    to: "Kolkata",
    departureTime: "19:45",
    arrivalTime: "22:15",
    duration: "2h 30m",
    price: 4500,
    totalSeats: 180,
    bookedSeats: 89,
    availableSeats: 91,
    aircraft: "Airbus A320",
    status: "active",
  },
]

// Sample users data
const sampleUsers = [
  {
    id: "user1",
    email: "admin@flightexplorer.com",
    password: "U2FsdGVkX1+8QGqjQJ8pQJ8pQJ8pQJ8pQJ8pQJ8pQJ8=", // encrypted 'admin123'
    name: "Admin User",
    role: "admin",
  },
  {
    id: "user2",
    email: "user@flightexplorer.com",
    password: "U2FsdGVkX1+7QGqjQJ8pQJ8pQJ8pQJ8pQJ8pQJ8pQJ8=", // encrypted 'user123'
    name: "Test User",
    role: "user",
  },
]

// Initialize data in localStorage
console.log("Initializing Flight Explorer data...")

// Check if data already exists
const existingFlights = localStorage.getItem("flights")
const existingUsers = localStorage.getItem("users")

if (!existingFlights) {
  localStorage.setItem("flights", JSON.stringify(sampleFlights))
  console.log("✅ Sample flights data initialized")
} else {
  console.log("ℹ️ Flights data already exists")
}

if (!existingUsers) {
  localStorage.setItem("users", JSON.stringify(sampleUsers))
  console.log("✅ Sample users data initialized")
  console.log("📧 Admin login: admin@flightexplorer.com / admin123")
  console.log("📧 User login: user@flightexplorer.com / user123")
} else {
  console.log("ℹ️ Users data already exists")
}

// Initialize empty bookings array if it doesn't exist
const existingBookings = localStorage.getItem("bookings")
if (!existingBookings) {
  localStorage.setItem("bookings", JSON.stringify([]))
  console.log("✅ Bookings storage initialized")
}

console.log("🚀 Flight Explorer initialization complete!")
console.log("📊 Data Summary:")
console.log(`   - ${sampleFlights.length} flights available`)
console.log(`   - ${sampleUsers.length} sample users created`)
console.log("   - Booking system ready")
