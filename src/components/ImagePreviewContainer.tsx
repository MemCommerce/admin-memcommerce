import type { TempImagesPreviewProps } from "@/lib/interfaces";
import React from "react";

const TempImagesPreview: React.FC<TempImagesPreviewProps> = ({
  tempImages,
  onRemove,
}) => {
  if (tempImages.length === 0) return null;

  return (
    <div className="flex gap-3 flex-wrap border-t border-gray-200 pt-4 mt-4">
      {tempImages.map((tempImage) => (
        <div
          key={tempImage.url}
          className="relative w-24 h-24 rounded overflow-hidden border shadow-sm"
        >
          <img
            src={tempImage.url}
            alt={`uploaded-${tempImage.name}`}
            className="w-full h-full object-cover"
          />
          {onRemove && (
            <button
              onClick={() => onRemove(tempImage.name)}
              className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-1 rounded-bl"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TempImagesPreview;
