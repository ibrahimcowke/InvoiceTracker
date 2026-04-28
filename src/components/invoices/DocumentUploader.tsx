import { useState, useRef } from "react";
import { 
  Upload, 
  Camera, 
  X, 
  FileText, 
  CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
}

export function DocumentUploader({ onUpload }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onUpload(selectedFile);
      
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
      
      toast.success(`${selectedFile.name} attached successfully.`);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <Label className="font-black text-sm uppercase tracking-widest text-muted-foreground">Attach Invoice Document</Label>
      
      {!file ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Desktop/General Upload */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-twilight-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/50 cursor-pointer bg-muted/5 transition-all group"
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-xs text-foreground">Upload Document</p>
              <p className="text-[10px] text-muted-foreground mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </div>

          {/* Mobile Camera/Screenshot (Simulated with capture attribute) */}
          <div 
            onClick={() => cameraInputRef.current?.click()}
            className="border-2 border-dashed border-twilight-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 cursor-pointer bg-muted/5 transition-all group md:hidden lg:flex"
          >
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-center">
              <p className="font-bold text-xs text-foreground">Capture / Screenshot</p>
              <p className="text-[10px] text-muted-foreground mt-1">Mobile Camera Upload</p>
            </div>
            <input 
              type="file" 
              ref={cameraInputRef} 
              className="hidden" 
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="relative p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center gap-4 animate-in zoom-in-95 duration-300">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center overflow-hidden">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <FileText className="h-6 w-6 text-emerald-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-foreground">{file.name}</p>
            <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to save</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full text-rose-500 hover:bg-rose-500/10"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
