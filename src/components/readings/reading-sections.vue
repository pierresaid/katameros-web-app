    <template>
    <transition name="fade" mode="out-in">
        <v-container v-if="readings.loading == false">
            <v-expansion-panels v-model="readings.panel" :multiple="true" variant="accordion">
                <v-expansion-panel v-for="(section, idx) in readings.sections" :key="section.id">
                    <reading-section :section="section" :idx="idx" />
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
        <v-progress-linear v-else indeterminate color="yellow darken-2" class="mx-a" style="width: 88%;" />
    </transition>

</template>

<script setup lang="ts">
import { useReadings } from '../../store/readings.js';
import ReadingSection from './reading-section.vue';

const readings = useReadings()
</script>
