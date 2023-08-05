import { FunctionResponse }                        from "@heypoint/types";
import { https, HttpsFunction, Response, runWith } from "firebase-functions";


// noinspection JSUnusedGlobalSymbols
export const endpoint: HttpsFunction = runWith(
  {
    enforceAppCheck: true,
  },
)
  .https
  .onRequest(
    (request: https.Request, response: Response<FunctionResponse>): void => response.send(
      {
        message: "hello world"
      },
    ).end() && void (0),
  );
