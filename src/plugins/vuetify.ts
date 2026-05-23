import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { fr, en, ar, de, it, pl, es, nl } from 'vuetify/locale'

const defLight = {
  colors: {
    primary: '#ffc107',
  }
}

const defDark = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#212121',
    'surface-variant': '#BDBDBD',
    'on-surface-variant': '#424242',
    primary: '#ffc107',
    'primary-darken-1': '#ccbc2f',
    secondary: '#03DAC5',
    'secondary-darken-1': '#03DAC5',
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  },
  variables: {
    'border-color': '#FFFFFF',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.10,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.16,
    'dragged-opacity': 0.08,
    'kbd-background-color': '#212529',
    'kbd-color': '#FFFFFF',
    'code-background-color': '#B7B7B7'
  }
}

export function createVuetifyInstance(isClient: boolean) {
  return createVuetify({
    ssr: !isClient,
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: defLight,
        dark: defDark
      }
    },
    locale: {
      messages: { fr, en, ar, de, it, pl, es, nl },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    display: {
      mobileBreakpoint: 'sm',
      thresholds: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920, xxl: 2560 },
    },
  })
}
