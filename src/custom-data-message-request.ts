export interface CustomDataMessageRequest {
    body: {
        broker: string;
        topic: string;
        data: any;
    }
}
