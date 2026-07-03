"use client";

import { useState } from "react";
import { uploadImageAction } from "@/app/actions/uploadImage";
import { ImagePlus, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
  label?: string;
}

export default function ImageUpload({ onUploadSuccess, defaultImage, label = "Upload Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Show preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        onUploadSuccess(result.url);
      } else {
        setError(result.error || "Upload failed");
        setPreviewUrl(defaultImage || null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setPreviewUrl(defaultImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-bold text-gray-700">{label}</label>
      
      {error && <p className="text-xs font-bold text-red-500">{error}</p>}
      
      <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition min-h-[160px] overflow-hidden group">
        
        {previewUrl ? (
          <>
            <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-900 font-bold px-4 py-2 rounded-xl text-sm shadow-sm hover:bg-gray-100">
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
              </label>
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-[#f46919] animate-spin" />
              </div>
            )}
          </>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer text-gray-500 hover:text-gray-900">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-[#f46919] animate-spin mb-2" />
            ) : (
              <ImagePlus className="w-8 h-8 mb-2 text-gray-400 group-hover:text-[#f46919] transition" />
            )}
            <span className="text-sm font-bold">{isUploading ? "Uploading..." : "Click to browse"}</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </label>
        )}
      </div>
    </div>
  );
}
