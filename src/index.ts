import express from "express";
import {getNewRelicData} from "./new-relic-service";
import {MessageRequest} from "./message-request";
import {enqueue, readQueue} from "./kafka-service";
import {CustomDataMessageRequest} from "./custom-data-message-request";
import {ReadNewRelicRequest} from "./read-new-relic-request";
import * as zipkin from "zipkin";
import {BatchRecorder, Tracer} from "zipkin";
import CLSContext from "zipkin-context-cls";
import {HttpLogger} from 'zipkin-transport-http';
import {expressMiddleware as zipkinMiddleware} from "zipkin-instrumentation-express";
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

const app = express();
app.use(express.json());
app.use(zipkinMiddleware({tracer}));

app.get('/read-newrelic', async (req: ReadNewRelicRequest, res) => {
    const data = await getNewRelicData(req.query.newRelicApiKey, req.query.newRelicAppGuid);

    res.json(data);
});

app.post('/enqueue', async (req: MessageRequest, res) => {
    const newRelicData = await getNewRelicData(req.body.newRelicApiKey, req.body.newRelicAppGuid);

    await enqueue(
        req.body.broker,
        req.body.topic,
        newRelicData
    );

    res.json(newRelicData);
});

app.post('/enqueue-custom-data', async (req: CustomDataMessageRequest, res) => {
    await enqueue(
        req.body.broker,
        req.body.topic,
        req.body.data,
    );

    res.send("ok");
});

app.get('/read-queue', async (req, res) => {
    await readQueue(
        req.query.broker,
        req.query.topic
    );

    res.send("ok");
});

const port = (process.env.PORT || 3000);
app.listen(port, () => console.log(`Kafka-NewRelic-Publisher app listening on port ${port}!`));
