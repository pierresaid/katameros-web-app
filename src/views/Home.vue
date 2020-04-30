<template>
  <v-container>
    <div v-if="sections !== null">
      <span v-for="(section, index) in sections" :key="index">
        <h2 class="display-1 font-regular my-10 text-center">
          {{ section.title }}
        </h2>
        <span v-for="(subSection, index) in section.subSections" :key="index">
          <h3>{{ subSection.title }}</h3>
          <p class="side">{{ subSection.introduction }}</p>
          <div class="my-10">
            <span v-for="(reading, index) in subSection.readings" :key="index">
              <h2>{{ reading.title }}</h2>
              <span class="side">{{ reading.introduction }}</span>
              <span v-for="(passage, index) in reading.passages" :key="index">
                <p class="headline my-4">{{ passage.ref }}</p>
                <span v-for="(verse, index) in passage.verses" :key="index">
                  <p>
                    <span class="grey--text overline">{{ verse.number }}</span>
                    {{ verse.text }}
                  </p>
                </span>
              </span>
              <p class="side font-italic">{{ reading.conclusion }}</p>
            </span>
          </div>
        </span>
        <v-divider class="my-4" />
      </span>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapState("readings", ["sections"])
  }
};
</script>

<style scoped>
.side {
  color: #f44336;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
