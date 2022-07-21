<template>
  <div>
    <h1 class="display-1 text-center mt-10 text-capitalize main-title">
      <svg
        width="100"
        :fill="$vuetify.theme.dark ? 'white' : 'black'"
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 541.000000 561.000000"
      >
        <g transform="translate(0.000000,561.000000) scale(0.100000,-0.100000)" stroke="none">
          <path
            d="M2300 5205 l0 -405 -380 0 -380 0 0 -405 0 -405 -370 0 -370 0 0 -385 0 -385 -400 0 -400 0 0 -410 0 -410 400 0 400 0 0 -390 0 -390 370 0 370 0 0 -400 0 -400 380 0 380 0 0 -405 0 -405 400 0 400 0 0 405 0 405 375 0 375 0 0 405 0 405 375 0 375 0 0 385 0 385 400 0 400 0 0 430 0 430 -400 0 -400 0 0 385 0 385 -375 0 -375 0 0 385 0 385 -375 0 -375 0 0 405 0 405 -400 0 -400 0 0 -405z m0 -1605 l0 -380 -355 0 -355 0 0 380 0 380 355 0 355 0 0 -380z m1510 20 l0 -360 -355 0 -355 0 0 360 0 360 355 0 355 0 0 -360z m-1510 -1605 l0 -385 -355 0 -355 0 0 385 0 385 355 0 355 0 0 -385z m1510 0 l0 -385 -355 0 -355 0 0 385 0 385 355 0 355 0 0 -385z"
          />
        </g>
      </svg>
      <div class="d-flex" style="justify-content: center; direction: ltr;">
        <div class="main-title" style="">
          <div>
            {{ formattedDate }}
          </div>
          <div class="d-flex" style="justify-content: center">
            <button style="margin-right: 5px; margin-left: 15px" @click="onChangeDate(-1)">
              <arrow-left width="48" height="48" />
            </button>
            <div>
              {{ formattedCopticDate }}
            </div>
            <button style="margin-left: 5px; margin-right: 15px" @click="onChangeDate(1)">
              <arrow-right width="48" height="48" />
            </button>
          </div>
        </div>
      </div>
      <div class="main-title">
        {{ periodInfo }}
      </div>
      <div class="main-title">
        {{ title }}
      </div>
    </h1>
    <v-fade-transition mode="out-in">
      <div v-if="loading" key="loading" class="d-flex justify-center mt-10" style="width: 100%">
        <v-progress-circular indeterminate color="primary" />
      </div>
      <div v-else key="readings" class="mt-8">
        <v-expansion-panels v-model="panel" focusable multiple accordion flat>
          <v-expansion-panel v-for="(section, index) in sections" :key="index" @click="onClick(index)">
            <day-section :id="`section-${index}`" :section="section" :idx="index" />
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import DaySection from "../components/DaySection.vue";
import { mapState } from "vuex";
import { format } from "date-fns";
import { fr, en } from "date-fns/locale";
import getCopticMonth from "@/helpers/getCopticMonth";
import getEklisiaSynax from "@/embedded/getEklisiaSynax";
import { stndrdth } from "@/embedded/stndrth";
import ArrowLeft from "../components/arrow-left.vue";
import ArrowRight from "../components/arrow-right.vue";
import LANGUAGES from '../consts/languages';

export default {
  name: "Home",
  components: { DaySection, ArrowLeft, ArrowRight },
  computed: {
    ...mapState("readings", ["sections", "date", "title", "loading", "periodInfo", "language"]),
    ...mapState(["isEmbedded"]),
    panel: {
      get() {
        return this.$store.state.navigation.panel;
      },
      set(value) {
        this.$store.commit("navigation/SET_PANEL", value);
      },
    },
    formattedDate() {
      const langCode = Object.values(LANGUAGES).find((l) => l.id === this.language).code;
      const locale = langCode === "fr" ? fr : en;
      return format(this.date, "EEEE d LLLL", { locale: locale });
    },
    formattedCopticDate() {
      const [day, month] = this.date
        .toLocaleDateString("fr-FR-u-ca-coptic", {
          month: "numeric",
          day: "numeric",
        })
        .split("/");
      return `${day} ${getCopticMonth(month)}`;
    },
  },
  watch: {
    sections() {
      //#region Embedded
      if (this.isEmbedded && this.sections) {
        const [day, month] = this.date
          .toLocaleDateString("fr-FR-u-ca-coptic", {
            month: "numeric",
            day: "numeric",
          })
          .split("/");
        const copticDay = parseInt(day);
        const copticMonth = parseInt(month);
        const synaxLink = getEklisiaSynax(copticDay, copticMonth);
        const liturgy = this.sections.find((x) => x.id === 3);
        const actsIdx = liturgy.subSections.findIndex((x) => x.id === 5);

        const intro = `Au nom du Père, du Fils et du Saint-Esprit, un seul Dieu Amen.
Le ${stndrdth(copticDay)} jour du mois copte béni de ${getCopticMonth(copticMonth)}.
Que Dieu bénisse ce mois, qu'Il nous aide à bien ${
          copticDay <= 15 ? "l'accueillir" : "le quitter"
        } et qu'Il nous accorde de le retrouver dans le calme et la quiétude, après que nos péchés auront été remis grâce à la miséricorde de notre Seigneur, mes pères et mes frères et soeurs. Amen !`;

        liturgy.subSections.splice(actsIdx + 1, 0, {
          id: 5,
          title: this.$vuetify.rtl ? "السنكسار" : "Synaxaire",
          introduction: null,
          readings: [
            {
              id: 6, // Synaxaire
              title: null,
              introduction: intro,
              conclusion: null,
              passages: [],
              synaxLink: synaxLink,
            },
          ],
        });
      }
      //#endregion
    },
  },

  methods: {
    onChangeDate(inc) {
      const date = this.date.setDate(this.date.getDate() + inc);
      this.$store.dispatch("readings/setDate", new Date(date));
    },
    async onClick(index) {
      if (
        this.$store.state.navigation.panel.find((i) => {
          return i === index;
        }) === undefined
      ) {
        window.scrollTo(scrollX, scrollY - 1);
        await new Promise((r) => setTimeout(r, 50));
        this.$vuetify.goTo(`#section-${index}`, {
          duration: 300,
          easing: "easeInOutCubic",
          offset: 10,
        });
      }
    },
  },
};
</script>

<style lang="scss">
@import "~vuetify/src/styles/styles.sass";
.main-title {
  font-family: "Suez One";
}

.v-expansion-panel:first-child div:first-child,
.v-expansion-panels {
  border-radius: 20px;
}

.v-expansion-panel:last-child .v-expansion-panel-header,
.v-expansion-panels {
  transition: border-bottom-left-radius 0.3s ease;
  border-right: solid 1px map-get($amber, lighten-4);
  border-left: solid 1px map-get($amber, lighten-4);
}

#app.theme--dark {
  .v-expansion-panel:last-child .v-expansion-panel-header,
  .v-expansion-panels {
    border-right: solid 1px #a08123;
    border-left: solid 1px #a08123;
  }
}

.v-expansion-panel:last-child:not(.v-item--active) .v-expansion-panel-header,
.v-expansion-panels {
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}
</style>
