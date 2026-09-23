<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useCurrentLang } from '@/composables/useCurrentLang';
import { SITE_URL } from '@/composables/useSeo';

const { t } = useI18n();
const route = useRoute();
const lang = useCurrentLang();

// The host answers unknown paths with the root page and a 200, so keep them
// out of the index from here. The self canonical replaces the root page's one.
useHead(() => ({
    title: `${t('notFound.title')} - ${t('seo.brand')}`,
    meta: [{ name: 'robots', content: 'noindex' }],
    link: [{ rel: 'canonical', href: `${SITE_URL}${route.path}` }],
}));
</script>

<template>
    <v-container class="not-found">
        <h1 class="not-found-heading">{{ t('notFound.title') }}</h1>
        <p class="not-found-text text-medium-emphasis">{{ t('notFound.text') }}</p>
        <v-btn :to="{ name: 'home', params: { lang } }" color="primary">
            {{ t('home') }}
        </v-btn>
    </v-container>
</template>

<style scoped>
.not-found {
    max-width: 560px;
    padding-top: 64px;
    text-align: center;
}

.not-found-heading {
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 8px;
}

.not-found-text {
    margin-bottom: 24px;
}
</style>
