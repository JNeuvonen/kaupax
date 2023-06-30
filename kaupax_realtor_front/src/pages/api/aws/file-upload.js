import fileMiddleware from "@/server/middleware/file-handler";
import authMiddleware from "@/server/middleware/auth";
import nextConnect from "next-connect";
import AWS from "aws-sdk";
import fs from "fs";

const handler = nextConnect();
handler.use(authMiddleware);
handler.use(fileMiddleware);

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS,
    secretAccessKey: process.env.AWS_S3_PRIVATE,
  },
});

handler.post(async (req, res) => {
  try {
    const file = req.files.file[0];
    const imagePath = file.path;
    const blob = fs.readFileSync(imagePath);
    const { usersEmail } = req.query;

    const uploadedImage = await s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: usersEmail + "/" + file.originalFilename,
        Body: blob,
        ContentType: "image/png",
      })
      .promise();

    res.status(200).send({ message: uploadedImage.Location });
  } catch (err) {
    res.status(400).send({ message: err });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
