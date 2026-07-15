<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { useNotif } from '../store/notif';
import { useI18n } from 'vue-i18n';
import { http } from '../services/http';
import { track } from '@/helpers/track';
import { useSeo } from '@/composables/useSeo';

useSeo('contact.contact');

const name = ref('');
const email = ref('');
const message = ref('');
const loading = ref(false);

const { t } = useI18n();
async function onsubmit() {
    loading.value = true;
    try {
        await http.post("/contact", {
            name: name.value,
            email: email.value,
            message: message.value
        });
        name.value = '';
        email.value = '';
        message.value = '';
        useNotif().success(t('contact.MessageSent'));
    } catch (error) {
        console.log(useNotif());

        useNotif().error(t('contact.MessageFailed'));
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="contact-page">
        <v-container>
            <h2>
                {{ t('contact.contact') }}
            </h2>
            <Form v-slot="{ handleSubmit }">
                <Field v-slot="{ field, errorMessage }" name="name" rules="required">
                    <v-text-field v-model="name" :error-messages="errorMessage" autocomplete="name" v-bind="field"
                        autcomplete="name" name="name" :label="t('contact.name')" :disabled="loading" required />
                </Field>
                <Field v-slot="{ errorMessage, field }" name="email" rules="required|email" autocomplete="email">
                    <v-text-field v-model="email" v-bind="field" :error-messages="errorMessage" :label="t('contact.email')"
                        auto-complete="email" name="email" type="email" :disabled="loading" required />
                </Field>
                <Field v-slot="{ errorMessage, field }" name="message" rules="required|min:5|max:5000">
                    <v-textarea v-model="message" v-bind="field" :error-messages="errorMessage"
                        :label="t('contact.message')" :disabled="loading" auto-grow rows="3"
                        :counter="5000" maxlength="5000" />
                </Field>
                <div class="contact-actions">
                    <v-btn @click.prevent="handleSubmit(onsubmit)" type="submit" color="primary" class="mr-4"
                        :loading="loading">
                        {{ t('contact.send') }}
                    </v-btn>
                    <v-btn append-icon="mdi-github" href="https://github.com/pierresaid/katameros-api"
                        @click="track('contact-github')" class="github-btn" target="_blank">
                        GitHub
                    </v-btn>
                </div>
            </Form>
        </v-container>
        <div class="dco-footer">
            <a class="dco-ref text-medium-emphasis" href="https://copte.fr/" target="_blank" rel="noopener"
                @click="track('contact-dco')">
                <img class="dco-logo dco-logo-light" src="/img/dco-logo-black.png" width="122" height="132"
                    loading="lazy" alt="" aria-hidden="true" />
                <img class="dco-logo dco-logo-dark" src="/img/dco-logo-white.png" width="120" height="132"
                    loading="lazy" alt="" aria-hidden="true" />
                <span class="dco-name">
                    <span class="dco-name-main">Diocèse Copte Orthodoxe</span>
                    <span class="dco-name-sub">de Paris et du Nord de la France</span>
                </span>
            </a>
        </div>
    </div>
</template>

<style scoped>
.contact-actions {
    display: flex;
    flex-wrap: wrap;
}

.github-btn {
    margin-left: auto;
    font-weight: 700;
}

.contact-page {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 64px);
    min-height: calc(100dvh - 64px);
}

.dco-footer {
    margin-top: auto;
    padding: 40px 16px 24px;
    display: flex;
    justify-content: center;
}

.dco-ref {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    font-family: sans-serif;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.dco-ref:hover {
    opacity: 1;
}

.dco-name-main {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.4;
}

.dco-name-sub {
    display: block;
    font-size: 0.72rem;
    line-height: 1.4;
}

.dco-logo {
    height: 44px;
    width: auto;
}

.dco-logo-dark {
    display: none;
}

.v-theme--dark .dco-logo-light {
    display: none;
}

.v-theme--dark .dco-logo-dark {
    display: inline-block;
}
</style>
