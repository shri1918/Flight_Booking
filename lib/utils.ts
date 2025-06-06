import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const aviationApi = axios.create({
  baseURL: "https://api.aviationstack.com/v1/",
  params: {
    access_key: d7a7e77d48285a908b863bd98aabf378,
  },
})
