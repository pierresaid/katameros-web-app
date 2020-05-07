<template>
  <div class="my-10">
    <h2 class="mb-2 section-title">
      {{ section.title }}
    </h2>
    <span v-for="(subSection, index) in section.subSections" :key="index">
      <subSection :sub-section="subSection" />
    </span>
  </div>
</template>

<script>
import SubSection from "./SubSection.vue";
export default {
  components: { SubSection },
  props: {
    section: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
.section-title {
  text-align: center;
  text-transform: uppercase;
  font-weight: 450;
  font-size: 2em;
}
</style>
