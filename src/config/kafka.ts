import { Kafka, Partitioners } from "kafkajs";
import dotenv from "dotenv";
import listenToTopics from "../kafka/consumer_listener";

dotenv.config();

const kafkaBroker=process.env.KAFKA_BROKER;
if (!kafkaBroker){
    throw new Error("Invalid Broker");
}
const kafka=new Kafka({
    clientId:"airport-management",
    brokers:[kafkaBroker],
});

const producer=kafka.producer({createPartitioner: Partitioners.LegacyPartitioner});
const consumer=kafka.consumer({groupId:"group-1"});

let isProducerConnected = false;
let isConsumerConnected = false;

export async function connectKafka() {
  try {
    await producer.connect();
    isProducerConnected = true;
    console.log("Producer connected");

    await consumer.connect();
    isConsumerConnected = true;
    console.log("Consumer connected");
    await listenToTopics();
    
  } catch (e) {
    console.error("Kafka connection error:", e);
    throw e;
  }
}

export async function disconnectKafka() {
  try {
    if (isProducerConnected) {
      await producer.disconnect();
      isProducerConnected = false;
      console.log("Producer disconnected");
    }

    if (isConsumerConnected) {
      await consumer.disconnect();
      isConsumerConnected = false;
      console.log("Consumer disconnected");
    }
  } catch (e) {
    console.error("Kafka disconnection error:", e);
  }
}

export { producer, consumer };