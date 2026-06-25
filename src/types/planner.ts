export interface ObservationPlan {
  id: string
  uid: string
  locationId: string
  locationName: string
  observationDate: string
  targets: string[]
  createdAt: string
}

export type ObservationPlanPayload = Omit<ObservationPlan, 'id' | 'uid' | 'createdAt'>
