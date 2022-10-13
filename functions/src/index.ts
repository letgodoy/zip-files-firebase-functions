import * as functions from "firebase-functions";
import { generateZip } from "./downloadFiles";

export const downloadFiles = functions.https.onRequest(
  async (request, response): Promise<any> => {
    // name: zips/arquivo.zip
    // arts: array string image link
    if (!request.body.arts || !request.body.name) {
      response.status(400).send("Envie a lista de imagens").end("Bad Request");
    } else {
      const url = await generateZip(request.body.name, request.body.arts);
      response.status(200).send(url).end();
    }
  }
);
