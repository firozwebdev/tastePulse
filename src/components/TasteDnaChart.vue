<template>
  <div class="w-full h-full">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  tasteCategories: {
    type: Object,
    required: true
  }
});

const chartCanvas = ref(null);
let chart = null;

// Function to create the chart
function createChart() {
  if (!chartCanvas.value) return;
  
  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }
  
  // Prepare data from taste categories
  const categories = Object.keys(props.tasteCategories);
  
  // Generate colors for each category
  const colors = categories.map(category => {
    const colorMap = {
      music: 'rgba(139, 92, 246, 0.7)', // purple
      food: 'rgba(245, 158, 11, 0.7)',  // amber
      book: 'rgba(16, 185, 129, 0.7)',  // green
      travel: 'rgba(59, 130, 246, 0.7)', // blue
      fashion: 'rgba(236, 72, 153, 0.7)', // pink
      brand: 'rgba(99, 102, 241, 0.7)'   // indigo
    };
    
    return colorMap[category] || 'rgba(107, 114, 128, 0.7)'; // gray default
  });
  
  // Create chart data
  const data = {
    labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: categories.map(() => 1), // Equal weight for visualization
      backgroundColor: colors,
      borderWidth: 1,
      borderColor: colors.map(color => color.replace('0.7', '1'))
    }]
  };
  
  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e0e0e0' : '#374151',
          font: {
            family: 'Inter, sans-serif',
            size: 12
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = props.tasteCategories[categories[i]];
                return {
                  text: `${label}: ${value}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: 1,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = categories[context.dataIndex];
            const value = props.tasteCategories[category];
            return `${category}: ${value}`;
          }
        }
      }
    }
  };
  
  // Create the chart
  chart = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: data,
    options: options
  });
}

// Create chart when component is mounted
onMounted(() => {
  createChart();
});

// Watch for changes in taste categories and recreate chart
watch(() => props.tasteCategories, () => {
  createChart();
}, { deep: true });

// Watch for dark mode changes
watch(
  () => document.documentElement.classList.contains('dark'),
  () => {
    createChart();
  }
);
</script>