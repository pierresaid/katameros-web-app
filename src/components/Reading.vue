<template>
  <div>
    <h3 v-if="reading.title">{{ reading.title }}</h3>
    <div v-if="reading.introduction" class="reading-introduction mb-5">
      {{ reading.introduction }}
    </div>
    <h3 class="mb-2 ref">{{ Ref }}</h3>
    <div v-for="(passage, passageIdx) in reading.passages" :key="passageIdx">
      <div
        v-for="(verse, verseIdx) in passage.verses"
        :key="verseIdx"
        class="verse-text"
      >
        <span class="overline">{{ verse.number }}</span> {{ verse.text }}
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
      required: true
    }
  },
  computed: {
    Ref() {
      let ref = "";
      for (let i = 0; i < this.reading.passages.length; i++) {
        const passage = this.reading.passages[i];
        ref += `${
          i === 0 || this.reading.passages[i - 1].bookId !== passage.bookId
            ? passage.bookTranslation
            : ""
        } ${passage.ref} ${
          i === this.reading.passages.length - 1 ? "" : " & "
        }`;
      }
      return ref;
    }
  }
};
</script>

<style>
.reading-introduction {
  color: #d71b1b;
}
.reading-conclusion {
  text-align: right;
  color: #d71b1b;
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
