import { onCall } from "firebase-functions/v2/https";


// noinspection JSUnusedGlobalSymbols
export const helloWorld: CallableFunction = onCall<void, string>(
  {
    enforceAppCheck: true,
  },
  (): string => "hello world",
);
