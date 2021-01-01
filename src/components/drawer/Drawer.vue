<template>
  <v-navigation-drawer v-model="drawer" app hide-overlay :right="$vuetify.rtl">
    <div class="pa-3 d-flex align-items-center">
      <v-app-bar-nav-icon icon aria-label="Menu" @click.stop="drawer = false"></v-app-bar-nav-icon>
      <h1 class="heading coptic">Katameroc</h1>
    </div>
    <v-divider />

    <div class="pa-2">
      <span class="font-weight-bold">Date</span>
      <date-picker v-model="date" locale="fr-FR" @submit="drawer = false" />
    </div>
    <div class="pa-2">
      <span class="font-weight-bold">Date copte</span>
      <date-picker v-model="date" locale="fr-FR-u-ca-coptic" @submit="drawer = false" />
    </div>

    <v-divider></v-divider>
    <div class="pa-2">
      <span class="font-weight-bold">Langue</span>
      <v-select
        v-model="language"
        class="text--secondary pt-1"
        prepend-icon="translate"
        item-text="name"
        item-value="id"
        hide-details
        :items="languages"
        label="Langage"
        solo-inverted
        dense
      ></v-select>
    </div>
    <v-divider></v-divider>
    <div class="px-2 py-2">
      <span class="font-weight-bold">Espacement</span>
      <div class="d-flex">
        <v-btn-toggle v-model="lineMode" active-class="primary black--text" dense mandatory>
          <v-btn>
            <v-icon :color="lineMode == 0 ? 'black' : ''" class="mr-1">mdi-format-line-spacing</v-icon>
            Ligne
          </v-btn>
          <v-btn>
            <v-icon :color="lineMode == 1 ? 'black' : ''" class="mr-1">mdi-view-headline</v-icon>
            Paragraphe
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="px-2 py-2">
      <span class="font-weight-bold">Theme</span>
      <div class="d-flex">
        <v-btn-toggle :value="$vuetify.theme.dark ? 1 : 0" active-class="primary black--text" dense mandatory>
          <v-btn @click="setTheme">
            <v-icon :color="!$vuetify.theme.dark ? 'black' : ''" class="mr-1">brightness_7</v-icon>
            Clair
          </v-btn>
          <v-btn @click="setTheme">
            <v-icon :color="$vuetify.theme.dark ? 'black' : ''" class="mr-1">brightness_4</v-icon>
            Sombre
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <!-- <v-divider></v-divider>
      <div class="px-2 py-2 d-flex justify-center">
        <v-icon>chat_bubble</v-icon>
        <v-btn to="/contact" class="ml-2"> Contact </v-btn>
      </div> -->
    <template #append> </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import LANGUAGES from "../../consts/languages";
import DatePicker from "./DatePicker.vue";

export default {
  components: { DatePicker },
  props: {
    sections: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    ...mapState(["isEmbedded"]),
    languages: () => Object.values(LANGUAGES),
    language: {
      get() {
        return this.$store.state.readings.language;
      },
      set(language) {
        if (this.language !== language) {
          this.$store.dispatch("readings/setLanguage", language);
        }
      },
    },
    drawer: {
      get() {
        return this.$store.state.navigation.drawer;
      },
      set(value) {
        this.$store.commit("navigation/SET_DRAWER", value);
      },
    },
    lineMode: {
      get() {
        return this.$store.state.lineMode;
      },
      set(lineMode) {
        this.$store.commit("setLineMode", lineMode);
      },
    },
    navbarEnabled: {
      get() {
        return this.$store.state.navbar;
      },
      set(value) {
        this.$store.commit("setNavbar", new Date(value));
      },
    },
    date: {
      get() {
        return this.$store.state.readings.date.toISOString().substr(0, 10);
      },
      set(dateStr) {
        this.setDate(new Date(dateStr));
      },
    },
  },
  methods: {
    ...mapActions("readings", ["setDate"]),
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$store.commit("setDarkTheme", this.$vuetify.theme.dark ? "dark" : "light");
    },
  },
};
</script>

<style></style>
