import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.store'
import { useUiStore } from './stores/ui.store'
import { useLocationStore } from './stores/location.store'
import './assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
const uiStore = useUiStore()
const locationStore = useLocationStore()

authStore.initialize()
uiStore.initializeTheme()
// Initialize location store to request device geolocation and load saved locations
void locationStore.initialize()

app.mount('#app')
