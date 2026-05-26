<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { detectLang, isSupportedLang, type SupportedLang } from '@/consts/supportedLangs'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const router = useRouter()

// Only the true root is the homepage; legacy sub-paths (/synaxarium, /about, /contact)
// must canonicalize to their default-language version, not to the homepage.
useSeo({ titleKey: 'seo.brand', brandOnly: true, isRoot: route.path === '/' })

onMounted(() => {
    // Priority: ?lang= query > stored preference > navigator language > default
    const queryLang = route.query.lang as string | undefined
    const lang: SupportedLang = isSupportedLang(queryLang)
        ? (queryLang as SupportedLang)
        : detectLang()

    // Preserve the path suffix (so /synaxarium stays as /{lang}/synaxarium)
    const suffix = route.path === '/' ? '' : route.path
    router.replace(`/${lang}${suffix || '/'}`)
})
</script>

<template>
    <noscript>
        <p style="padding: 2rem; text-align: center;">
            Please choose your language:
            <a href="/fr/">Français</a> ·
            <a href="/en/">English</a> ·
            <a href="/ar/">عربي</a> ·
            <a href="/it/">Italiano</a> ·
            <a href="/de/">Deutsch</a> ·
            <a href="/pl/">Polski</a> ·
            <a href="/es/">Español</a> ·
            <a href="/nl/">Nederlands</a> ·
            <a href="/th/">ไทย</a>
        </p>
    </noscript>
    <div style="display: flex; justify-content: center; padding: 4rem;">
        <span aria-hidden="true">·</span>
    </div>
</template>
