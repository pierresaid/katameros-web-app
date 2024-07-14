import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import router from './router'
import { vuetifyApp } from './plugins/vuetify'
import { i18n } from './plugins/i18n'
import './plugins/vee-validate'

import { SafeArea } from '@capacitor-community/safe-area';

SafeArea.enable({
  config: {
  },
});


const app = createApp(App)
app.use(vuetifyApp)
app.use(i18n)

app.use(createPinia())
app.use(router)

app.mount('#app')
