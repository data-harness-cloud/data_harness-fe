import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '../App.vue'
const app = createApp(App)

console.log('Hello Pinia!')

const store = createPinia()

app.use(store)

export default app
