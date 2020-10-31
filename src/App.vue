<template>
  <v-app dark>
    <v-snackbar v-model="error" color="error" bottom :timeout="0">
      <v-icon color="white">signal_wifi_off</v-icon>Connection error
      <v-btn aria-label="Refresh" color="light-blue darken-1" dark @click="loadReadings">Refresh</v-btn>
    </v-snackbar>

    <v-app-bar v-if="navbarEnabled" app color="primary" class="black--text">
      <v-app-bar-nav-icon class="black--text" aria-label="Menu" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h1 class="heading coptic">Katameroc</h1>
      <v-spacer />
      <v-btn color="transparent" to="/" fab text aria-label="home" @click="homeClicked">
        <v-img contain src="@/assets/coptic_cross_full.png" width="50" />
      </v-btn>
    </v-app-bar>

    <button v-else class="bookmark-button" @click="drawer = !drawer">
      <div class="d-flex justify-center align-items-center" style="cursor:pointer;">
        <svg
          style="cursor:pointer;"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
          class="block text-nuxt-gray dark:text-dark-onSurfaceSecondary stroke-current transition-colors duration-300 ease-linear"
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

    <v-content>
      <v-container>
        <h1 class="display-1 text-center mt-10 text-capitalize main-title">
          <svg
            width="100"
            :fill="$vuetify.theme.dark ? 'white' : 'black'"
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 541.000000 561.000000"
          >
            <g transform="translate(0.000000,561.000000) scale(0.100000,-0.100000)" stroke="none">
              <path
                d="M2300 5205 l0 -405 -380 0 -380 0 0 -405 0 -405 -370 0 -370 0 0 -385 0 -385 -400 0 -400 0 0 -410 0 -410 400 0 400 0 0 -390 0 -390 370 0 370 0 0 -400 0 -400 380 0 380 0 0 -405 0 -405 400 0 400 0 0 405 0 405 375 0 375 0 0 405 0 405 375 0 375 0 0 385 0 385 400 0 400 0 0 430 0 430 -400 0 -400 0 0 385 0 385 -375 0 -375 0 0 385 0 385 -375 0 -375 0 0 405 0 405 -400 0 -400 0 0 -405z m0 -1605 l0 -380 -355 0 -355 0 0 380 0 380 355 0 355 0 0 -380z m1510 20 l0 -360 -355 0 -355 0 0 360 0 360 355 0 355 0 0 -360z m-1510 -1605 l0 -385 -355 0 -355 0 0 385 0 385 355 0 355 0 0 -385z m1510 0 l0 -385 -355 0 -355 0 0 385 0 385 355 0 355 0 0 -385z"
              />
            </g>
          </svg>
          <div class="main-title">
            {{ formattedDate }}
          </div>
          <div class="main-title">
            {{ formattedCopticDate }}
          </div>
          <div class="main-title">
            {{ title }}
          </div>
        </h1>

        <v-fade-transition mode="out-in">
          <div v-if="loading" class="d-flex justify-center mt-10" style="width: 100%">
            <v-progress-circular indeterminate color="primary" />
          </div>
          <router-view v-else />
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from "@/components/drawer/Drawer.vue";
import { mapActions, mapState } from "vuex";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import getCopticMonth from "@/helpers/getCopticMonth";

export default {
  name: "App",
  components: { Navigation },
  data() {
    return {
      loading: false,
      error: false,
    };
  },
  computed: {
    ...mapState("readings", ["title", "sections", "date"]),
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
    formattedDate() {
      return format(this.date, "EEEE d LLLL", { locale: fr });
    },
    formattedCopticDate() {
      const [day, month] = this.date
        .toLocaleDateString("fr-FR-u-ca-coptic", {
          month: "numeric",
          day: "numeric",
        })
        .split("/");
      return `${day} ${getCopticMonth(month)}`;
    },
  },
  watch: {
    date() {
      this.loadReadings(this.date);
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
      this.loading = true;
      await this.getReadings(this.date).catch(() => {
        this.error = true;
      });
      this.loading = false;
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
.main-title {
  font-family: "Suez One";
}

.bookmark-button {
  position: fixed;
  z-index: 1;
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

#app.theme--dark .bookmark-button {
  background-color: #1e1e1e;
  border: 1px solid #1e1e1e;
}
</style>
