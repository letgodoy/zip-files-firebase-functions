import archiver = require("archiver");
// import admin = require("firebase-admin");
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { initializeApp } from "firebase-admin/app";
// import { getStorage } from "firebase-admin/storage";
// import * as unzipper from "unzipper";
// import { v4 as uuidv4 } from 'uuid';
import * as JSZip from "jszip";
import { saveAs } from "file-saver";
var XMLHttpRequest = require('xhr2');
import { initializeApp } from "firebase/app";
import { getStorage, getStream, ref } from "firebase/storage";
// var fs = require('fs');
// const gzip = require('zlib').createGzip();

// import fetch from "cross-fetch";

// import { connectAuthEmulator, getAuth } from "firebase/auth";
// import {
// //   getStorage,
// //   listAll,
//   ref,
// //   getDownloadURL,
// //   getMetadata,
// } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

var serviceAccount = require("../../starbucks-119c1-firebase-adminsdk-b780s-406a672a16.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });

  const urls = [
    "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2F6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg?alt=media&token=7b03acf0-ddee-4e0d-b463-aef6c4195cc2",
    "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Ff4a14abf-9a81-41dc-8d96-158d36cf0880.jpeg?alt=media&token=d41d4872-f070-4380-b4e4-d05d9adedc14",
    "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Fcd668304-521a-4008-adcf-2239148b3bed.jpeg?alt=media&token=bf49b951-c26e-47cf-ada6-355f09a23972",
  ];
  //   const urls2 = [
  //     "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2F6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg",
  //     "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Ff4a14abf-9a81-41dc-8d96-158d36cf0880.jpeg",
  //     "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Fcd668304-521a-4008-adcf-2239148b3bed.jpeg",
  //   ];

  const zip = saveZip("my_project_files_to_download.zip", urls);

  response.send(zip);
});

// export const createZip = functions.https.onCall(async (art) => {

//     console.log(art)
//     const storage = admin.storage();
//     const bucket = storage.bucket('bucket-name');

//     // generate random name for a file
//     const filePath = uuidv4();
//     const file = bucket.file(filePath);

//     const outputStreamBuffer = file.createWriteStream({
//       gzip: true,
//       contentType: 'application/zip',
//     });

//     const archive = archiver('zip', {
//       gzip: true,
//       zlib: { level: 9 },
//     });

//     archive.on('error', (err) => {
//       throw err;
//     });

//     archive.pipe(outputStreamBuffer);

//     // use firestore, request data etc. to get file names and their full path in storage
//     // file path can not start with '/'
//     const userFilePath = 'user-file-path';
//     const userFileName = 'user-file-name';

//     const userFile = await bucket.file(userFilePath).download();
//     archive.append(userFile[0], {
//       name: userFileName, // if you want to have directory structure inside zip file, add prefix to name -> /folder/ + userFileName
//     });

//     archive.on('finish', async () => {
//       console.log('uploaded zip', filePath);

//       // get url to download zip file
//       await bucket
//         .file(filePath)
//         .getSignedUrl({ expires: '03-09-2491', action: 'read' })
//         .then((signedUrls) => console.log(signedUrls[0]));
//     });

//     await archive.finalize();
//   });

const saveZip = (filename: string | undefined, urls: any[]) => {
  if (!urls) return;

  const zip = new JSZip();
  const folder = zip.folder("files"); // folder name where all files will be placed in

  urls.forEach((url) => {
    // const blobPromise = fetch(url).then((r: { status: number; blob: () => any; statusText: string | undefined; }) => {
    //   console.log(r);

    //   if (r.status === 200) {

    //     const xhr = new XMLHttpRequest();
    //     xhr.responseType = "blob";
    //     xhr.onload = (event) => {
    //       const blob = xhr.response;
    //       console.log(blob);
    //       console.log(event);
    //     };
    //     xhr.open("GET", url);
    //     xhr.send();

    //     return r.blob();
    //   }
    //   return Promise.reject(new Error(r.statusText));
    // });

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "blob:http%3A//your.blob.url.here", true);
    xhr.responseType = "blob";
    xhr.onload = function (e: any) {
        console.log(e)
      if (this.status == 200) {
        var myBlob = this.response;
        // myBlob is now the blob that the object URL pointed to.
        const name = url.substring(url.lastIndexOf("/") + 1);
        console.log(name)
        console.log(myBlob)
        folder?.file(name, myBlob);
      }
    };
    // xhr.send();
  });

  const blob = zip
    .generateAsync({ type: "blob" })
    .then((blob) => saveAs(blob, filename));

  return blob;
};

export const downloadFile = functions.https.onRequest(async (_req, res):Promise<void | Promise<void> | any> => {
  // const bucket = admin.storage().bucket('images');   
  // console.log(https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2F6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg)                // initialize storage as admin
  // const stream = bucket.file("6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg").createReadStream();    // create stream of the file in bucket
  
  // const zip = new JSZip();
  // const folder = zip.folder("files");

    //   const urls2 = [
    //   "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2F6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg",
    //   "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Ff4a14abf-9a81-41dc-8d96-158d36cf0880.jpeg",
    //   "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2Fcd668304-521a-4008-adcf-2239148b3bed.jpeg",
    // ];


// const listStream =urls2.map(async item => {
//   const httpsReference = ref(storage, item);
//   const stream2 = getStream(httpsReference)
  
//   // pipe stream on 'end' event to the response
//   // return stream2
//   //   .on('end', (data: any) => {})
//   //   .pipe(res);

//   return stream2.pipe(res).on('end', (data: any) => {
//     console.log(data)
//     folder?.file("nome_da_img.jpeg", data);
//   });
// })

const httpsReference = ref(storage, "https://firebasestorage.googleapis.com/v0/b/starbucks-119c1.appspot.com/o/images%2F6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg");
const stream2 = getStream(httpsReference)

const file = stream2.pipe(res).on('end', (data: any) => {})

const storageAdmin = admin.storage();
const bucket = storageAdmin.bucket('zips');

// // generate random name for a file
// const filePath = uuidv4();
const fileCriador = bucket.file("teste.zip");

// const storageRef = ref(storage, "zips/teste1.zip");
// const uploadTask = uploadBytesResumable(storageRef, file, metadata);

const outputStreamBuffer = fileCriador.createWriteStream({
  gzip: true,
  contentType: 'application/zip',
});

const archive = archiver('zip', {
  gzip: true,
  zlib: { level: 9 },
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(outputStreamBuffer);

const filePath = "images/6b3ec2ed-3f9b-4969-8fdc-d1d12cdf4632.jpeg"

const userFile = await bucket.file(filePath).download();

archive.append(userFile[0], {
  name: "filne_name", // if you want to have directory structure inside zip file, add prefix to name -> /folder/ + userFileName
});

archive.on('finish', async () => {
  console.log('uploaded zip', filePath);

  // get url to download zip file
  await bucket
    .file(filePath)
    .getSignedUrl({ expires: '03-09-2491', action: 'read' })
    .then((signedUrls) => console.log(signedUrls[0]));
});

await archive.finalize();


//   const blob = zip
//   .generateNodeStream({ type:'nodebuffer', streamFiles: true })
//   .pipe(fs.createWriteStream('out.zip'))
//   .on('end', (res: any) => {
//     console.log(res)
//     // saveAs(res, "nome_do_zip.zip")
//     console.log("out.zip written.");
//     // return res

//   })
//   // .then((blob) => saveAs(blob, "nome_do_zip.zip"));

// return saveAs(blob, "nome_do_zip.zip")

    
});