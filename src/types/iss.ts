export type ISSVisibility = 'daylight' | 'visible' | 'eclipsed'

export interface ISSPosition {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: string
  visibility: ISSVisibility
}
