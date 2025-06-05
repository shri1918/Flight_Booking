import { aviationApi } from "@/lib/utils"

export async function fetchFlights(params: Record<string, any> = {}) {
  // Pre-define limit and offset, but allow override
  const { limit = 20, offset = 0, ...rest } = params
  const response = await aviationApi.get("flights", { params: { limit, offset, ...rest } })
  return response.data
}

export async function fetchRoutes(params: Record<string, any>) {
  const response = await aviationApi.get("routes", { params })
  return response.data
}

export async function fetchAirports(params: Record<string, any>) {
  const response = await aviationApi.get("airports", { params })
  return response.data
}

export async function fetchAirlines(params: Record<string, any>) {
  const response = await aviationApi.get("airlines", { params })
  return response.data
}

export async function fetchAirplanes(params: Record<string, any>) {
  const response = await aviationApi.get("airplanes", { params })
  return response.data
}

export async function fetchAircraftTypes(params: Record<string, any>) {
  const response = await aviationApi.get("aircraft_types", { params })
  return response.data
}

export async function fetchAviationTaxes(params: Record<string, any>) {
  const response = await aviationApi.get("taxes", { params })
  return response.data
}

export async function fetchCities(params: Record<string, any>) {
  const response = await aviationApi.get("cities", { params })
  return response.data
}

export async function fetchCountries(params: Record<string, any>) {
  const response = await aviationApi.get("countries", { params })
  return response.data
}

export async function fetchFlightSchedules(params: Record<string, any>) {
  const response = await aviationApi.get("schedules", { params })
  return response.data
}

export async function fetchFutureFlightSchedules(params: Record<string, any>) {
  const response = await aviationApi.get("future_schedules", { params })
  return response.data
}

// Fetch first 20 flights (default)
fetchFlights({ limit: 20, offset: 0 })

// Fetch with search/filter
// fetchFlights({
//   dep_iata: "KGI",
//   arr_iata: "PER",
//   flight_date: "2025-06-06",
//   limit: 20,
//   offset: 0
// })