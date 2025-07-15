<template>
  <div class="progress-chart">
    <apexchart
      type="donut"
      :options="chartOptions"
      :series="[completed, total - completed]"
      width="300"
    />
    <p class="progress-text">{{ completed }} / {{ total }} tasks completed</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ApexChart from 'vue3-apexcharts'

defineProps({
  completed: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  }
})
</script>

<script>
export default {
  components: {
    apexchart: ApexChart,
  },
  data() {
    return {
      chartOptions: {
        labels: ['Completed', 'Remaining'],
        colors: ['#2ecc71', '#e74c3c'],
        legend: {
          position: 'bottom',
        },
        dataLabels: {
          enabled: true,
        },
      }
    }
  }
}
</script>

<style scoped>
.progress-chart {
  text-align: center;
  margin-bottom: 20px;
}
.progress-text {
  margin-top: 10px;
  font-weight: bold;
}
</style>