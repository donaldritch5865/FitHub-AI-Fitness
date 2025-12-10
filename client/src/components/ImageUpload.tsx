import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

const ImageUpload = ({ onImageUpload, isProcessing }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <section id="upload-section" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Upload Your Photo
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Our AI will analyze your body type in seconds and provide personalized recommendations
        </p>

        <div className="p-8 max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl hover:border-purple-500/50 transition-all duration-300">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all duration-300 hover:scale-[1.02]",
              isDragActive
                ? "border-purple-400 bg-purple-500/10 shadow-inner"
                : "border-gray-600 hover:border-purple-500/50 hover:bg-purple-500/5",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <div className="space-y-6">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-medium"
                />
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2 text-purple-400">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg font-medium text-white">Analyzing your body type...</span>
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Click to upload a different image or wait for results
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center">
                  {isDragActive ? (
                    <ImageIcon className="h-8 w-8 text-white" />
                  ) : (
                    <Upload className="h-8 w-8 text-white" />
                  )}
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    {isDragActive ? "Drop your image here" : "Upload your photo"}
                  </p>
                  <p className="text-gray-400">
                    Drag & drop or click to select • JPEG, PNG, WebP • Max 10MB
                  </p>
                </div>
                
                <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors mt-4">
                  Choose File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageUpload;