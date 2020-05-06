<template>
  <v-navigation-drawer :value="drawer" app @input="$emit('toggle', $event)">
    <template v-slot:prepend>
      <div class="pa-3 d-flex align-items-center">
        <v-app-bar-nav-icon
          icon
          @click.stop="$emit('toggle', false)"
        ></v-app-bar-nav-icon>
        <h1 class="heading">ⲕⲁⲧⲁⲙⲉⲣⲟⲥ</h1>
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
          <template v-slot:activator="{ on }">
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

    <template v-slot:append>
      <v-divider></v-divider>
      <div class="pa-2">
        <span class="d-flex justify-center">
          <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
            <v-icon>{{
              $vuetify.theme.dark ? "brightness_4" : "brightness_7"
            }}</v-icon>
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
  model: {
    prop: "drawer",
    event: "toggle"
  },
  props: {
    sections: {
      type: Array,
      required: false,
      default: () => []
    },
    drawer: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      menu: false,
      date: new Date().toISOString().substr(0, 10)
    };
  },
  computed: {
    formattedDate() {
      return format(new Date(this.date), "dd/MM/yyyy");
    }
  },
  methods: {
    ...mapActions("readings", ["setDate"]),
    menuItemClick(index) {
      this.$vuetify.goTo(`#section-${index}`, {
        duration: 300,
        easing: "easeInOutCubic",
        offset: 10
      });
      this.$emit("toggle", false);
    },
    okClicked(date) {
      this.$refs.menu.save(date);
      this.setDate(new Date(date));
      this.$emit("toggle", false);
    },
    todayClicked() {
      const date = new Date().toISOString().substr(0, 10);
      this.$refs.menu.save(date);
      this.setDate(new Date(date));
      this.$emit("toggle", false);
    }
  }
};
</script>

<style></style>
