  const MAX_POINTS = 15;  // Limitar a quantidade de pontos no gráfico para 15

// Função para atualizar os gráficos com novos dados
function updateChart(chart, label, dataPoint) {
    // Adicionar novo dado
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(dataPoint);
    
    // Remover o dado mais antigo se passar do limite de 15 pontos
    if (chart.data.labels.length > MAX_POINTS) {
        chart.data.labels.shift(); // Remove o primeiro (mais antigo)
        chart.data.datasets[0].data.shift(); // Remove o primeiro (mais antigo)
    }
    
    chart.update();
}

// Inicializar os gráficos
const inclinationChart = new Chart(document.getElementById('inclination-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Leituras de inclinação',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const humidityChart = new Chart(document.getElementById('humidity-chart'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Leituras de umidade',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


const vibrationChart = new Chart(document.getElementById('vibration-chart'), {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Leituras de vibração',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

fetch('http://localhost:5000/historico/1')
//fetch('wss://d437-2804-7efc-352-8401-115c-4520-c1e4-2f94.ngrok-free.app/historico/1')
  .then(response => response.json())
  .then(data => {
    // Exibir os 15 últimos registros
    data.slice(-MAX_POINTS).forEach(dado => {
        updateChart(inclinationChart, dado.timestamp, dado.inclination);
        updateChart(humidityChart, dado.timestamp, dado.humidity);
        updateChart(vibrationChart, dado.timestamp, dado.vibration);
    });
  })
  .catch(err => console.error('Erro ao obter dados históricos:', err));

// WebSocket para atualizar os gráficos em tempo real

const socket = new WebSocket('ws://localhost:3000');
//const socket = new WebSocket('wss://d437-2804-7efc-352-8401-115c-4520-c1e4-2f94.ngrok-free.app');

socket.onopen = () => {
    console.log('Conectado ao WebSocket');
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const timestamp = new Date().toLocaleTimeString();  // Usar a hora atual como rótulo

  if (data.sensor === 'inclination') {
      updateChart(inclinationChart, timestamp, data.value);
  } else if (data.sensor === 'humidity') {
      updateChart(humidityChart, timestamp, data.value);
  } else if (data.sensor === 'vibration') {
      updateChart(vibrationChart, timestamp, data.value);
  }
};

socket.onerror = (error) => {
    console.error('Erro no WebSocket:', error);
};

socket.onclose = () => {
    console.log('Conexão WebSocket fechada');
};

  