import { createI18n } from "vue-i18n";
import en from '../../locales/en.json'
import fr from '../../locales/fr.json'
import de from '../../locales/de.json'
import it from '../../locales/it.json'
import ar from '../../locales/ar.json'
import pl from '../../locales/pl.json'
import es from '../../locales/es.json'
import nl from '../../locales/nl.json'
import th from '../../locales/th.json'

export const i18n = createI18n({
    fallbackLocale: "en",
    legacy: false,
    locale: "en",
    messages: {
        en,
        fr,
        de,
        it,
        ar,
        pl,
        es,
        nl,
        th,
    }
  })
