import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, ImagePlus } from "lucide-react";

import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";

function AdminFeatures() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { featureImageList, isLoading } = useSelector(
    (state) => state.commonFeature
  );

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) {
      toast({
        title: "Please select an image first",
      });
      return;
    }

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Banner uploaded successfully",
        });

        setImageFile(null);
        setUploadedImageUrl("");

        dispatch(getFeatureImages());
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Banner deleted successfully",
        });
      }
    });
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Banners
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Upload and manage your store banners.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImagePlus className="h-5 w-5" />
            Upload Banner
          </CardTitle>
        </CardHeader>

        <CardContent className="min-w-0">
          <div className="min-w-0 max-w-full">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
              isCustomStyling={true}
            />
          </div>

          <Button
            type="button"
            onClick={handleUploadFeatureImage}
            disabled={!uploadedImageUrl || imageLoadingState}
            className="mt-5 w-full"
          >
            {imageLoadingState
              ? "Uploading..."
              : "Upload Banner"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Banners */}
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>
            Existing Banners
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading banners...
            </div>
          ) : featureImageList?.length > 0 ? (
            <div className="grid min-w-0 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {featureImageList.map((featureImgItem) => (
                <div
                  key={featureImgItem._id}
                  className="group min-w-0 overflow-hidden rounded-xl border bg-background"
                >
                  {/* Banner */}
                  <div className="aspect-[16/7] w-full overflow-hidden bg-muted">
                    <img
                      src={featureImgItem.image}
                      alt="Store banner"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Actions */}
                  <div className="p-3">
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full"
                      onClick={() =>
                        handleDeleteFeatureImage(
                          featureImgItem._id
                        )
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Banner
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed py-12 text-center">
              <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">
                No banners found
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Upload your first banner above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminFeatures;