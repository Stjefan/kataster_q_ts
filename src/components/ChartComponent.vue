<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: ['pegelreihen'],
  data() {
    return {
      chartData: {
        labels: ['31.5 Hz', '63 Hz', '125 Hz', '250 Hz', '500 Hz', '1000 Hz', '2000 Hz', '4000 Hz', '8000 Hz', 'S'],
        datasets: this.pegelreihen.map((i, idx) => ({ label: idx == 0 ? 'LwLin' : 'LwA', backgroundColor: '#f87979', data: [i.hz31_5, i.hz63, i.hz125, i.hz250, i.hz500, i.hz1000, i.hz2000, i.hz4000, i.hz8000, i.summiert] }))//[{ data: [40, 20, 12] }, { data: [50, 10, 15] }]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>
