<template>
  <div>
    <h3 v-if="reading.title">{{ reading.title }}</h3>
    <div v-if="reading.introduction" class="reading-introduction mb-5">
      <div v-for="(introduction, index) in reading.introduction.split('\n')" :key="index" class="introduction">
        {{ introduction }}
      </div>
    </div>
    <div class="mx-10 d-flex justify-center">
      <v-btn color="primary" style="color: black" tag="a" :href="reading.synaxLink" large block
        >Lire le synaxaire du jour</v-btn
      >
    </div>
    <div v-if="reading.conclusion" class="reading-conclusion">
      {{ reading.conclusion }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reading: {
      type: Object,
      required: true,
    },
  },
  computed: {
    lineMode() {
      return this.$store.state.lineMode;
    },
  },
};
</script>

<style>
.reading-introduction {
  color: #d71b1b;
}
#app.theme--dark .reading-introduction {
  color: #ff3c3c;
}

.introduction ~ .introduction {
  margin-top: 8px;
}
.reading-conclusion {
  text-align: right;
  color: #d71b1b;
}

#app.theme--dark .reading-conclusion {
  color: #ff3c3c;
}

.verse-text {
  line-height: 1.3;
  margin-bottom: 10px;
}
.ref {
  font-weight: 500;
  font-size: 1.2em;
  text-transform: uppercase;
}
</style>
