import React, { useRef, useState, useEffect } from 'react';
import { HiOutlineCloudUpload } from 'react-icons/hi';

interface ImagePickerProps {
    name?: string;
    onChange: (base64: string) => void;
    children?: React.ReactNode;
    value?: string | null;
}

const ImagePicker: React.FC<ImagePickerProps> = ({ name = 'image', onChange, children, value }) => {
    const imageRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        setImage(value || null);
    }, [value]);

    const handleImageClick = () => {
        imageRef.current?.click();
    };

    const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            makeBase64(file).then((base64) => {
                setImage(base64);
                onChange(base64);
            });
        }
    };

    const makeBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result as string);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {children}
            <input
                type="file"
                className="hidden"
                name={name}
                onChange={handleImage}
                accept="image/x-png,image/gif,image/jpeg, image/jpg, image/png"
                ref={imageRef}
            />

            <div onClick={handleImageClick} className="relative cursor-pointer group">
                {image ? (
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500 rotate-2 group-hover:rotate-0">
                        <img className="w-full h-full object-cover" src={image} alt={name} />
                        <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <HiOutlineCloudUpload className="w-10 h-10 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="w-32 h-32 bg-indigo-50 rounded-[2rem] flex flex-col items-center justify-center text-indigo-600 border-2 border-dashed border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                        <HiOutlineCloudUpload className="w-10 h-10 mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">Update</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImagePicker;
