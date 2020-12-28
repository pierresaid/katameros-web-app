<template>
  <v-navigation-drawer v-model="drawer" app hide-overlay :right="$vuetify.rtl">
    <template #prepend>
      <div class="pa-3 d-flex align-items-center">
        <v-app-bar-nav-icon icon aria-label="Menu" @click.stop="drawer = false"></v-app-bar-nav-icon>
        <h1 class="heading coptic">Katameroc</h1>
      </div>
      <v-divider />

      <div class="pa-2">
        <span class="font-weight-bold">Date</span>
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
              class="pt-1"
              dense
              hide-details
              solo-inverted
              prepend-icon="event"
              readonly
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable locale="fr-fr">
            <v-spacer></v-spacer>
            <v-btn text color="secondary" @click="menu = false">Retour</v-btn>
            <v-btn text color="primary" @click="todayClicked">Aujourd'hui</v-btn>
            <v-btn text color="primary" @click="okClicked(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </div>
    </template>
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
    actualDate() {
      return this.$store.state.readings.date;
    },
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
      if (new Date(this.actualDate).toISOString().substr(0, 10) != this.date) {
        this.$refs.menu.save(date);
        this.setDate(new Date(date));
      }
      this.drawer = false;
    },
    todayClicked() {
      const date = new Date().toISOString().substr(0, 10);
      if (date != this.date) {
        this.$refs.menu.save(date);
        this.setDate(new Date(date));
      }
      this.drawer = false;
    },
  },
};
</script>

<style></style>
