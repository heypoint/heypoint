import { https, HttpsFunction, Response, runWith } from "firebase-functions";


// noinspection JSUnusedGlobalSymbols
export const endpoint: HttpsFunction = runWith(
  {
    enforceAppCheck: true,
  },
)
  .https
  .onRequest(
    (request: https.Request, response: Response<unknown>): void => response.send(
      {
        message: "hello world",
      },
    ).end() && void (0),
  );
