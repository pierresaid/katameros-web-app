<template>
  <div>
    <v-expansion-panel-header ref="section" color="primary" ripple>
      <h2 class="section-title">
        {{ section.title }}
      </h2>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <span v-for="(subSection, index) in section.subSections" :key="index">
        <subSection :sub-section="subSection" />
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
</style>
