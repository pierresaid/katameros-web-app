<template>
  <v-app dark>
    <v-snackbar v-model="error" color="error" bottom :timeout="0">
      <v-icon color="white">signal_wifi_off</v-icon>Connection error
      <v-btn color="light-blue darken-1" dark @click="loadReadings"
        >Refresh</v-btn
      >
    </v-snackbar>

    <v-system-bar color="primary"></v-system-bar>

    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <h1 class="heading">ⲕⲁⲧⲁⲙⲉⲣⲟⲥ</h1>
      <v-spacer />
      <v-btn color="transparent" to="/" fab text aria-label="home">
        <v-img contain src="@/assets/coptic_cross_full.png" width="50" />
      </v-btn>
    </v-app-bar>

    <navigation v-model="drawer" :sections="sections" />

    <v-content>
      <v-container>
        <h1 class="display-1 text-center mt-10">
          Lectures du {{ date.toLocaleDateString() }}
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
export default {
  name: "App",
  components: { Navigation },
  data() {
    return {
      loading: false,
      error: false,
      drawer: false
    };
  },
  computed: {
    ...mapState("readings", ["sections", "date"])
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
