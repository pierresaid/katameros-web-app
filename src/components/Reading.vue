<template>
  <div>
    <h3 v-if="reading.title">{{ reading.title }}</h3>
    <div v-if="reading.introduction" class="reading-introduction mb-5">
      <div v-for="(introduction, index) in reading.introduction.split('\n')" :key="index" class="introduction">
        {{ introduction }}
      </div>
    </div>
    <h3 class="mb-2 ref">{{ Ref }}</h3>
    <div v-for="(passage, passageIdx) in reading.passages" :key="passageIdx">
      <div
        :is="lineMode === 0 ? 'div' : 'span'"
        v-for="(verse, verseIdx) in passage.verses"
        :key="verseIdx"
        class="verse-text"
      >
        <span style="font-size: 0.8rem">{{ verse.number }}</span> {{ verse.text }}
      </div>
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
    Ref() {
      let ref = "";
      for (let i = 0; i < this.reading.passages.length; i++) {
        const passage = this.reading.passages[i];
        ref += `${i === 0 || this.reading.passages[i - 1].bookId !== passage.bookId ? passage.bookTranslation : ""} ${
          passage.ref
        } ${i === this.reading.passages.length - 1 ? "" : " & "}`;
      }
      return ref;
    },
    lineMode() {
      return this.$store.state.lineMode;
    },
  },
};
</script>

<style>
.reading-introduction {
  color: #850e0e;
}
#app.theme--dark .reading-introduction {
  color: #ff5353;
}

.introduction ~ .introduction {
  margin-top: 8px;
}
.reading-conclusion {
  text-align: right;
  color: #850e0e;
}

#app.theme--dark .reading-conclusion {
  color: #ff5353;
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
