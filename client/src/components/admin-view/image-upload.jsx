import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  uploadUrl = "http://localhost:5000/api/admin/products/upload-image",
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setImageFile(selectedFile);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();

    if (isEditMode) return;

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      setImageFile(droppedFile);
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;

    setImageLoadingState(true);

    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        uploadUrl,
        data,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        const uploadedUrl =
          response?.data?.result?.secure_url ||
          response?.data?.result?.url;

        if (uploadedUrl) {
          setUploadedImageUrl(uploadedUrl);
        }
      }
    } catch (error) {
      console.error(
        "Image upload failed:",
        error?.response?.data || error.message
      );

      setUploadedImageUrl("");
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile && !isEditMode) {
      uploadImageToCloudinary();
    }
  }, [imageFile, isEditMode]);

  return (
    <div
      className={`mt-4 w-full min-w-0 max-w-full overflow-hidden ${
        isCustomStyling ? "" : "mx-auto max-w-md"
      }`}
    >
      <Label className="mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`w-full min-w-0 max-w-full overflow-hidden rounded-lg border-2 border-dashed p-4 transition ${
          isEditMode ? "cursor-not-allowed opacity-60" : ""
        }`}
      >
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`flex h-32 w-full min-w-0 flex-col items-center justify-center gap-3 ${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <UploadCloudIcon className="h-8 w-8 text-muted-foreground" />

            <span className="text-center text-sm text-muted-foreground">
              Drag & drop or click to upload image
            </span>

            <Input
              id="image-upload"
              ref={inputRef}
              type="file"
              accept="image/*"
              disabled={isEditMode}
              onChange={handleImageFileChange}
              className="hidden"
            />
          </Label>
        ) : imageLoadingState ? (
          <div className="w-full min-w-0 space-y-3 overflow-hidden">
            <Skeleton className="h-32 w-full rounded-lg" />

            <p className="text-center text-sm text-muted-foreground">
              Uploading image...
            </p>
          </div>
        ) : (
          <div className="flex w-full min-w-0 max-w-full items-center gap-3 overflow-hidden rounded-lg bg-muted/40 p-3">
            {/* File Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
              <FileIcon className="h-5 w-5 text-primary" />
            </div>

            {/* File Name */}
            <div className="min-w-0 flex-1 overflow-hidden">
              <p
                className="block w-full truncate text-sm font-medium"
                title={imageFile.name}
              >
                {imageFile.name}
              </p>
            </div>

            {/* Remove Button */}
            {!isEditMode && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveImage}
                aria-label="Remove image"
                className="shrink-0"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;