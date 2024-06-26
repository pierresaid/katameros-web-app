import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotif = defineStore('notif', () => {
    const open = ref(false)
    const text = ref('')
    const color = ref('success')

    function success(str: string) {
        open.value = true
        text.value = str
        color.value = 'success'
    }

    return { open, text, color, success };
})