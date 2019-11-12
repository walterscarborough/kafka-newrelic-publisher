export interface MessageRequest {
    body: {
        broker: string;
        newRelicApiKey: string;
        newRelicAppGuid: string;
        topic: string;
    }
}
