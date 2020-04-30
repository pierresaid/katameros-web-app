<template>
  <v-app dark>
    <v-app-bar app color="primary" dark>
      <v-btn color="transparent" to="/" fab text>
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
      loading: false
    };
  },
  async mounted() {
    this.loading = true;
    await this.getReadings(new Date());
    this.loading = false;
  },
  methods: {
    ...mapActions("readings", ["getReadings"])
  }
};
</script>
