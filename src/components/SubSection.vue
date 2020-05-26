<template>
  <div class="subSection mb-10">
    <h2 v-if="subSection.title" class="subSection-title">
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
  margin-top: 10px;
}

.subSection-title {
  font-family: "Suez one";
  text-align: center;
  font-weight: 400;
  font-size: 1.6em;
  /* color: rgba(0, 0, 0, 0.6); */
}

.theme--dark .subSection-title {
  /* color: #cacaca; */
}

.reading {
  margin-top: 10px;
  margin-bottom: 60px;
}
</style>
