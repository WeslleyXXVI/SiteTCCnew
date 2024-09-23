
document.addEventListener('DOMContentLoaded', () => {
    // Conectar ao WebSocket do servidor
    const socket = new WebSocket('ws://localhost:3000');
    //const socket = new WebSocket('wss://d437-2804-7efc-352-8401-115c-4520-c1e4-2f94.ngrok-free.app');

    // Função para atualizar o valor no HTML e limitar casas decimais
    const updateSensorData = (sensorType, value) => {
        document.getElementById(`${sensorType}-value`).textContent = value.toFixed(2);  // Limita a 2 casas decimais
    };

    // Evento de conexão aberta
    socket.onopen = () => {
        console.log('Conectado ao servidor WebSocket');
    };

    // Evento de mensagem recebida do servidor
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);  // Supondo que os dados recebidos são em formato JSON

        // Verificando o tipo de dado e atualizando o respectivo elemento
        if (data.sensor === 'inclination') {
            updateSensorData('inclination', data.value);
        } else if (data.sensor === 'humidity') {
            updateSensorData('humidity', data.value);
        } else if (data.sensor === 'vibration') {
            updateSensorData('vibration', data.value);
        }
    };

    // Evento de erro
    socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
    };

    // Evento de fechamento da conexão
    socket.onclose = () => {
        console.log('Conexão WebSocket fechada');
    };
});


