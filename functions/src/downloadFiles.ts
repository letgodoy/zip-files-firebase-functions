import * as JSZip from "jszip";
import {
  getBytes,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "./firebase";

export const generateZip = async (name: string, imgList: Array<string>) => {
  const jszip = new JSZip();

  const url = await Promise.all(
    imgList.map(async (item, i) => {
      const httpReference = ref(storage, item);
      const stream = getBytes(httpReference);

      return await stream.then((res) => {
        jszip.file(httpReference.name, res, { base64: true });
        return res;
      });
    })
  )
    .then(() =>jszip.generateInternalStream({ type: "uint8array" }).accumulate())
    .then((data): any => {
      const storageRef = ref(storage, name);

      const metadata = {
        contentType: "application/zip",
      };

      return uploadBytesResumable(storageRef, data, metadata);
    })
    .then(async (res: any) => await getDownloadURL(res.ref))
    .catch((err) => err);

    return url
};
