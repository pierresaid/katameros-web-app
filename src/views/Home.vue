<template>
  <div>
    <span v-for="(section, index) in sections" :key="index">
      <day-section :id="`section-${index}`" :section="section" />
    </span>
  </div>
</template>

<script>
import DaySection from "../components/DaySection.vue";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: { DaySection },
  computed: {
    ...mapState("readings", ["sections"])
  }
};
</script>

<style scoped></style>
