import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const aviationApi = axios.create({
  baseURL: "https://api.aviationstack.com/v1/",
  params: {
    access_key: process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY,
  },
})
