import type { ObservationPlan, ObservationPlanPayload } from '@/types/planner'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'

const db = getFirestore()
const plannerCollection = collection(db, 'observationPlans')

function mapPlanDoc(snapshot: QueryDocumentSnapshot<DocumentData>): ObservationPlan {
  const data = snapshot.data() as Omit<ObservationPlan, 'id'>
  const createdAt = data.createdAt as { toDate?: () => Date }

  return {
    id: snapshot.id,
    uid: data.uid,
    locationId: data.locationId,
    locationName: data.locationName,
    observationDate: data.observationDate,
    targets: Array.isArray(data.targets) ? data.targets : [],
    createdAt: createdAt?.toDate ? createdAt.toDate().toISOString() : new Date().toISOString(),
  }
}

export async function loadObservationPlans(uid: string): Promise<ObservationPlan[]> {
  try {
    const plansQuery = query(
      plannerCollection,
      where('uid', '==', uid)
    )

    const snapshot = await getDocs(plansQuery)
    const plans = snapshot.docs.map(mapPlanDoc)

    // Sort in memory to avoid needing a Firestore composite index
    return plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (e) {
    console.error("Firestore threw exception:", e)
    throw e
  }
}

export async function createObservationPlan(
  uid: string,
  payload: ObservationPlanPayload,
): Promise<ObservationPlan> {
  const docRef = await addDoc(plannerCollection, {
    uid,
    locationId: payload.locationId,
    locationName: payload.locationName,
    observationDate: payload.observationDate,
    targets: payload.targets,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    uid,
    locationId: payload.locationId,
    locationName: payload.locationName,
    observationDate: payload.observationDate,
    targets: payload.targets,
    createdAt: new Date().toISOString(),
  }
}
