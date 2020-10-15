<template>
  <v-navigation-drawer v-model="drawer" app hide-overlay>
    <template #prepend>
      <div class="pa-3 d-flex align-items-center">
        <v-app-bar-nav-icon
          icon
          aria-label="Menu"
          @click.stop="drawer = false"
        ></v-app-bar-nav-icon>
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
        <v-list-item
          v-for="(section, index) in sections"
          :key="index"
          link
          @click="menuItemClick(index)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ section.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template #append>
      <v-divider></v-divider>
      <div class="pa-2">
        <span class="d-flex justify-center">
          <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-icon>{{ $vuetify.theme.dark ? "brightness_4" : "brightness_7" }}</v-icon>
          </v-btn>
        </span>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapActions } from "vuex";
import { format } from "date-fns";

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
