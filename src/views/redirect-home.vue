<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { detectLang } from '@/consts/supportedLangs'
import { useSeo } from '@/composables/useSeo'

useSeo({ titleKey: 'seo.brand', isRoot: true })

const router = useRouter()

onMounted(() => {
    const lang = detectLang()
    router.replace(`/${lang}/`)
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
