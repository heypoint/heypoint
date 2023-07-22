import { HttpsFunction, Request, Response, runWith } from "firebase-functions";
import { FunctionRequest, FunctionResponse }         from "@heypoint/types";


// noinspection JSUnusedGlobalSymbols
export const endpoint: HttpsFunction = runWith({
  enforceAppCheck: true,
})
  .https
  .onRequest((request: Request, response: Response<FunctionResponse>): void => response.send({
    message: request.body
  }).end() && void(0));
