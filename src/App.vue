<template>
  <v-app dark>
    <v-snackbar v-model="error" color="error" bottom :timeout="0">
      <v-icon color="white">signal_wifi_off</v-icon>
      Connection error
      <v-btn color="light-blue darken-1" dark @click="loadReadings">
        Refresh
      </v-btn>
    </v-snackbar>

    <v-app-bar app color="primary" dark>
      <v-btn color="transparent" to="/" fab text aria-label="home">
        <v-img contain src="@/assets/coptic_cross_full.png" width="50" />
      </v-btn>
      <v-spacer />
      <h1 class="black--text heading">ⲕⲁⲧⲁⲙⲉⲣⲟⲥ</h1>
    </v-app-bar>

    <v-content>
      <span
        v-if="loading"
        style="width:100%; height:100%; display:flex; justify-content:center; align-items: center"
      >
        <v-progress-circular
          color="amber"
          style="width:40%; height:10%"
          indeterminate
        ></v-progress-circular>
      </span>
      <router-view v-else />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {
      loading: false,
      error: false
    };
  },
  async mounted() {
    this.loadReadings();
  },
  methods: {
    ...mapActions("readings", ["getReadings"]),
    async loadReadings() {
      this.error = false;
      this.loading = true;
      await this.getReadings(new Date()).catch(() => {
        this.error = true;
      });
      this.loading = false;
    }
  }
};
</script>
