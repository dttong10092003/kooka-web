import { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface AvatarUploadProps {
    currentAvatar?: string;
    onUpload: (base64: string) => void;
    size?: 'sm' | 'md' | 'lg';
    editable?: boolean;
}

export default function AvatarUpload({
    currentAvatar,
    onUpload,
    size = 'md',
    editable = true
}: AvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Size mappings
    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const iconSizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6'
    };

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Handle file selection
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setPreview(base64);
            onUpload(base64);
        } catch (error) {
            console.error('Error converting file:', error);
            alert('Failed to process image');
        }
    };

    // Handle drag events
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please drop an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setPreview(base64);
            onUpload(base64);
        } catch (error) {
            console.error('Error converting file:', error);
            alert('Failed to process image');
        }
    };

    // Clear preview
    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Trigger file input
    const handleClick = () => {
        if (editable) {
            fileInputRef.current?.click();
        }
    };

    const displayAvatar = preview || currentAvatar;

    return (
        <div className="relative inline-block">
            <div
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                    ${sizeClasses[size]}
                    rounded-full
                    overflow-hidden
                    relative
                    ${editable ? 'cursor-pointer group' : ''}
                    ${isDragging ? 'ring-4 ring-orange-500 ring-opacity-50' : ''}
                    transition-all duration-200
                `}
            >
                {/* Avatar Image */}
                {displayAvatar ? (
                    <img
                        src={displayAvatar}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                        <Upload className={`${iconSizeClasses[size]} text-white`} />
                    </div>
                )}

                {/* Hover Overlay */}
                {editable && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                        <Camera className={`${iconSizeClasses[size]} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
                    </div>
                )}

                {/* Dragging Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-orange-500 bg-opacity-50 flex items-center justify-center">
                        <Upload className={`${iconSizeClasses[size]} text-white`} />
                    </div>
                )}
            </div>

            {/* Clear Button */}
            {preview && editable && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClear();
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    title="Remove"
                >
                    <X className="h-3 w-3" />
                </button>
            )}

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={!editable}
            />
        </div>
    );
}
