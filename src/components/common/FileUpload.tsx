import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

interface FileUploadProps {
  label: string;
  acceptedFileTypes?: string;
  onChange: (file: File | null) => void;
  tooltip?: string;
  maxSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  acceptedFileTypes = '.pdf,.jpg,.jpeg,.png',
  onChange,
  tooltip,
  maxSize = 10, // Default max size is 10MB
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    validateAndSetFile(selectedFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateAndSetFile(event.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) {
      setError(null);
      setFile(null);
      onChange(null);
      return;
    }

    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    const acceptedTypes = acceptedFileTypes.split(',').map(type => 
      type.trim().replace('.', '').toLowerCase()
    );
    
    if (fileExtension && !acceptedTypes.includes(fileExtension)) {
      setError(`File type not supported. Accepted types: ${acceptedFileTypes}`);
      return;
    }

    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit.`);
      return;
    }

    setError(null);
    setFile(selectedFile);
    onChange(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    onChange(null);
  };

  const preventDefault = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="mb-4">
      <label className="form-label mb-2">{label}</label>
      
      {!file ? (
        <motion.div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-wis-gold-400 bg-wis-gold-50' : 'border-wis-silver-300 hover:border-wis-gold-400'
          }`}
          whileHover={{ scale: 1.01 }}
          onDragEnter={(e) => { preventDefault(e); setIsDragging(true); }}
          onDragOver={(e) => { preventDefault(e); setIsDragging(true); }}
          onDragLeave={(e) => { preventDefault(e); setIsDragging(false); }}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
        >
          <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-wis-silver-400" />
          <p className="mt-2 text-sm text-wis-silver-700">
            Drag and drop your file here, or <span className="text-wis-gold-600 font-semibold">browse</span>
          </p>
          <p className="mt-1 text-xs text-wis-silver-500">
            Accepted file types: {acceptedFileTypes} (Max size: {maxSize}MB)
          </p>
          
          {tooltip && (
            <p className="mt-2 text-xs text-wis-silver-600 italic">
              {tooltip}
            </p>
          )}
          
          <input
            id={`file-upload-${label}`}
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
        </motion.div>
      ) : (
        <motion.div
          className="bg-wis-silver-50 border border-wis-silver-200 rounded-lg p-4 flex justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <DocumentIcon className="h-8 w-8 text-wis-gold-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-wis-silver-800 truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-wis-silver-500">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <button
              type="button"
              onClick={removeFile}
              className="text-wis-silver-600 hover:text-red-500 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
      
      {error && (
        <motion.p 
          className="mt-2 text-sm text-red-500" 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FileUpload; 