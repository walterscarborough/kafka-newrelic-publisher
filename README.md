# Kafka New Relic Publisher 🌇

## Setup
npm install

## Usage

### Reading Data From New Relic

```bash
curl 'localhost:3000/read-newrelic?newRelicApiKey=your-key-here&newRelicAppGuid=your-app-guid-here'
```

### Enqueueing Data Onto a Kafka Topic

```bash
curl localhost:3000/enqueue -X POST -d '{"broker": "localhost:9092", "topic": "test", "newRelicApiKey": "your-key-here", "newRelicAppGuid": "your-app-guid-here"}' -H 'Content-Type: application/json'
```

### Enqueueing Custom Data Onto a Kafka Topic
Note: the `data` value can be any valid JSON data.

```bash
curl localhost:3000/enqueue-custom-data -X POST -d '{"broker": "localhost:9092", "topic": "test", "data": "YOUR DATA HERE"}' -H 'Content-Type: application/json'
```

### Reading Data From a Kafka Topic
Note: this endpoint only needs to be called once to start logging messages from kafka.
Using it twice won't actually do anything.

```bash
curl 'localhost:3000/read-queue?broker=your-broker-here&topic=your-topic-here'
```
