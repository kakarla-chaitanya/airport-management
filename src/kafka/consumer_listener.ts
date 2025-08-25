import { KafkaMessage } from "kafkajs";
import { consumer } from "../config/kafka";
import { io } from "../config/socket";

export default async function listenToTopics() {
    await consumer.subscribe({topic:"auth"});
    await consumer.subscribe({topic:"flight"});
    await consumer.subscribe({topic:"baggage"});
    await consumer.subscribe({topic:"ops"});

    await consumer.run({
        eachMessage:async ({topic,message})=>{
            if (topic==="auth"){
                handleAuthEvents(message);
            }else if(topic==="flight"){
                handleFlightEvents(message);
            }
            else if(topic==="baggage"){
                handleBaggageEvents(message);
            }else if (topic==="ops"){
                handleOpsEvents(message);
            }
        }
    });
}

async function handleAuthEvents(message:KafkaMessage) {
    let value=message.value?.toString();
    if (!value){
        return ;
    }
    let data=JSON.parse(value);
    if (data.type==="register"){
        io.emit("auth-event",`New ${data.role} is added.`);
    }else if (data.type==="register-user"){
        io.emit('auth-event',`New user - ${data.name} registered`);
    }
}

async function handleFlightEvents(message:KafkaMessage) {
    let value=message.value?.toString();
    if (!value){
        return ;
    }
    let data=JSON.parse(value);
    // console.log("flight event",data);
    if (data.type==="created"){
        io.emit("flight-event",`New Flight ${data.flightNo} is added.`);
    }else if (data.type==="updated"){
        io.emit('flight-event',`Flight ${data._doc.flightNo} updated`);
    }
    else if (data.type==="deleted"){
        io.emit("flight-event",`Flight ${data._doc.flightNo} deleted`);
    }
}

async function handleBaggageEvents(message:KafkaMessage) {
    let value=message.value?.toString();
    if (!value){
        return ;
    }
    let data=JSON.parse(value);
    if (data.type==="created"){
        io.emit("baggage-event",`New Baggage ${data.tagId} is added.`);
    }else if (data.type==="updated"){
        io.emit('baggage-event',`Baggage ${data._doc.tagId} updated`);
    }
    else if (data.type==="deleted"){
        io.emit("baggage-event",`Baggage ${data._doc.tagId} deleted`);
    }
}

async function handleOpsEvents(message:KafkaMessage) {
    let value=message.value?.toString();
    if (!value){
        return ;
    }
    let data=JSON.parse(value);
    if (data.type==="delay-flight"){
        io.emit("ops-event",`Flight ${data._doc.flightNo} is delayed.\nDue to ${data.message}`);
    }
}