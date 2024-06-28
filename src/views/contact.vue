<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { useNotif } from '../store/notif';
import { useI18n } from 'vue-i18n';

const name = ref('');
const email = ref('');
const message = ref('');
const loading = ref(false);

function encode(data: any) {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&")
}

const { t } = useI18n();
async function onsubmit() {
    loading.value = true;
    await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
            "form-name": "contact",
            name: name.value,
            email: email.value,
            message: message.value
        })
    })
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
                    name="name" label="Nom" required />
            </Field>
            <Field v-slot="{ errorMessage, field }" name="email" rules="required|email">
                <v-text-field v-model="email" v-bind="field" :error-messages="errorMessage" label="E-mail" name="email"
                    required />
            </Field>
            <Field v-slot="{ errorMessage, field }" name="message" rules="required|min:5">
                <v-textarea v-model="message" v-bind="field" :error-messages="errorMessage" label="Message" />
            </Field>
            <v-btn @click.prevent="handleSubmit(onsubmit)" type="submit" color="primary" class="mr-4"
                :loading="loading">
                Envoyer
            </v-btn>
        </Form>
    </v-container>
</template>
