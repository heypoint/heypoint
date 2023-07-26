import { https, HttpsFunction, Response, runWith } from "firebase-functions";
import { FunctionResponse }                        from "@heypoint/types";


// noinspection JSUnusedGlobalSymbols
export const endpoint: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onRequest((request: https.Request, response: Response<FunctionResponse>): void => response.send({
    message: "hello world"
  }).end() && void(0));
