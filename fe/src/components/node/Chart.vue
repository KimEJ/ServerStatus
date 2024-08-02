<template>
    <div style="width: 100%; overflow-x: auto;">
        <line-chart
            :style="{ 'max-width': (timeline.length * 30) + 'px', width: (timeline.length * 30) + 'px', height: '200px' }"
            v-bind="LineChartProps"></line-chart>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import { LineChart, useLineChart } from "vue-chart-3";
import { Chart, ChartData, registerables } from "chart.js";


Chart.register(...registerables);

const { timeline, datasets } = defineProps<{ timeline: string[], datasets: ChartData<"line">["datasets"] }>()

const chartData = computed<ChartData<"line">>(() => ({
    labels: timeline,
    datasets
}));

const { lineChartProps: LineChartProps } = useLineChart({
    chartData: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    align: 'start',
                },
            }
        }
    },
});


</script>