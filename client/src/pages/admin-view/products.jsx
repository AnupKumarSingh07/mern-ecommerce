import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

import { addProductFormElements } from "@/config";

import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { productList } = useSelector((state) => state.adminProducts);

  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function resetForm() {
    setFormData(initialFormData);
    setImageFile(null);
    setUploadedImageUrl("");
    setImageLoadingState(false);
    setCurrentEditedId(null);
  }

  function onSubmit(event) {
    event.preventDefault();

    if (currentEditedId) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());

          toast({
            title: "Product updated successfully",
          });

          resetForm();
          setOpenCreateProductsDialog(false);
        }
      });

      return;
    }

    dispatch(
      addNewProduct({
        ...formData,
        image: uploadedImageUrl,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());

        toast({
          title: "Product added successfully",
        });

        resetForm();
        setOpenCreateProductsDialog(false);
      }
    });
  }

  function handleDelete(productId) {
    dispatch(deleteProduct(productId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());

        toast({
          title: "Product deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((key) => key !== "averageReview")
      .every((key) => formData[key] !== "");
  }

  return (
    <Fragment>
      <div className="mb-6 flex justify-end">
        <Button
          size="lg"
          onClick={() => setOpenCreateProductsDialog(true)}
        >
          Add New Product
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productList?.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              product={productItem}
              handleDelete={handleDelete}
              setFormData={setFormData}
              setCurrentEditedId={setCurrentEditedId}
              setOpenCreateProductsDialog={setOpenCreateProductsDialog}
            />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold">
              No Products Found
            </h2>

            <p className="mt-2 text-muted-foreground">
              Click "Add New Product" to create your first product.
            </p>
          </div>
        )}
      </div>

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={(open) => {
          setOpenCreateProductsDialog(open);

          if (!open) {
            resetForm();
          }
        }}
      >
        <SheetContent
          side="right"
          className="overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle>
              {currentEditedId
                ? "Edit Product"
                : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            imageLoadingState={imageLoadingState}
            setImageLoadingState={setImageLoadingState}
            isEditMode={currentEditedId !== null}
          />

          <div className="py-6">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={
                currentEditedId ? "Update Product" : "Add Product"
              }
              isBtnDisabled={
                !isFormValid() || imageLoadingState
              }
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
