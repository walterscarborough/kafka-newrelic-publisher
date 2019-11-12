import express from "express";
import {getNewRelicData} from "./new-relic-service";
import {MessageRequest} from "./MessageRequest";
import {enqueue, readQueue} from "./kafka-service";

const app = express();
app.use(express.json());

app.get('/read-newrelic', async (req: MessageRequest, res) => {
    await getNewRelicData(req.body.newRelicApiKey, req.body.newRelicAppGuid);

    res.send('ok');
});

app.post('/enqueue', async (req: MessageRequest, res) => {
    const newRelicData = await getNewRelicData(req.body.newRelicApiKey, req.body.newRelicAppGuid);

    await enqueue(
        req.body.broker,
        req.body.topic,
        newRelicData
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
