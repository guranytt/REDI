"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      throw new Error("No file provided");
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "redi_uploads",
    });

    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
}
