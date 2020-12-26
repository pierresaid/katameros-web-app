<template>
  <div>
    <v-expansion-panel-header ref="section" color="primary" ripple>
      <h2 class="section-title">
        {{ section.title }}
      </h2>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div v-if="section.subSections.length > 1" class="d-flex justify-center my-4 mt-4 mx-4 flex-column">
        <v-btn
          v-for="(subSection, index) in section.subSections"
          :key="index"
          outlined
          text
          large
          class="sub-section-link"
          @click="menuItemClick(index)"
        >
          {{ subSection.title || subSection.readings[0].passages[0].bookTranslation }}
        </v-btn>
      </div>
      <div v-else class="my-4" />
      <span v-for="(subSection, index) in section.subSections" :key="index">
        <subSection :id="`sub-section-${idx}-${index}`" :sub-section="subSection" />
      </span>
    </v-expansion-panel-content>
  </div>
</template>

<script>
import SubSection from "./SubSection.vue";
export default {
  components: { SubSection },
  props: {
    section: {
      type: Object,
      required: true,
    },
    idx: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.$store.commit("navigation/ADD_SECTION", {
      index: this.idx,
      ref: this.$refs.section,
    });
  },
  methods: {
    async menuItemClick(index) {
      window.scrollTo(scrollX, scrollY - 0.1);
      this.$vuetify.goTo(`#sub-section-${this.idx}-${index}`, {
        duration: 300,
        easing: "easeInOutCubic",
        offset: 10,
      });
    },
  },
};
</script>

<style>
.section-title {
  font-family: "Suez One";
  text-align: center;
  text-transform: uppercase;
  font-weight: 300;
  font-size: 2em;
  color: black;
}

.sub-section-link {
  border-radius: 0px;
  border-bottom-width: 0;
}

.sub-section-link:first-child {
  border-radius: 4px 4px 0 0;
}

.sub-section-link:last-child {
  border-radius: 0 0 4px 4px;
  border-bottom-width: 1px;
}

.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
  color: black !important;
}
</style>
