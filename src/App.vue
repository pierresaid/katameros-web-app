<template>
  <v-app dark>
    <v-snackbar v-model="error" color="error" bottom :timeout="-1">
      <div class="d-flex align-center pl-4">
        <v-icon color="white" class="pr-2">signal_wifi_off</v-icon>Connection error
      </div>
      <template #action>
        <v-btn
          aria-label="Refresh"
          color="info"
          tile
          style="width: 90px; margin-right: -8px"
          depressed
          fab
          @click="loadReadings"
          >Refresh</v-btn
        >
      </template>
    </v-snackbar>

    <v-app-bar v-if="navbarEnabled && !isEmbedded" app color="primary" class="black--text">
      <v-app-bar-nav-icon class="black--text" aria-label="Menu" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h1 class="heading coptic">Katameroc</h1>
      <v-spacer />
      <v-btn color="transparent" to="/" fab text aria-label="home" @click="homeClicked">
        <v-img contain src="@/assets/coptic_cross_full.png" width="50" />
      </v-btn>
    </v-app-bar>

    <button v-else class="bookmark-button" @click="drawer = !drawer">
      <div class="d-flex justify-center align-items-center" style="cursor: pointer">
        <svg
          style="cursor: pointer"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <line x1="8" x2="21" y1="6" y2="6"></line>
          <line x1="8" x2="21" y1="12" y2="12"></line>
          <line x1="8" x2="21" y1="18" y2="18"></line>
          <line x1="3" x2="3" y1="6" y2="6"></line>
          <line x1="3" x2="3" y1="12" y2="12"></line>
          <line x1="3" x2="3" y1="18" y2="18"></line>
        </svg>
      </div>
    </button>

    <navigation :sections="sections" />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "@/components/drawer/Drawer.vue";
import { mapActions, mapState } from "vuex";
import LANGUAGES from "./consts/languages";

export default {
  name: "App",
  components: { Navigation },
  data() {
    return {
      error: false,
    };
  },
  computed: {
    ...mapState(["isEmbedded"]),
    ...mapState("readings", ["sections", "date"]),
    drawer: {
      get() {
        return this.$store.state.navigation.drawer;
      },
      set(value) {
        this.$store.commit("navigation/SET_DRAWER", value);
      },
    },
    navbarEnabled: {
      get() {
        return this.$store.state.navbar;
      },
      set(value) {
        this.$store.commit("setNavbar", value);
      },
    },
  },
  watch: {
    date() {
      this.loadReadings(this.date);
    },
    language: {
      immediate: true,
      handler(language) {
        if (Object.values(LANGUAGES).find((l) => l.id === language)?.rtl) {
          this.$vuetify.rtl = true;
        } else {
          this.$vuetify.rtl = false;
        }
      },
    },
  },
  async mounted() {
    if (this.$store.state.theme == "dark") {
      this.$vuetify.theme.dark = true;
    }
    this.loadReadings();
  },
  methods: {
    ...mapActions("readings", ["getReadings"]),
    homeClicked() {
      this.$store.commit("navigation/SET_PANEL", []);
      this.$vuetify.goTo(0, {
        duration: 300,
        easing: "easeInOutCubic",
      });
    },
    async loadReadings() {
      this.error = false;
      await this.getReadings(this.date).catch(() => {
        this.error = true;
      });
    },
  },
};
</script>

<style>
@font-face {
  font-family: "Avva Shenouda";
  src: url("/fonts/Avva_Shenouda.ttf");
}

.coptic {
  font-family: "Avva Shenouda";
}

.bookmark-button {
  background-color: white;
  position: fixed;
  z-index: 2;
  left: 0;
  top: 20vh;
  cursor: pointer !important;
  height: 2.5rem;
  width: 2.5rem;
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: linear;
  transition-duration: 0.3s;
  outline: none;
  border-radius: 0 9999px 9999px 0;
  border: 1px solid #e2e8f0;
  box-shadow: 4px 2px 4px rgba(0, 0, 0, 0.101562);
}

.v-application--is-rtl .bookmark-button {
  left: inherit;
  right: 0;
  border-radius: 9999px 0 0 9999px;
}

#app.theme--dark .bookmark-button {
  background-color: #1e1e1e;
  border: 1px solid #1e1e1e;
}
</style>
