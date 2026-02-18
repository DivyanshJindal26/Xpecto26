import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket;

export const initGridFS = (connection) => {
  bucket = new GridFSBucket(connection.db, {
    bucketName: "paymentProofs",
  });
  console.log("GridFS initialized");
  return bucket;
};

export const getGridFSBucket = () => {
  if (!bucket) {
    throw new Error("GridFS not initialized");
  }
  return bucket;
};

export const uploadToGridFS = (buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
    });

    uploadStream.on("error", (error) => {
      reject(error);
    });

    uploadStream.on("finish", () => {
      // The 'finish' event may not provide the file document in all driver versions,
      // so use the uploadStream.id which holds the ObjectId of the stored file.
      resolve(uploadStream.id);
    });

    uploadStream.end(buffer);
  });
};

export const downloadFromGridFS = (fileId) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId),
    );

    downloadStream.on("data", (chunk) => {
      chunks.push(chunk);
    });

    downloadStream.on("error", (error) => {
      reject(error);
    });

    downloadStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

export const deleteFromGridFS = async (fileId) => {
  try {
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch (error) {
    console.error("Error deleting file from GridFS:", error);
    throw error;
  }
};
