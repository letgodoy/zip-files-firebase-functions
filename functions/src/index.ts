import * as functions from "firebase-functions";
import { generateZip } from "./downloadFiles";
import * as cors from "cors";
// const corsHandler = cors();

export const downloadFiles = functions.https.onRequest(
  async (req, resp): Promise<any> => {
    return cors()(req, resp, async () => {
      const { arts, name } = req.body;
      // name: zips/arquivo.zip
      // arts: array string image link
      resp.setHeader("Access-Control-Allow-Origin", "*");

      if (!arts || !name) {
        return resp
          .status(400)
          .send("Envie a lista de imagens")
          .end("Bad Request")
          .end();
      } else {
        const url = await generateZip(name, arts);

        return resp
          .status(200)
          .send(
            JSON.stringify({
              url: url,
            })
          )
          .end();
      }
    });
  }
);
