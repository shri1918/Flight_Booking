"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, Smartphone, Building, CheckCircle, XCircle } from "lucide-react"

export default function PaymentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    upiId: "",
    bankAccount: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState<"success" | "failure" | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
      return
    }

    // Load booking details
    const details = localStorage.getItem("bookingDetails")
    if (details) {
      setBookingDetails(JSON.parse(details))
    } else {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const simulatePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate random success/failure (80% success rate)
    const isSuccess = Math.random() > 0.2

    if (isSuccess) {
      // Generate booking ID and save booking
      const bookingId = `BK${Date.now()}`
      const booking = {
        id: bookingId,
        userId: user?.id,
        ...bookingDetails,
        paymentMethod,
        paymentStatus: "completed",
        bookingStatus: "confirmed",
        createdAt: new Date().toISOString(),
      }

      // Save to bookings
      const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]")
      existingBookings.push(booking)
      localStorage.setItem("bookings", JSON.stringify(existingBookings))

      // Update flight seats (mock)
      const flights = JSON.parse(localStorage.getItem("flights") || "[]")
      const updatedFlights = flights.map((f: any) =>
        f.id === bookingDetails.flight.id
          ? { ...f, availableSeats: f.availableSeats - bookingDetails.passengers.length }
          : f,
      )
      localStorage.setItem("flights", JSON.stringify(updatedFlights))

      setPaymentResult("success")

      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/booking/confirmation?id=${bookingId}`)
      }, 2000)
    } else {
      setPaymentResult("failure")
    }

    setIsProcessing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !bookingDetails) {
    return null
  }

  if (paymentResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            {paymentResult === "success" ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
                <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-4">There was an issue processing your payment.</p>
                <Button onClick={() => setPaymentResult(null)} className="w-full">
                  Try Again
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalAmount =
    (bookingDetails.flight.price + Math.floor(bookingDetails.flight.price * 0.1)) * bookingDetails.passengers.length

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
            <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center space-x-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      <span>UPI</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex items-center space-x-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      <span>Net Banking</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Payment Forms */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input
                          value={paymentData.cardholderName}
                          onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                          placeholder="Enter cardholder name"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label>Card Number</Label>
                        <Input
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CVV</Label>
                        <Input
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label>UPI ID</Label>
                      <Input
                        value={paymentData.upiId}
                        onChange={(e) => setPaymentData({ ...paymentData, upiId: e.target.value })}
                        placeholder="yourname@upi"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="space-y-2">
                      <Label>Select Bank</Label>
                      <Select
                        value={paymentData.bankAccount}
                        onValueChange={(value) => setPaymentData({ ...paymentData, bankAccount: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">State Bank of India</SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <Button onClick={simulatePayment} className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay ₹{totalAmount.toLocaleString()}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Flight:</span>
                    <span className="font-medium">{bookingDetails.flight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium">
                      {bookingDetails.flight.from} → {bookingDetails.flight.to}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span className="font-medium">{bookingDetails.passengers.length}</span>
                  </div>
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare:</span>
                    <span>₹{(bookingDetails.flight.price * bookingDetails.passengers.length).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>
                      ₹
                      {(
                        Math.floor(bookingDetails.flight.price * 0.1) * bookingDetails.passengers.length
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
