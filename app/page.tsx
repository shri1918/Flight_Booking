"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Users, Plane, Star, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function FlightBookingLanding() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle flight search logic here
    console.log("Searching flights...")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-blue-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-900">SkyBooker</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="#"
                  className="text-blue-900 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-blue-600"
                >
                  Flights
                </Link>
                <Link href="#" className="text-blue-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Hotels
                </Link>
                <Link href="#" className="text-blue-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Car Rentals
                </Link>
                <Link href="#" className="text-blue-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Deals
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <Button variant="outline" className="mr-2 border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => router.push("/login")}>
                Sign Up
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/login")}>Log In</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-blue-700"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-blue-100">
                <Link
                  href="#"
                  className="text-blue-900 hover:text-blue-600 block px-3 py-2 text-base font-medium bg-blue-50 rounded"
                >
                  Flights
                </Link>
                <Link href="#" className="text-blue-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                  Hotels
                </Link>
                <Link href="#" className="text-blue-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                  Car Rentals
                </Link>
                <Link href="#" className="text-blue-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                  Deals
                </Link>
                <div className="pt-4 pb-3 border-t border-blue-200">
                  <div className="flex items-center px-3 space-x-3">
                    <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => router.push("/login")}>
                      Sign Up
                    </Button>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/login")}>Log In</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-airplane.jpg"
            alt="Beautiful airplane flying over clouds"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-blue-900/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Find Your Perfect Flight</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover amazing destinations and book flights at the best prices. Your journey starts here.
            </p>
          </div>

          {/* Flight Search Form */}
         
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Special Offers</h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              Don't miss out on these amazing deals and save on your next adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Summer Sale",
                description: "Up to 40% off on international flights",
                discount: "40% OFF",
                image: "/images/summer-beach.jpg",
                validUntil: "Valid until July 31st",
              },
              {
                title: "Weekend Getaway",
                description: "Special prices for domestic flights",
                discount: "25% OFF",
                image: "/images/city-skyline.jpg",
                validUntil: "Book by Sunday",
              },
              {
                title: "Business Class",
                description: "Upgrade to business class for less",
                discount: "30% OFF",
                image: "/images/business-class.jpg",
                validUntil: "Limited time offer",
              },
            ].map((offer, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow border-blue-200 bg-white">
                <div className="relative">
                  <Image
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white">
                    {offer.discount}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-blue-900">{offer.title}</h3>
                  <p className="text-blue-700 mb-4">{offer.description}</p>
                  <p className="text-sm text-blue-600 mb-4">{offer.validUntil}</p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              Explore the world's most beautiful destinations with our best flight deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Paris", country: "France", price: "From $599", image: "/images/paris.jpg" },
              { name: "Tokyo", country: "Japan", price: "From $899", image: "/images/tokyo.jpg" },
              { name: "New York", country: "USA", price: "From $399", image: "/images/new-york.jpg" },
              { name: "London", country: "UK", price: "From $549", image: "/images/london.jpg" },
            ].map((destination, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border-blue-200 group"
              >
                <div className="relative">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    width={300}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm opacity-90">{destination.country}</p>
                    <p className="text-lg font-bold mt-1 text-blue-200">{destination.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">
              Read reviews from thousands of satisfied travelers who chose SkyBooker
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York, USA",
                rating: 4,
                comment:
                  "Amazing service! Found the perfect flight at an unbeatable price. The booking process was smooth and hassle-free.",
                avatar: "/images/avatar1.jpg",
              },
              {
                name: "Michael Chen",
                location: "Toronto, Canada",
                rating: 4,
                comment:
                  "I've used SkyBooker multiple times and they never disappoint. Great deals and excellent customer support.",
                avatar: "/images/avatar2.jpg",
              },
              {
                name: "Emma Wilson",
                location: "London, UK",
                rating: 5,
                comment:
                  "The best flight booking platform I've ever used. Saved me hundreds of dollars on my last trip to Asia!",
                avatar: "/images/avatar3.jpg",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white border-blue-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4 border-2 border-blue-200">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-blue-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-800 italic">"{testimonial.comment}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Plane className="h-8 w-8 text-blue-400" />
                <span className="ml-2 text-xl font-bold">SkyBooker</span>
              </div>
              <p className="text-blue-200">Your trusted partner for finding the best flight deals worldwide.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-100">Company</h3>
              <ul className="space-y-2 text-blue-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-100">Support</h3>
              <ul className="space-y-2 text-blue-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-100">Follow Us</h3>
              <ul className="space-y-2 text-blue-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; {new Date().getFullYear()} SkyBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
