<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="date"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template #activator="{ on }">
        <v-text-field
          :value="formattedDate"
          class="pt-1"
          dense
          hide-details
          solo-inverted
          prepend-icon="event"
          readonly
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="date" no-title scrollable :locale="locale">
        <v-spacer></v-spacer>
        <v-btn text color="secondary" @click="menu = false">Retour</v-btn>
        <v-btn text color="primary" @click="todayClicked">Aujourd'hui</v-btn>
        <v-btn text color="primary" @click="okClicked(date)">OK</v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { format } from "date-fns";

export default {
  props: ["value", "locale"],
  data: () => ({
    date: "",
    menu: false,
  }),
  computed: {
    formattedDate() {
      return this.$props.locale.includes("coptic")
        ? new Date(this.value)
            .toLocaleDateString("fr-FR-u-ca-coptic", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              era: "short",
            })
            .split(" ")[0]
        : format(new Date(this.value), "dd/MM/yyyy");
    },
  },
  watch: {
    value(newValue) {
      this.date = new Date(newValue).toISOString().substr(0, 10);
    },
  },
  created() {
    this.date = this.$props.value;
  },
  methods: {
    okClicked(date) {
      if (new Date(this.value).toISOString().substr(0, 10) != this.date) {
        this.$refs.menu.save(date);
        this.$emit("input", date);
      }
      this.$emit("submit");
    },
    todayClicked() {
      const date = new Date().toISOString().substr(0, 10);
      if (date != this.date) {
        this.$refs.menu.save(date);
        this.$emit("input", date);
      }
      this.$emit("submit");
    },
  },
};
</script>

<style></style>
