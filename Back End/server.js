
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const wss = new WebSocket.Server({ port: 3000 });

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('sensor_data.db');

// Função para enviar dados para os clientes conectados
function sendSensorData(sensorType, value) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ sensor: sensorType, value }));
        }
    });
}

// Evento de conexão aberta
wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);
    });

    ws.on('error', (error) => {
        console.error('Erro na conexão:', error);
    });

    ws.on('close', () => {
        console.log('Conexão WebSocket fechada');
    });
});

// API para retornar dados históricos dos sensores
app.get('/historico/:id', (req, res) => {
    const id = req.params.id;
    const daysAgo = new Date(Date.now() - id * 24 * 60 * 60 * 1000);
    
    db.all(`SELECT * FROM sensor_data WHERE timestamp >= ? ORDER BY id DESC LIMIT 100`, [daysAgo], (err, rows) => {
        if (err) {
            console.error('Erro ao ler dados do banco de dados:', err);
            res.status(500).send({ message: 'Erro ao ler dados do banco de dados' });
        } else {
            res.send(rows);
        }
    });
});

//Express API para fornecer dados georreferenciados
app.get('/sensores', (req, res) => {
    const sensores = [
        { id: 1, name: "Sensor 1", lat: -23.5505, lng: -46.6333, vibration: 2.5, humidity: 75 },
        { id: 2, name: "Sensor 2", lat: -23.5705, lng: -46.6309, vibration: 3.1, humidity: 60 },
        // Adicionar mais sensores fictícios e reais
    ];
    res.json(sensores);
});

//Renderizar página de um sensor específico
// server.js
app.get('/sensores/:id', (req, res) => {
    const sensorId = req.params.id;
    // Buscar informações do sensor no banco de dados
    const sensor = findSensorById(sensorId);  // Função fictícia
    res.render('sensorPage', { sensor });
});


// Iniciar servidor HTTP
const port = 5000;
app.listen(port, () => {
    console.log(`Servidor HTTP iniciado na porta ${port}`);
});

// Ler dados do banco de dados e enviar para os clientes a cada 1 segundo
setInterval(() => {
    db.get('SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) {
            console.error('Erro ao ler dados do banco de dados:', err);
        } else if (row) {
            sendSensorData('inclination', row.inclination);
            sendSensorData('humidity', row.humidity);
            sendSensorData('vibration', row.vibration);
        }
    });
}, 1000);