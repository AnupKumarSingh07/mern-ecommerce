import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Package, Palette, Ruler } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { addProductFormElements } from "@/config";

import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";

// =====================================================
// INITIAL VARIANT
// =====================================================

const emptyVariant = {
  color: "",
  size: "",
  price: "",
  salePrice: "",
  stock: "",
};

// =====================================================
// INITIAL PRODUCT FORM
// =====================================================

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

  // NEW
  variants: [],
};

// =====================================================
// ADMIN PRODUCTS
// =====================================================

function AdminProducts() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { productList } = useSelector(
    (state) => state.adminProducts
  );

  // =====================================================
  // PRODUCT DIALOG
  // =====================================================

  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);

  // =====================================================
  // PRODUCT FORM
  // =====================================================

  const [formData, setFormData] = useState(initialFormData);

  // =====================================================
  // IMAGE STATES
  // =====================================================

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  // =====================================================
  // EDIT MODE
  // =====================================================

  const [currentEditedId, setCurrentEditedId] = useState(null);

  // =====================================================
  // NEW VARIANT FORM
  // =====================================================

  const [variantForm, setVariantForm] = useState(emptyVariant);

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  // =====================================================
  // RESET FORM
  // =====================================================

  function resetForm() {
    setFormData({
      ...initialFormData,
      variants: [],
    });

    setImageFile(null);
    setUploadedImageUrl("");
    setImageLoadingState(false);
    setCurrentEditedId(null);

    setVariantForm({
      ...emptyVariant,
    });
  }

  // =====================================================
  // VARIANT INPUT CHANGE
  // =====================================================

  function handleVariantChange(field, value) {
    setVariantForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // =====================================================
  // ADD VARIANT
  // =====================================================

  function handleAddVariant() {
    const color = variantForm.color.trim();
    const size = variantForm.size.trim();

    const price = Number(variantForm.price);
    const salePrice =
      variantForm.salePrice === ""
        ? 0
        : Number(variantForm.salePrice);

    const stock = Number(variantForm.stock);

    // -----------------------------------------------
    // BASIC VALIDATION
    // -----------------------------------------------

    if (!color || !size) {
      toast({
        title: "Color and size are required",
        variant: "destructive",
      });

      return;
    }

    if (!variantForm.price || price <= 0) {
      toast({
        title: "Enter a valid variant price",
        variant: "destructive",
      });

      return;
    }

    if (variantForm.stock === "" || stock < 0) {
      toast({
        title: "Enter a valid variant stock",
        variant: "destructive",
      });

      return;
    }

    if (salePrice < 0) {
      toast({
        title: "Sale price cannot be negative",
        variant: "destructive",
      });

      return;
    }

    if (salePrice > 0 && salePrice >= price) {
      toast({
        title: "Sale price should be lower than price",
        variant: "destructive",
      });

      return;
    }

    // -----------------------------------------------
    // DUPLICATE CHECK
    // -----------------------------------------------

    const duplicateVariant = formData.variants?.some(
      (variant) =>
        variant.color.toLowerCase() === color.toLowerCase() &&
        variant.size.toLowerCase() === size.toLowerCase()
    );

    if (duplicateVariant) {
      toast({
        title: "This color + size variant already exists",
        variant: "destructive",
      });

      return;
    }

    // -----------------------------------------------
    // CREATE VARIANT
    // -----------------------------------------------

    const newVariant = {
      color,
      size,
      price,
      salePrice,
      stock,
    };

    // -----------------------------------------------
    // UPDATE VARIANTS
    // -----------------------------------------------

    setFormData((previous) => ({
      ...previous,
      variants: [
        ...(previous.variants || []),
        newVariant,
      ],
    }));

    // -----------------------------------------------
    // RESET VARIANT FORM
    // -----------------------------------------------

    setVariantForm({
      ...emptyVariant,
    });

    toast({
      title: "Variant added successfully",
    });
  }

  // =====================================================
  // DELETE VARIANT
  // =====================================================

  function handleRemoveVariant(index) {
    setFormData((previous) => ({
      ...previous,
      variants: previous.variants.filter(
        (_, variantIndex) => variantIndex !== index
      ),
    }));
  }

  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  function onSubmit(event) {
    event.preventDefault();

    // ===================================================
    // VARIANT VALIDATION
    // ===================================================

    if (formData.variants?.length > 0) {
      const invalidVariant = formData.variants.some(
        (variant) =>
          !variant.color ||
          !variant.size ||
          Number(variant.price) <= 0 ||
          Number(variant.stock) < 0
      );

      if (invalidVariant) {
        toast({
          title: "Please check all product variants",
          variant: "destructive",
        });

        return;
      }
    }

    // ===================================================
    // EDIT PRODUCT
    // ===================================================

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

    // ===================================================
    // ADD PRODUCT
    // ===================================================

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

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

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

  // =====================================================
  // FORM VALIDATION
  // =====================================================

  function isFormValid() {
    return Object.keys(formData)
      .filter(
        (key) =>
          key !== "averageReview" &&
          key !== "variants"
      )
      .every((key) => formData[key] !== "");
  }

  // =====================================================
  // EDIT PRODUCT
  // =====================================================

  function handleEditProduct(product) {
    setCurrentEditedId(product._id);

    setFormData({
      image: product.image || null,
      title: product.title || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price ?? "",
      salePrice: product.salePrice ?? "",
      totalStock: product.totalStock ?? "",
      averageReview: product.averageReview || 0,

      // NEW
      variants: Array.isArray(product.variants)
        ? product.variants
        : [],
    });

    setUploadedImageUrl(product.image || "");

    setVariantForm({
      ...emptyVariant,
    });

    setOpenCreateProductsDialog(true);
  }

  // =====================================================
  // VARIANT TOTAL STOCK
  // =====================================================

  const variantTotalStock =
    formData.variants?.reduce(
      (total, variant) =>
        total + Number(variant.stock || 0),
      0
    ) || 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Fragment>
      {/* =================================================
    PAGE HEADER
================================================= */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Catalog
          </p>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Products
            </h1>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              {productList?.length || 0} Products
            </span>
          </div>

          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Manage your products, pricing, inventory and variants.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            resetForm();
            setOpenCreateProductsDialog(true);
          }}
          className="
      h-11
      rounded-xl
      bg-gradient-to-r
      from-indigo-600
      to-pink-500
      px-5
      font-semibold
      text-white
      shadow-sm
      transition-all
      hover:from-indigo-700
      hover:to-pink-600
      hover:shadow-md
    "
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Product
        </Button>
      </div>

      {/* =================================================
          PRODUCT GRID
      ================================================= */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productList?.length > 0 ? (
          productList.map((productItem) => (
            <AdminProductTile
              key={productItem._id}
              product={productItem}
              handleDelete={handleDelete}
              setFormData={setFormData}
              setCurrentEditedId={setCurrentEditedId}
              setOpenCreateProductsDialog={
                setOpenCreateProductsDialog
              }

              // NEW
              handleEditProduct={handleEditProduct}
            />
          ))
        ) : (
          <div className="col-span-full rounded-lg border border-dashed p-12 text-center">
            <h2 className="text-xl font-semibold">
              No Products Found
            </h2>

            <p className="mt-2 text-muted-foreground">
              Click "Add New Product" to create your
              first product.
            </p>
          </div>
        )}
      </div>

      {/* =================================================
          PRODUCT SHEET
      ================================================= */}

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
          className="w-full overflow-y-auto sm:max-w-xl"
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <SheetHeader>
            <SheetTitle className="text-xl">
              {currentEditedId
                ? "Edit Product"
                : "Add New Product"}
            </SheetTitle>
          </SheetHeader>

          {/* =================================================
              IMAGE UPLOAD
          ================================================= */}

          <div className="mt-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              imageLoadingState={imageLoadingState}
              setImageLoadingState={setImageLoadingState}
              isEditMode={currentEditedId !== null}
            />
          </div>

          {/* =================================================
              BASIC PRODUCT FORM
          ================================================= */}

          <div className="py-6">
            <CommonForm
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              buttonText={
                currentEditedId
                  ? "Update Product"
                  : "Add Product"
              }
              isBtnDisabled={
                !isFormValid() ||
                imageLoadingState
              }
            />
          </div>

          {/* =================================================
              PRODUCT VARIANTS
          ================================================= */}

          <div className="mt-2 border-t pt-6">
            {/* =================================================
                VARIANT HEADER
            ================================================= */}

            <div className="mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    Product Variants
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Add different color, size, price
                    and stock combinations.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                ADD VARIANT CARD
            ================================================= */}

            <div className="rounded-2xl border bg-muted/30 p-4 sm:p-5">
              <div className="mb-4">
                <h4 className="font-semibold">
                  Add Variant
                </h4>

                <p className="mt-1 text-xs text-muted-foreground">
                  Example: Black + M + ₹650 + 10 stock
                </p>
              </div>

              {/* =================================================
                  COLOR + SIZE
              ================================================= */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* COLOR */}

                <div className="space-y-2">
                  <Label htmlFor="variant-color">
                    Color
                  </Label>

                  <div className="relative">
                    <Palette className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="variant-color"
                      value={variantForm.color}
                      onChange={(event) =>
                        handleVariantChange(
                          "color",
                          event.target.value
                        )
                      }
                      placeholder="Black"
                      className="h-11 rounded-xl pl-9"
                    />
                  </div>
                </div>

                {/* SIZE */}

                <div className="space-y-2">
                  <Label htmlFor="variant-size">
                    Size
                  </Label>

                  <div className="relative">
                    <Ruler className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="variant-size"
                      value={variantForm.size}
                      onChange={(event) =>
                        handleVariantChange(
                          "size",
                          event.target.value
                        )
                      }
                      placeholder="M"
                      className="h-11 rounded-xl pl-9"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  PRICE + SALE PRICE
              ================================================= */}

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {/* PRICE */}

                <div className="space-y-2">
                  <Label htmlFor="variant-price">
                    Price
                  </Label>

                  <Input
                    id="variant-price"
                    type="number"
                    min="0"
                    value={variantForm.price}
                    onChange={(event) =>
                      handleVariantChange(
                        "price",
                        event.target.value
                      )
                    }
                    placeholder="650"
                    className="h-11 rounded-xl"
                  />
                </div>

                {/* SALE PRICE */}

                <div className="space-y-2">
                  <Label htmlFor="variant-sale-price">
                    Sale Price
                  </Label>

                  <Input
                    id="variant-sale-price"
                    type="number"
                    min="0"
                    value={variantForm.salePrice}
                    onChange={(event) =>
                      handleVariantChange(
                        "salePrice",
                        event.target.value
                      )
                    }
                    placeholder="Optional"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* =================================================
                  STOCK
              ================================================= */}

              <div className="mt-4 space-y-2">
                <Label htmlFor="variant-stock">
                  Stock
                </Label>

                <Input
                  id="variant-stock"
                  type="number"
                  min="0"
                  value={variantForm.stock}
                  onChange={(event) =>
                    handleVariantChange(
                      "stock",
                      event.target.value
                    )
                  }
                  placeholder="10"
                  className="h-11 rounded-xl"
                />
              </div>

              {/* =================================================
                  ADD VARIANT BUTTON
              ================================================= */}

              <Button
                type="button"
                onClick={handleAddVariant}
                className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white hover:from-indigo-700 hover:to-pink-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Variant
              </Button>
            </div>

            {/* =================================================
                VARIANT LIST
            ================================================= */}

            {formData.variants?.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    Added Variants
                  </h4>

                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {formData.variants.length}{" "}
                    {formData.variants.length === 1
                      ? "Variant"
                      : "Variants"}
                  </span>
                </div>

                {/* =================================================
                    VARIANT CARDS
                ================================================= */}

                {formData.variants.map(
                  (variant, index) => {
                    const hasVariantSale =
                      Number(variant.salePrice) > 0;

                    return (
                      <div
                        key={`${variant.color}-${variant.size}-${index}`}
                        className="rounded-2xl border bg-card p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          {/* VARIANT INFO */}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800">
                                {variant.color}
                              </span>

                              <span className="text-muted-foreground">
                                +
                              </span>

                              <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800">
                                {variant.size}
                              </span>
                            </div>

                            {/* PRICE */}

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <span className="text-lg font-bold text-indigo-600">
                                ₹
                                {Number(
                                  hasVariantSale
                                    ? variant.salePrice
                                    : variant.price
                                ).toFixed(2)}
                              </span>

                              {hasVariantSale && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹
                                  {Number(
                                    variant.price
                                  ).toFixed(2)}
                                </span>
                              )}

                              <span className="text-muted-foreground">
                                →
                              </span>

                              <span className="text-sm font-medium">
                                {variant.stock} stock
                              </span>
                            </div>
                          </div>

                          {/* DELETE */}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveVariant(
                                index
                              )
                            }
                            className="shrink-0 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}

                {/* =================================================
                    TOTAL VARIANT STOCK
                ================================================= */}

                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-900">
                      Total Variant Stock
                    </span>

                    <span className="text-lg font-bold text-indigo-700">
                      {variantTotalStock}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-indigo-700/70">
                    Sum of stock across all variants.
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                NO VARIANTS
            ================================================= */}

            {(!formData.variants ||
              formData.variants.length === 0) && (
                <div className="mt-5 rounded-2xl border border-dashed p-6 text-center">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground" />

                  <p className="mt-2 text-sm font-medium">
                    No variants added yet
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Add variants if this product has
                    different colors or sizes.
                  </p>
                </div>
              )}
          </div>

          {/* =================================================
              FINAL SAVE BUTTON
          ================================================= */}

          <div className="mt-8 border-t pt-6">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={
                !isFormValid() ||
                imageLoadingState
              }
              className="h-12 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-base font-semibold text-white hover:from-indigo-700 hover:to-pink-600"
            >
              {currentEditedId
                ? "Update Product"
                : "Add Product"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;