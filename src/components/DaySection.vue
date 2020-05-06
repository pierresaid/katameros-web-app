<template>
  <div class="my-10">
    <h2 class="display-2 text-center font-weight-bold mb-10">
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

<style></style>
