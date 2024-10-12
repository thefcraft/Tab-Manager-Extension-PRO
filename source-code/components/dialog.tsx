"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { Upload, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditSaveUrlProps {
  children: React.ReactNode; // Define children prop
  imageUrlState: [string, Dispatch<SetStateAction<string>>];
  urlNameState: [string, Dispatch<SetStateAction<string>>];
  urlTitleState: [string, Dispatch<SetStateAction<string>>];
  callback: () => void;
  title?: string;
  tooltip?: string;
  defaultImageUrl?: string;
  defaultUrlName?: string;
  defaultUrlTitle?: string;
}
export const EditSaveUrl: React.FC<EditSaveUrlProps> = ({
  children,
  imageUrlState,
  urlNameState,
  urlTitleState,
  callback,
  title,
  tooltip,
  defaultImageUrl,
  defaultUrlName,
  defaultUrlTitle,
}) => {
  const [imageUrl, setImageUrl] = imageUrlState;
  const [urlName, setUrlName] = urlNameState;
  const [urlTitle, setUrlTitle] = urlTitleState;

  const [isDragging, setIsDragging] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  const clearState = () => {
    setImageUrl("");
    setUrlName("");
    setUrlTitle("");
  };

  const openHandler = () => {
    clearState();
    if (defaultImageUrl) setImageUrl(defaultImageUrl);
    if (defaultUrlName) setUrlName(defaultUrlName);
    if (defaultUrlTitle) setUrlTitle(defaultUrlTitle);
    setIsOpen(undefined);
  };

  const submitHandler = () => {
    if (isDisable) return;
    setIsOpen(false);
    callback();
    clearState();
  };

  const handleRemoveImage = () => {
    setIsDisable(true);
    setImageUrl("");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;
        // setImageUrl(event.target.result as string);
        // setIsDisable(!urlName || !urlTitle);

        // Create an image element
        const img = new Image();
        img.onload = () => {
          // Create a canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Define maximum dimensions for the thumbnail
          const MAX_WIDTH = 480; // Maximum thumbnail width
          const MAX_HEIGHT = 480; // Maximum thumbnail height

          // Calculate the new dimensions maintaining the aspect ratio
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio
          const aspectRatio = width / height;

          if (width > height) {
            // If wider than tall
            if (width > MAX_WIDTH) {
              width = MAX_WIDTH;
              height = Math.round(width / aspectRatio);
            }
          } else {
            // If taller than wide
            if (height > MAX_HEIGHT) {
              height = MAX_HEIGHT;
              width = Math.round(height * aspectRatio);
            }
          }

          // Set canvas dimensions to the new thumbnail dimensions
          canvas.width = width;
          canvas.height = height;
          // canvas.width = img.width;
          // canvas.height = img.height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, width, height);
          // ctx.drawImage(img, 0, 0);

          // Compress the image by setting the quality (0 to 1)
          const quality = 0.7; // Adjust this value (0.7 is 70% quality)
          const compressedImageUrl = canvas.toDataURL("image/jpeg", quality);

          // Set the compressed image URL
          setImageUrl(compressedImageUrl);
          setIsDisable(!urlName || !urlTitle);
        };
        img.src = event.target.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const fileSelectUrlHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target) return;

        // Create an image element
        const img = new Image();
        img.src = event.target.result as string;

        img.onload = () => {
          // Create a canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // Define maximum dimensions for the thumbnail
          const MAX_WIDTH = 480; // Maximum thumbnail width
          const MAX_HEIGHT = 480; // Maximum thumbnail height

          // Calculate the new dimensions maintaining the aspect ratio
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio
          const aspectRatio = width / height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              width = MAX_WIDTH;
              height = Math.round(width / aspectRatio);
            }
          } else {
            if (height > MAX_HEIGHT) {
              height = MAX_HEIGHT;
              width = Math.round(height * aspectRatio);
            }
          }

          // Set canvas dimensions to the new thumbnail dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Compress the image by setting the quality (0 to 1)
          const quality = 0.7; // Adjust this value (0.7 is 70% quality)
          const compressedImageUrl = canvas.toDataURL("image/jpeg", quality);
          // Set the compressed image URL to state
          setImageUrl(compressedImageUrl);
          setIsDisable(!urlName || !urlTitle);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Tooltip>
      <Dialog onOpenChange={openHandler} open={isOpen}>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title ? title : "Add New URL"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="url-title"
                  value={urlTitle}
                  onChange={(e) => {
                    setUrlTitle(e.target.value);
                    setIsDisable(!imageUrl || !urlName || !e.target.value);
                  }}
                  className="col-span-3"
                  placeholder="Enter Title Here"
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url-name" className="text-right">
                  URL
                </Label>
                <Input
                  id="url-name"
                  value={urlName}
                  onChange={(e) => {
                    setUrlName(e.target.value);
                    setIsDisable(!imageUrl || !e.target.value || !urlTitle);
                  }}
                  className="col-span-3"
                  placeholder="Enter URL Here"
                  type="url"
                  autoComplete="off"
                />
              </div>
            </div>

            {imageUrl ? (
              <div className="relative col-span-4">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-h-32 mx-auto rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 p-1 bg-background rounded-full shadow"
                >
                  <XIcon className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ) : (
              <div
                className={`col-span-4 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                  isDragging
                    ? "border-primary bg-primary/10"
                    : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">
                  Drag and drop an image or
                </p>
                <label
                  htmlFor="file-upload"
                  className="text-sm text-primary cursor-pointer"
                >
                  browse
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      fileSelectUrlHandler(e);
                    }}
                  />
                </label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={submitHandler} disabled={isDisable}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TooltipContent>
        {tooltip ? tooltip : "add new url in this workflow"}
      </TooltipContent>
    </Tooltip>
  );
};
