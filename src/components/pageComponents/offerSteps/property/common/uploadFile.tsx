"use client";

import { useState, useRef, useEffect } from "react";
import { X, File as FileIcon } from "lucide-react";

interface DreamHomeFormProps {
  onSubmit: (data: { description: string; files: File[] }) => void;
  onSkip?: () => void; // Optional callback for skip action
  text?: string;
}

export function DreamHomeForm({ onSubmit, onSkip, text }: DreamHomeFormProps) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false); // Track form submission state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRefs = useRef<{ [key: number]: number }>({}); // Store animation frame IDs

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (submitted) return; // Prevent drops after submission
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (submitted) return; // Prevent file changes after submission
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  // Handle file removal
  const removeFile = (index: number) => {
    if (submitted) return; // Prevent removal after submission
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
    if (animationRefs.current[index]) {
      cancelAnimationFrame(animationRefs.current[index]);
      delete animationRefs.current[index];
    }
  };

  // Smooth upload progress animation
  useEffect(() => {
    if (submitted) return; // Stop animations if submitted
    files.forEach((_, index) => {
      if (!(index in uploadProgress)) {
        const startTime = performance.now();
        const duration = 5000; // 5 seconds for smooth animation

        const animateProgress = (timestamp: number) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min((elapsed / duration) * 100, 100); // Linear progress

          setUploadProgress((prev) => ({
            ...prev,
            [index]: progress,
          }));

          if (progress < 100) {
            animationRefs.current[index] = requestAnimationFrame(animateProgress);
          } else {
            delete animationRefs.current[index]; // Clean up when done
          }
        };

        animationRefs.current[index] = requestAnimationFrame(animateProgress);

        // Cleanup on unmount or file removal
        return () => {
          if (animationRefs.current[index]) {
            cancelAnimationFrame(animationRefs.current[index]);
          }
        };
      }
    });
  }, [files, uploadProgress, submitted]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return; // Prevent multiple submissions
    setSubmitted(true);
    onSubmit({ description, files });
  };

  // Handle skip action
  const handleSkip = () => {
    if (submitted) return; // Prevent skip after submission
    setSubmitted(true); // Treat skip as a submission
    if (onSkip) {
      onSkip();
    } else {
      onSubmit({ description: "", files: [] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message */}
      <p className="text-[#272727] text-base font-[Geologica] font-normal">
        {text}
      </p>

      {/* Text Area */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your dream home here…"
        className={`w-full h-24 p-2 rounded-[12px] bg-white text-[#272727] placeholder:text-sm font-[Geologica] font-normal placeholder-[#272727] focus:outline-none focus:ring-2 focus:ring-[#0036AB] ${
          submitted ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={submitted}
      />

      {/* Upload Section */}
      <div className="space-y-1">
        <p className="text-[#272727] text-base font-[Geologica] font-normal">
          Upload Files
        </p>
        <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
          JPEG, PNG, MP4, MOV.
        </p>

        {/* Upload Box */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !submitted && fileInputRef.current?.click()}
          className={`w-full p-6 border-2 border-dashed border-[#171717] rounded-md flex flex-col items-center justify-center ${
            submitted ? "cursor-not-allowed opacity-50 border-[#171717]" : "cursor-pointer hover:border-[#0036AB]"
          }`}
        >
          <div className="w-10 h-10 bg-transparent border border-black rounded-full flex items-center justify-center">
            <FileIcon className="w-5 h-5 text-gray-500" />
          </div>
          <p className="mt-2 text-[#272727] text-base font-[Geologica] font-normal">
            Click to upload or Drag & drop
          </p>
          <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
            Maximum FILE 2.1 GB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpeg,.png,.mp4,.mov"
            onChange={handleFileChange}
            className="hidden"
            disabled={submitted}
          />
        </div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mt-4 space-y-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative p-4 rounded-md bg-black/5 flex flex-col"
              >
                {/* File Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-white px-2 py-1.5 rounded-sm border-2 border-[#CACACA]">
                      <FileIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[#383838] text-xs font-[Geologica] font-normal">
                        {file.name}
                      </p>
                      <p className="text-[#8A8A8A] text-xs font-[Geologica] font-normal">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className={`absolute top-2 right-2 text-black hover:text-[#1354B6] ${
                      submitted ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={submitted}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar with Percentage */}
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1354B6] h-2 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${uploadProgress[index] || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-[#3D3D3D] text-xs font-[Geologica] font-normal">
                    {Math.round(uploadProgress[index] || 0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleSkip}
          className={`flex-1 py-2 bg-[#0036AB]/50 text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
            submitted ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
          }`}
          disabled={submitted}
        >
          Skip
        </button>
        <button
          type="submit"
          className={`flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
            submitted ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
          }`}
          disabled={submitted}
        >
          Submit
        </button>
      </div>
    </form>
  );
}