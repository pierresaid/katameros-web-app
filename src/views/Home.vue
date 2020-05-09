<template>
  <div class="mt-10">
    <v-expansion-panels v-model="panel" focusable multiple accordion>
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

<style>
.v-expansion-panel:first-child div:first-child,
.v-expansion-panels {
  border-radius: 20px;
}

.v-expansion-panel:last-child .v-expansion-panel-header,
.v-expansion-panels {
  transition: border-bottom-left-radius 0.3s ease;
}

.v-expansion-panel:last-child:not(.v-item--active) .v-expansion-panel-header,
.v-expansion-panels {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
