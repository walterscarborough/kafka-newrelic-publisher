import wrapAxios from "zipkin-instrumentation-axiosjs";
import axios from "axios";
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

const zipkinAxios = wrapAxios(
    axios,
    {
        tracer,
    }
);



export async function getNewRelicData(newRelicApiKey: string, newRelicAppGuid: string): Promise<any> {
    const query = {
        "query": `{
          actor {
            entities(guids: "${newRelicAppGuid}") {
              name
              nrdbQuery(nrql: "SELECT appName, duration FROM Transaction LIMIT 100") {
                results
              }
            }
          }
        }
        `,
        "variables": null
    };

    const response = await zipkinAxios({
        url: 'https://api.newrelic.com/graphql',
        data: JSON.stringify(query),
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'API-Key': newRelicApiKey,
        }
    }).catch((error) => console.log(`axios error: ${error}`));

    // @ts-ignore
    const parsedResponseData = response.data.data.actor.entities[0];

    return parsedResponseData;
}
