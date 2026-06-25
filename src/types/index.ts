export type { User } from './user'
export type { Location } from './location'
export type {
  AstronomyCatalogEntry,
  CelestialObject,
  CelestialObjectType,
  MoonInfo,
  VisibleObject,
} from './celestial'
export type { ISSPosition, ISSVisibility } from './iss'
export type { WeatherCondition } from './weather'
export type { SolarInfo } from './sun'

export interface NavItem {
  label: string
  to: string
  icon: string
}

export interface QuickNavItem {
  title: string
  description: string
  to: string
  icon: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
}

export interface ApiError {
  message: string
  code?: string
}
