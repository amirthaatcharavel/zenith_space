import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import ISSView from './views/ISSView.vue'
import { useLocationStore } from './stores/location.store'
import { useCelestialStore } from './stores/celestial.store'
import './assets/styles/main.css'

const pinia = createPinia()
setActivePinia(pinia)

const app = createApp(ISSView)
app.use(pinia)

const locationStore = useLocationStore()
locationStore.$patch({
  currentLocation: {
    id: 'debug-location',
    name: 'Pondicherry',
    latitude: 11.9133,
    longitude: 79.6356,
    altitude: 0,
    isDefault: true,
    savedAt: new Date().toISOString(),
  },
})

const celestialStore = useCelestialStore()
celestialStore.$patch({
  issPosition: {
    latitude: 11.9,
    longitude: 79.6,
    altitude: 400,
    timestamp: new Date().toISOString(),
  },
})

celestialStore.initialize = async () => {}
celestialStore.stopAutoRefresh = () => {}

app.mount('#app')
