import axios from "axios";

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

    const response = await axios({
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
