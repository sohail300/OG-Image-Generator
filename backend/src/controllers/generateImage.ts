import { Request, Response } from "express";
import { postSchema } from "../types/postTypes";
import { v2 as cloudinary } from "cloudinary";

export async function generateImage(req: Request, res: Response) {
  try {
    const file = req.file;
    const parsedInput = postSchema.safeParse({ ...req.body, photo: file });

    if (parsedInput.success === false) {
      return res.status(400).json({ msg: parsedInput.error.issues[0].message });
    }

    const { title, description, photo } = parsedInput.data;
    console.log(title);
    console.log(photo);
    let publicId = "dq1dqtyjtn7qehcou8kt";

    if (photo) {
      const b64 = Buffer.from(photo.buffer).toString("base64");
      let dataURI = "data:" + photo.mimetype + ";base64," + b64;
      console.log("dataURI");

      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });
      console.log(cldRes);

      publicId = cldRes.public_id;
    }

    const ogImageUrl = cloudinary.url(publicId, {
      transformation: [
        { width: 1200, height: 630, crop: "fill" }, // Set a fixed size for OG images
        {
          overlay: "ptuybbjilbtgdajjhezn", // Your icon overlay
          gravity: "north_west",
          x: 30,
          y: 30,
          width: 100, // Fixed width for the icon
          crop: "scale",
        },
        {
          overlay: {
            font_family: "Arial",
            font_size: 60,
            font_weight: "bold",
            text: title,
          },
          color: "#ffffff",
          gravity: "south_east",
          x: 30,
          y: 80,
          crop: "fit",
          background: "#00CC00",
        },
        {
          overlay: {
            font_family: "Arial",
            font_size: 30,
            font_weight: "regular",
            text: description.slice(0, 75) + "...",
          },
          color: "#ffffff",
          gravity: "south_east",
          x: 30,
          y: 20,
          crop: "fit",
          background: "#000000",
        },
      ],
    });
    console.log(ogImageUrl);

    return res.status(200).json({ ogImageUrl });
    //   return res.status(200).json({ msg: " Done!" });
  } catch (error) {
    console.log(error);
  }
}
