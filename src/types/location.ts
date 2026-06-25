export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  altitude?: number
  isDefault?: boolean
  savedAt?: string
}
