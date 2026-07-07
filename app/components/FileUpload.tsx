"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  onSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

export default function FileUpload({
  onSuccess,
  onProgress,
  fileType = "image",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file");
        return false;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB");
        return false;
      }
    } else {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!validTypes.includes(file.type)) {
        setError("Please upload JPG, PNG or WEBP");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return false;
      }
    }

    return true;
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const response = await upload({
        file,
        fileName: file.name,
        publicKey:
          process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          
        token: auth.token,
        
        signature: auth.signature,
        expire: auth.expire,
        folder: fileType === "video" ? "/videos" : "/images",
        onProgress: (event) => {
          if (!onProgress) return;

          const progress = Math.round(
            (event.loaded / event.total) * 100
          );

          onProgress(progress);
        },
      });

      onSuccess(response);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleUpload}
        className="file-input file-input-bordered w-full"
      />

      {uploading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}