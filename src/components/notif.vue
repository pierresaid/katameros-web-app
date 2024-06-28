<script setup lang="ts">
import { useNotif } from '../store/notif';

const notif = useNotif()
</script>

<template>
    <v-snackbar :color="notif.color" v-model="notif.open">
        {{ notif.text }}
        <template v-slot:actions>
            <v-btn variant="text" @click="notif.open = false" icon="mdi-close" />
        </template>
    </v-snackbar>
</template>
