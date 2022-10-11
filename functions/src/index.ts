import * as functions from "firebase-functions";
import * as JSZip from "jszip";
import { initializeApp } from "firebase/app";
import {
  getBytes,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const downloadFile = functions.https.onRequest(
  async (_req, response): Promise<any> => {
    const urls2 = [
      "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2F6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg",
      "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Ff4a14abf-9a81-41dc-8d96-158d36cf0880.jpeg",
      "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Fcd668304-521a-4008-adcf-2239148b3bed.jpeg",
    ];

    const jszip = new JSZip();

    await Promise.all(
      urls2.map(async (item, i) => {
        const httpReference = ref(storage, item);
        const stream = getBytes(httpReference);

        return await stream.then((res) => {
          jszip.file("imagem" + i + ".jpeg", res, { base64: true });
          return res;
        });
      })
    ).then(() =>
      jszip
        .generateInternalStream({ type: "uint8array" })
        .accumulate()
        .then((data) => {
          const storageRef = ref(storage, "zips/arquivo5.zip");

          const metadata = {
            contentType: "application/zip",
          };

          return uploadBytesResumable(storageRef, data, metadata).then(
            (res: any) => {
              response.status(200).end();
              return res;
            }
          );
        })
        .catch((err) => err)
    );
  }
);
