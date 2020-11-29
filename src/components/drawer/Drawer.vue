<template>
  <v-navigation-drawer v-model="drawer" app hide-overlay>
    <template #prepend>
      <div class="pa-3 d-flex align-items-center">
        <v-app-bar-nav-icon icon aria-label="Menu" @click.stop="drawer = false"></v-app-bar-nav-icon>
        <h1 class="heading coptic">Katameroc</h1>
      </div>
      <v-divider />

      <div class="pa-2">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ on }">
            <v-text-field
              :value="formattedDate"
              label="Date"
              dense
              hide-details
              outlined
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="todayClicked">Today</v-btn>
            <v-btn text color="primary" @click="okClicked(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </div>
    </template>

    <v-divider />

    <v-list nav>
      <v-list-item-group :value="0" color="primary">
        <v-list-item v-for="(section, index) in sections" :key="index" link @click="menuItemClick(index)">
          <v-list-item-content>
            <v-list-item-title>{{ section.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template #append>
      <v-divider></v-divider>
      <v-select
        v-model="language"
        class="text--secondary pt-7 px-2"
        prepend-icon="translate"
        item-text="name"
        item-value="id"
        :items="languages"
        label="Translation"
        outlined
        filled
        dense
      ></v-select>
      <v-divider></v-divider>
      <div class="d-flex">
        <div class="d-flex justify-center align-center" style="width: 50%">
          <v-btn-toggle v-model="lineMode" mandatory>
            <v-btn>
              <v-icon>mdi-format-line-spacing</v-icon>
            </v-btn>

            <v-btn>
              <v-icon>mdi-view-headline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <v-divider vertical></v-divider>
        <div class="d-flex justify-space-around py-2" style="width: 50%">
          <v-btn v-if="!isEmbedded" fab small class="align-self-center" @click="navbarEnabled = !navbarEnabled">
            <v-icon v-if="navbarEnabled">fullscreen</v-icon>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              width="24"
              height="24"
              :fill="$vuetify.theme.dark ? 'white' : 'black'"
              viewBox="0 0 24 24"
            >
              <path d="M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z" />
            </svg>
          </v-btn>
          <v-btn fab small class="align-self-center" @click="setTheme">
            <v-icon>{{ $vuetify.theme.dark ? "brightness_4" : "brightness_7" }}</v-icon>
          </v-btn>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { format } from "date-fns";
import LANGUAGES from "../../consts/languages";

export default {
  props: {
    sections: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      menu: false,
      date: new Date().toISOString().substr(0, 10),
    };
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
    formattedDate() {
      return format(new Date(this.date), "dd/MM/yyyy");
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
        this.$store.commit("setNavbar", value);
      },
    },
  },
  methods: {
    ...mapActions("readings", ["setDate"]),
    async menuItemClick(index) {
      this.drawer = false;
      if (
        this.$store.state.navigation.panel.find((i) => {
          return i === index;
        }) === undefined
      ) {
        this.$store.state.navigation.sections[index].ref.$el.click();
      } else {
        window.scrollTo(scrollX, scrollY - 0.1);
        this.$vuetify.goTo(`#section-${index}`, {
          duration: 300,
          easing: "easeInOutCubic",
          offset: 10,
        });
      }
    },
    setTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.$store.commit("setDarkTheme", this.$vuetify.theme.dark ? "dark" : "light");
    },
    okClicked(date) {
      this.$refs.menu.save(date);
      this.setDate(new Date(date));
      this.drawer = false;
    },
    todayClicked() {
      const date = new Date().toISOString().substr(0, 10);
      this.$refs.menu.save(date);
      this.setDate(new Date(date));
      this.drawer = false;
    },
  },
};
</script>

<style></style>
