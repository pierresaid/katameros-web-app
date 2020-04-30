<template>
  <v-app dark>
    <v-app-bar app color="primary" dark>
      <v-btn color="transparent" to="/" fab text>
        <v-img contain src="@/assets/coptic_cross_full.png" width="50" />
      </v-btn>
      <v-spacer />
      <h1 class="black--text display-3">ⲕⲁⲧⲁⲙⲉⲣⲟⲥ</h1>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "App",
  mounted() {
    this.getReadings(new Date());
  },
  methods: {
    ...mapActions("readings", ["getReadings"])
  }
};
</script>
