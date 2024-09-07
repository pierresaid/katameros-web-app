<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { useNotif } from '../store/notif';
import { useI18n } from 'vue-i18n';
import { http } from '../services/http';

const name = ref('');
const email = ref('');
const message = ref('');
const loading = ref(false);

const { t } = useI18n();
async function onsubmit() {
    loading.value = true;
    await http.post("/contact", {
        name: name.value,
        email: email.value,
        message: message.value
    });
    name.value = '';
    email.value = '';
    message.value = '';
    loading.value = false
    useNotif().success(t('MessageSent'));
}
</script>

<template>
    <v-container>
        <h2>
            Contact
        </h2>
        <Form v-slot="{ handleSubmit }">
            <Field v-slot="{ field, errorMessage }" name="name" rules="required">
                <v-text-field v-model="name" :error-messages="errorMessage" autocomplete="name" v-bind="field"
                    autcomplete="name" name="name" label="Nom" required />
            </Field>
            <Field v-slot="{ errorMessage, field }" name="email" rules="required|email" autocomplete="email">
                <v-text-field v-model="email" v-bind="field" :error-messages="errorMessage" label="E-mail" name="email"
                    required />
            </Field>
            <Field v-slot="{ errorMessage, field }" name="message" rules="required|min:5">
                <v-textarea v-model="message" v-bind="field" :error-messages="errorMessage" label="Message" />
            </Field>
            <div style="display: flex; flex-wrap: wrap">
                <v-btn @click.prevent="handleSubmit(onsubmit)" type="submit" color="primary" class="mr-4"
                    :loading="loading">
                    Envoyer
                </v-btn>
                <v-btn append-icon="mdi-github" href="https://github.com/pierresaid/katameros-api"
                    style="text-transform: capitalize; margin-left:auto; font-weight: 700;" target="_blank">
                    Github
                </v-btn>
            </div>
        </Form>
    </v-container>
</template>
