const mqtt = require('mqtt');
const { Kafka } = require('kafkajs');

const mqttBroker = 'mqtt://test.mosquitto.org:1883';
const mqttTopic = 'ditto-tutorial/my.test:octopus';
const kafkaBootstrapServers = '172.20.0.4:9092';
const kafkaTopic = 'first.messages';

// Configuração do cliente MQTT
const mqttClient = mqtt.connect(mqttBroker);

// Configuração do cliente Kafka
const kafka = new Kafka({
  clientId: 'MqttToKafkaConnector',
  brokers: [kafkaBootstrapServers],
});

const producer = kafka.producer();

// Lida com mensagens recebidas do MQTT e as envia para o Kafka
mqttClient.on('connect', () => {
  console.log('Conectado ao broker MQTT');

  mqttClient.subscribe(mqttTopic);
});

mqttClient.on('message', (topic, message) => {
  const payload = message.toString();
  console.log(`Mensagem recebida do MQTT: ${payload}`);

  // Envia a mensagem para o tópico do Kafka
  producer.send({
    topic: kafkaTopic,
    messages: [{ value: payload }],
  });
});

// Conecta ao broker Kafka e inicializa o produtor
const run = async () => {
  await producer.connect();
  console.log('Conectado ao broker Kafka');

  // Aguarda por mensagens indefinidamente
  console.log('Aguardando mensagens...');
};

run().catch(console.error);
