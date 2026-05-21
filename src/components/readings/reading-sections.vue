    <template>
    <transition name="fade" mode="out-in">
        <v-container v-if="!readings.loading || readings.sections" key="content">
            <v-expansion-panels v-model="readings.panel" :multiple="true" variant="accordion">
                <v-expansion-panel v-for="(section, idx) in readings.sections" :key="section.id">
                    <reading-section :section="section" :idx="idx" />
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
        <v-container v-else key="skeleton" aria-busy="true">
            <div class="reading-skeleton" v-for="i in 3" :key="i" />
        </v-container>
    </transition>

</template>

<script setup lang="ts">
import { useReadings } from '../../store/readings.js';
import ReadingSection from './reading-section.vue';

const readings = useReadings()
</script>

<style scoped>
.reading-skeleton {
    height: 64px;
    margin-bottom: 1px;
    background-color: rgba(var(--v-theme-on-surface), 0.06);
    animation: reading-skeleton-pulse 1.6s ease-in-out infinite;
}

.v-theme--dark .reading-skeleton {
    background-color: rgba(var(--v-theme-on-surface), 0.1);
}

.reading-skeleton:first-child {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}

.reading-skeleton:last-child {
    margin-bottom: 0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}

@keyframes reading-skeleton-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .reading-skeleton {
        animation: none;
        opacity: 0.7;
    }
}
</style>
