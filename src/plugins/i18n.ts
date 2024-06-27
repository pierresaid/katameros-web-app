import { createI18n } from "vue-i18n";
import en from '../../locales/en.json'
import fr from '../../locales/fr.json'
import de from '../../locales/de.json'
import it from '../../locales/it.json'
import ar from '../../locales/ar.json'

export const i18n = createI18n({
    fallbackLocale: "en",
    legacy: false,
    locale: "en",
    messages: {
        en,
        fr,
        de,
        it,
        ar
    }
  })
