import { onCall } from "firebase-functions/v2/https";


export const helloWorld: CallableFunction = onCall<void, string>(
  {
    enforceAppCheck: true,
  },
  (): string => "hello world",
);
