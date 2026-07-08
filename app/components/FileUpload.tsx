"use client";

import { upload } from "@imagekit/next";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud } from "lucide-react";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        return false;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("Video size must be less than 100MB.");
        return false;
      }
    } else {
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!validTypes.includes(file.type)) {
        setError("Please upload JPG, PNG or WEBP.");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB.");
        return false;
      }
    }

    return true;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setUploading(true);
    setError(null);
    setSelectedFile(file);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const response = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
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
      console.error(err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
      accept:
        fileType === "video"
          ? {
              "video/*": [],
            }
          : {
              "image/*": [],
            },
    });

  return (
    <div className={`
border-2
border-dashed
rounded-xl
p-10
text-center
cursor-pointer
transition-all

bg-white
dark:bg-slate-800

${
  isDragActive
    ? "border-indigo-500 bg-indigo-50 dark:bg-slate-700"
    : "border-gray-300 dark:border-slate-600 hover:border-indigo-500"
}
`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300 text-center
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />

        <UploadCloud className="
bg-white
dark:bg-slate-800

rounded-2xl

shadow-xl

text-black
dark:text-white
" />

        <h3 className="mt-4 text-lg font-semibold">
          {isDragActive
            ? "Drop your file here..."
            : `Drag & Drop your ${
                fileType === "video" ? "video" : "image"
              }`}
        </h3>

        <p className="text-gray-500 mt-2">
          or click to browse
        </p>
      </div>

      {selectedFile && (
        <div className="rounded-lg border p-3 bg-gray-100 dark:bg-slate-800">
          <p className="font-medium">
            📁 {selectedFile.name}
          </p>

          <p className="text-sm text-gray-500">
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Uploading...</span>
        </div>
      )}

      {error && (
        <p className="text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}