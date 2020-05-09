<template>
  <div>
    <v-expansion-panels v-model="panel" flat focusable multiple>
      <v-expansion-panel
        v-for="(section, index) in sections"
        :key="index"
        @click="onClick(index)"
      >
        <day-section :id="`section-${index}`" :section="section" :idx="index" />
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import DaySection from "../components/DaySection.vue";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: { DaySection },
  computed: {
    ...mapState("readings", ["sections"]),
    panel: {
      get() {
        return this.$store.state.navigation.panel;
      },
      set(value) {
        this.$store.commit("navigation/SET_PANEL", value);
      }
    }
  },
  methods: {
    async onClick(index) {
      if (
        this.$store.state.navigation.panel.find(i => {
          return i === index;
        }) === undefined
      ) {
        window.scrollTo(scrollX, scrollY - 1);
        await new Promise(r => setTimeout(r, 50));
        this.$vuetify.goTo(`#section-${index}`, {
          duration: 300,
          easing: "easeInOutCubic",
          offset: 10
        });
      }
    }
  }
};
</script>

<style></style>
