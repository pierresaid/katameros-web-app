<template>
  <v-app dark>
    <v-snackbar v-model="error" color="error" bottom :timeout="0">
      <v-icon color="white">signal_wifi_off</v-icon>Connection error
      <v-btn
        aria-label="Refresh"
        color="light-blue darken-1"
        dark
        @click="loadReadings"
        >Refresh</v-btn
      >
    </v-snackbar>

    <v-system-bar color="primary"></v-system-bar>

    <v-app-bar app color="primary" class="black--text">
      <v-app-bar-nav-icon
        class="black--text"
        aria-label="Menu"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <h1 class="heading coptic">Katameroc</h1>
      <v-spacer />
      <v-btn
        color="transparent"
        to="/"
        fab
        text
        aria-label="home"
        @click="homeClicked"
      >
        <v-img contain src="@/assets/coptic_cross_full.png" width="50" />
      </v-btn>
    </v-app-bar>

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
            <g
              transform="translate(0.000000,561.000000) scale(0.100000,-0.100000)"
              stroke="none"
            >
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
          <v-progress-circular
            v-if="loading"
            indeterminate
            color="primary"
            class="d-flex justify-center mt-10"
            style="width:100%;"
          />
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

export default {
  name: "App",
  components: { Navigation },
  data() {
    return {
      loading: false,
      error: false
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
      }
    },
    formattedDate() {
      return format(this.date, "EEEE d LLLL", { locale: fr });
    },
    formattedCopticDate() {
      return this.date.toLocaleDateString("fr-FR-u-ca-coptic", {
        month: "long",
        day: "numeric"
      });
    }
  },
  watch: {
    date() {
      this.loadReadings(this.date);
    }
  },
  async mounted() {
    this.loadReadings();
  },
  methods: {
    ...mapActions("readings", ["getReadings"]),
    homeClicked() {
      this.$store.commit("navigation/SET_PANEL", []);
      this.$vuetify.goTo(0, {
        duration: 300,
        easing: "easeInOutCubic"
      });
    },
    async loadReadings() {
      this.error = false;
      this.loading = true;
      await this.getReadings(this.date).catch(() => {
        this.error = true;
      });
      this.loading = false;
    }
  }
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
</style>
