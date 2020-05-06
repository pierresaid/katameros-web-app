<template>
  <div class="subSection mb-10">
    <h2
      v-if="subSection.title"
      class="my-2 headline font-weight-medium text-center"
    >
      {{ subSection.title }}
    </h2>
    <div v-if="subSection.introduction" class="subSection-introduction">
      {{ subSection.introduction }}
    </div>
    <span v-for="(reading, index) in subSection.readings" :key="index">
      <reading :reading="reading" class="reading" />
    </span>
  </div>
</template>

<script>
import Reading from "./Reading.vue";
export default {
  components: { Reading },

  props: {
    subSection: {
      type: Object,
      required: true
    }
  }
};
</script>

<style>
.subSection-introduction {
  color: #d71b1b;
}
.reading {
  margin-top: 20px;
  margin-bottom: 60px;
}
</style>
