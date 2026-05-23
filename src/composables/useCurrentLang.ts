import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { isSupportedLang, DEFAULT_LANG, type SupportedLang } from '@/consts/supportedLangs'

export function useCurrentLang() {
    const route = useRoute()
    return computed<SupportedLang>(() => {
        const param = route.params.lang
        return isSupportedLang(param as string) ? (param as SupportedLang) : DEFAULT_LANG
    })
}
