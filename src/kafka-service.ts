import {Kafka} from "kafkajs";

export async function enqueue(broker: string, topic: string, newRelicData: object) {
    const kafka = new Kafka({
        brokers: [broker]
    });

    const producer = kafka.producer();

    await producer.connect();
    await producer.send({
        topic: topic,
        messages: [
            {value: JSON.stringify(newRelicData)},
        ],
    });
}

export async function readQueue(broker: string, topic: string) {
    const kafka = new Kafka({
        brokers: [broker]
    });

    const consumer = kafka.consumer({groupId: 'test-group'});
    await consumer.connect();
    await consumer.subscribe({topic: topic, fromBeginning: true});
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
        },
    });
}
