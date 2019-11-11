# Kafka New Relic Publisher 🌇

## Setup
npm install

## Usage

### Reading Data From New Relic

```bash
 curl localhost:3000/enqueue -X POST -d '{"newRelicApiKey": "your-key-here", "newRelicAppGuid": "your-app-guid-here"}' -H 'Content-Type: application/json'
```

### Enqueueing Data Onto a Kafka Topic

```bash
 curl localhost:3000/enqueue -X POST -d '{"broker": "localhost:9092", "topic": "test", "newRelicApiKey": "your-key-here", "newRelicAppGuid": "your-app-guid-here"}' -H 'Content-Type: application/json'
```

### Reading Data From a Kafka Topic

```bash
 curl localhost:3000/enqueue?broker=your-broker-here&topic=your-topic-here
```
