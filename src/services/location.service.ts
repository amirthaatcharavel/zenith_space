import type { Location } from '@/types'
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'

const db = getFirestore()
const savedLocationsCollection = collection(db, 'savedLocations')

interface SavedLocationDocument {
  uid: string
  name: string
  latitude: number
  longitude: number
  createdAt: unknown
}

export const DEFAULT_LOCATION: Location = {
  id: 'default',
  name: '',
  latitude: 0,
  longitude: 0,
  isDefault: true,
}

function mapLocationDoc(snapshot: QueryDocumentSnapshot<DocumentData>): Location {
  const data = snapshot.data() as SavedLocationDocument
  const createdAt = data.createdAt as { toDate?: () => Date }
  const savedAt = createdAt?.toDate
    ? createdAt.toDate().toISOString()
    : new Date().toISOString()

  return {
    id: snapshot.id,
    name: data.name,
    latitude: data.latitude,
    longitude: data.longitude,
    savedAt,
  }
}

export async function loadLocations(uid: string): Promise<Location[]> {
  const locationsQuery = query(
    savedLocationsCollection,
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
  )

  console.log('===== FIRESTORE QUERY =====')
  console.log('UID:', uid)

  try {
    const snapshot = await getDocs(locationsQuery)

    console.log('Snapshot size:', snapshot.size)

    snapshot.docs.forEach(doc => {
      console.log('Document:', {
        id: doc.id,
        ...doc.data(),
      })
    })

    const locations = snapshot.docs.map(mapLocationDoc)

    console.log('Mapped locations:', locations)

    return locations
  } catch (error) {
    console.error('FIRESTORE QUERY FAILED')
    console.error(error)
    throw error
  }
}

export async function saveLocation(uid: string, location: Omit<Location, 'id' | 'savedAt'>): Promise<Location> {
  const createdAt = new Date()

  const docRef = await addDoc(savedLocationsCollection, {
    uid,
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    createdAt: serverTimestamp(),
  })

  return {
    id: docRef.id,
    name: location.name,
    latitude: location.latitude,
    longitude: location.longitude,
    savedAt: createdAt.toISOString(),
  }
}

export async function deleteLocation(id: string): Promise<void> {
  await deleteDoc(doc(db, 'savedLocations', id))
}
