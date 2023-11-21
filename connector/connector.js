const { Kafka } = require('kafkajs');
const mqtt = require('mqtt');

const kafkaBootstrapServers = '172.20.0.4:9092';
const kafkaTopicFromMqtt = 'second.messages';
const kafkaTopicToMqtt = 'first.messages';
const mqttBroker = 'mqtt://test.mosquitto.org:1883';
const mqttTopicFromKafka = 'seu-topico-kafka-para-mqtt';
const mqttTopicToKafka = 'seu-topico-mqtt-para-kafka';

// Configuração do cliente Kafka
const kafka = new Kafka({
  clientId: 'KafkaMqttConnector',
  brokers: [kafkaBootstrapServers],
});

const consumerFromMqtt = kafka.consumer({ groupId: 'KafkaMqttGroupFromMqtt' });
const producerToMqtt = kafka.producer();

// Configuração do cliente MQTT
const mqttClient = mqtt.connect(mqttBroker);

// Conecta aos brokers Kafka e MQTT
const run = async () => {
  await consumerFromMqtt.connect();
  await producerToMqtt.connect();

  await consumerFromMqtt.subscribe({ topic: kafkaTopicFromMqtt, fromBeginning: true });
  console.log(`Consumindo mensagens do tópico Kafka (originadas do MQTT): ${kafkaTopicFromMqtt}`);

  mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    mqttClient.subscribe(mqttTopicFromKafka);
    console.log(`Consumindo mensagens do tópico MQTT (originadas do Kafka): ${mqttTopicFromKafka}`);
  });

  // Aguarda por mensagens do Kafka (originadas do MQTT) e as envia para o MQTT
  await consumerFromMqtt.run({
    eachMessage: async ({ message }) => {
      const payload = message.value.toString();
      console.log(`Mensagem recebida do Kafka (originada do MQTT): ${payload}`);

      // Envia a mensagem para o tópico MQTT
      mqttClient.publish(mqttTopicFromKafka, payload, { qos: 1 }, (err) => {
        if (err) {
          console.error('Erro ao publicar mensagem no MQTT:', err);
        } else {
          console.log(`Mensagem enviada para o MQTT (originada do Kafka): ${payload}`);
        }
      });
    },
  });

  mqttClient.on('message', (topic, message) => {
    const payload = message.toString();
    console.log(`Mensagem recebida do MQTT (originada do Kafka): ${payload}`);

    // Envia a mensagem para o tópico do Kafka
    producerToMqtt.send({
      topic: kafkaTopicToMqtt,
      messages: [{ value: payload }],
    });

    console.log(`Mensagem enviada para o Kafka (originada do MQTT): ${payload}`);
  });

};

run().catch(console.error);

