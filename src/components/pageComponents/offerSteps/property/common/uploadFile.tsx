import { useState, useRef, useEffect } from "react";
import { X, File as FileIcon } from "lucide-react";
import { uploadImage } from '@/services/apiService';
import { toast } from "react-toastify";
import { selectPropertyData } from "@/slices/propertySlice";
import { useSelector } from "react-redux";
import { useCurrentPage } from "@/utils/routeUtils";
import { uploadFile } from "@/config/text.json";

interface DreamHomeFormProps {
    onSubmit: (data: { files: File[] }) => void;
    onSkip?: () => void; // Optional callback for skip action
    question?: any;
    text?: string
}

export function DreamHomeForm({ onSubmit, onSkip, question }: DreamHomeFormProps) {
    const [submitted, setSubmitted] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const [isUploading, setIsUploading] = useState(false); // Track if upload is in progress
    const fileInputRef = useRef<HTMLInputElement>(null);
    const animationRefs = useRef<{ [key: number]: number }>({}); // Store animation frame IDs

    const propertyInfo = useSelector(selectPropertyData);
    const currentPage = useCurrentPage();

    // Handle file drop - check both submitted and isUploading states
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (submitted || isLoading || isUploading) return; // Prevent drops when uploading or submitted
        e.preventDefault();
        // Only take the first file
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles([droppedFiles[0]]);  // Replace existing files with just the new one
            setUploadProgress({}); // Reset progress completely
            setIsUploading(true); // Set uploading state to true when a file is dropped
        }
    };

    // Handle file input change - check both submitted and isUploading states
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (submitted || isLoading || isUploading) return; // Prevent file changes when uploading or submitted
        if (e.target.files && e.target.files.length > 0) {
            // Only take the first file
            setFiles([e.target.files[0]]);  // Replace existing files with just the new one
            setUploadProgress({}); // Reset progress completely
            setIsUploading(true); // Set uploading state to true when a file is selected
        }
    };

    // Handle file removal - allow removing only if not in loading state
    const removeFile = (index: number) => {
        if (submitted || isLoading) return; // Prevent removal after submission or during API call
        
        // Cancel any ongoing animation for this file
        if (animationRefs.current[index]) {
            cancelAnimationFrame(animationRefs.current[index]);
            delete animationRefs.current[index];
        }
        
        // Remove the file
        setFiles([]);  // Clear all files instead of filtering
        
        // Completely reset progress state
        setUploadProgress({});
        
        // Reset uploading state to allow new uploads
        setSubmitted(false);
        setIsLoading(false);
        setIsUploading(false);
    };

    // Smooth upload progress animation - modified to handle file changes better
    useEffect(() => {
        if (submitted) return; // Stop animations if submitted
        
        // Clear any existing animations when files change
        Object.keys(animationRefs.current).forEach(key => {
            cancelAnimationFrame(animationRefs.current[Number(key)]);
            delete animationRefs.current[Number(key)];
        });
        
        // Start new animations for current files
        files.forEach((_, index) => {
            // Always start a new animation when files change
            const startTime = performance.now();
            const duration = 5000; // 5 seconds for smooth animation

            const animateProgress = (timestamp: number) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min((elapsed / duration) * 100, 100); // Linear progress

                setUploadProgress(prev => ({
                    ...prev,
                    [index]: progress,
                }));

                if (progress < 100) {
                    animationRefs.current[index] = requestAnimationFrame(animateProgress);
                } else {
                    delete animationRefs.current[index]; // Clean up when done
                    // Set uploading to false when progress reaches 100%
                    if (progress === 100) {
                        setIsUploading(false);
                    }
                }
            };

            // Start the animation
            animationRefs.current[index] = requestAnimationFrame(animateProgress);
        });

        // Cleanup on unmount
        return () => {
            Object.keys(animationRefs.current).forEach(key => {
                cancelAnimationFrame(animationRefs.current[Number(key)]);
            });
        };
    }, [files, submitted]); // Remove uploadProgress dependency to prevent loops

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitted || isLoading) return; // Prevent multiple submissions
        
        // Validation
        if (files.length === 0) {
            toast.error("Please upload a file");
            return;
        }
        
        try {
            setIsLoading(true);
            // Keep isUploading true during the actual upload to API
            setIsUploading(true);
            
            // Create FormData object
            const formData = new FormData();
        
            // formData.append("description", "na");
            // Append the file to FormData under "file" key
            if (files.length > 0) {
                formData.append("file", files[0]);
            }
            
            // Call API service
            if (!propertyInfo?.propertyId) {
                toast.error("Property ID is required");
                setSubmitted(false);
                setIsLoading(false);
                setIsUploading(false);
                setFiles([]);
                return;
            }

            // Send FormData directly (not as Record<string, string>)
            const apiResponse = await uploadImage(propertyInfo.propertyId, currentPage, formData);
            
            if(apiResponse?.code === 200) { 
                // Show success toast
                toast.success("File uploaded successfully!");
                setFiles([]);
                // Set submitted state
                setSubmitted(false);
                setIsLoading(false);
                setIsUploading(false);
                
                // Call the original onSubmit handler
                onSubmit({ files });
            } 
            else {
                toast.error((apiResponse as any)?.response?.message || "Upload failed. Please try again.");
            }
            
        } catch (error) {
            // Handle API error
            console.error("Upload failed:", error);
            toast.error("Upload failed. Please try again.");
        } finally {
            setIsLoading(false);
            setIsUploading(false); // Reset uploading state regardless of success/failure
        }
    };

    // Handle skip action
    const handleSkip = () => {
        if (submitted) return; // Prevent skip after submission
        setSubmitted(true); // Treat skip as a submission
        if (onSkip) {
            onSkip();
        } 
        else {
            onSubmit({ files: [] });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message */}
            {/* <p className="text-[#272727] text-base font-[Geologica] font-normal">
                Now you can type, upload images to describe your dream home.
            </p> */}

            {/* Upload Section */}
            <div className="space-y-1">
                <p className="text-[#272727] text-base font-[Geologica] font-normal">
                    Upload File
                </p>
                <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
                    {uploadFile?.fileType}
                </p>

                {/* Upload Box - Check isUploading state */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !submitted && !isLoading && !isUploading && fileInputRef.current?.click()}
                    className={`w-full p-6 border-2 border-dashed border-[#171717] rounded-md flex flex-col items-center justify-center ${
                        submitted || isLoading || isUploading  || files.length > 0
                            ? "cursor-not-allowed opacity-50 border-[#171717]" 
                            : "cursor-pointer hover:border-[#0036AB]"
                    }`}
                >
                    <div className="w-10 h-10 bg-transparent border border-black rounded-full flex items-center justify-center">
                        <FileIcon className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="mt-2 text-[#272727] text-base font-[Geologica] font-normal">
                        {isUploading ? "File upload in progress..." : "Click to upload or Drag & drop"}
                    </p>
                    <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
                        {uploadFile?.maxSize}
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpeg,.png,.webp"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={submitted || isLoading || isUploading}
                    />
                </div>

                {/* Uploaded File - now singular */}
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
                                            submitted || isLoading ? "cursor-not-allowed opacity-50" : ""
                                        }`}
                                        disabled={submitted || isLoading}
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

            {/* Buttons - also consider isUploading state */}
            <div className="flex space-x-4">
                {!question?.response && <>
                    <button
                        type="button"
                        onClick={handleSkip}
                        className={`cursor-pointer flex-1 py-2 bg-[#0036AB]/50 text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
                            submitted || isLoading || isUploading ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
                        }`}
                        disabled={submitted || isLoading || isUploading}
                    >
                        Skip
                    </button>
                </>}
                
                <button type="submit"
                    className={`cursor-pointer flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
                        submitted || isLoading || isUploading ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
                    }`}
                    disabled={submitted || isLoading || isUploading}
                >
                    {isLoading ? "Uploading..." : "Submit"}
                </button>
            </div>
        </form>
    );
}