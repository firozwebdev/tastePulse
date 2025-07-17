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
let chartInstance = null;

function createChart() {
  if (!chartCanvas.value) return;
  
  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  // Prepare data from taste categories
  const categories = Object.keys(props.tasteCategories);
  
  // Generate colors for each category
  const colorMap = {
    music: 'rgba(139, 92, 246, 0.7)', // purple
    food: 'rgba(245, 158, 11, 0.7)',  // amber
    book: 'rgba(16, 185, 129, 0.7)',  // green
    travel: 'rgba(59, 130, 246, 0.7)', // blue
    fashion: 'rgba(236, 72, 153, 0.7)', // pink
    brand: 'rgba(99, 102, 241, 0.7)'   // indigo
  };
  
  const colors = categories.map(category => colorMap[category] || 'rgba(107, 114, 128, 0.7)');
  const borderColors = colors.map(color => color.replace('0.7', '1'));
  
  // Create chart data
  const data = {
    labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      data: categories.map(() => 1), // Equal weight for visualization
      backgroundColor: colors,
      borderWidth: 1,
      borderColor: borderColors
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
  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: data,
    options: options
  });
}

// Create chart when component is mounted
onMounted(() => {
  // Small delay to ensure the canvas is properly rendered
  setTimeout(() => {
    createChart();
  }, 100);
});

// Watch for changes in taste categories and recreate chart
watch(() => props.tasteCategories, () => {
  setTimeout(() => {
    createChart();
  }, 100);
}, { deep: true });

// Watch for dark mode changes
watch(
  () => document.documentElement.classList.contains('dark'),
  () => {
    setTimeout(() => {
      createChart();
    }, 100);
  }
);
</script>