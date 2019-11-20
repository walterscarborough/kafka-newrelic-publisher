import {Kafka} from "kafkajs";
import wrapKafkaJs from "zipkin-instrumentation-kafkajs";
import * as zipkin from "zipkin";
import {BatchRecorder, Tracer} from "zipkin";
import {HttpLogger} from "zipkin-transport-http";
import CLSContext from "zipkin-context-cls";
import JSON_V2 = zipkin.jsonEncoder.JSON_V2;

const tracer = new Tracer({
    ctxImpl: new CLSContext('zipkin'),
    recorder: new BatchRecorder({
        logger: new HttpLogger({
            endpoint: 'http://localhost:9411/api/v2/spans',
            jsonEncoder: JSON_V2
        })
    }),
    localServiceName: 'kafka-newrelic-publisher'
});

export async function enqueue(broker: string, topic: string, newRelicData: object) {
    const kafka = wrapKafkaJs(
        new Kafka({
            brokers: [broker]
        }),
        {
            tracer
        }
    );

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
    const kafka = wrapKafkaJs(
        new Kafka({
            brokers: [broker]
        }),
        {
            tracer
        }
    );

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
