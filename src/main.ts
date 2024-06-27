import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
import { vuetifyApp } from './plugins/vuetify'


const app = createApp(App)
app.use(vuetifyApp)

app.use(createPinia())
app.use(router)

app.mount('#app')
