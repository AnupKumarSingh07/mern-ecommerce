import {
  Edit,
  Trash2,
  Tag,
  Package,
  Star,
  Layers3,
  AlertTriangle,
} from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
} from "../ui/card";

function AdminProductTile({
  product,
  handleDelete,
  handleEditProduct,
  viewMode = "grid",
}) {
  const {
    _id,
    image,
    title,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    averageReview,
    variants = [],
  } = product;

  // =====================================================
  // PRICE
  // =====================================================

  const hasDiscount =
    Number(salePrice) > 0 &&
    Number(salePrice) < Number(price);

  const displayPrice = hasDiscount ? salePrice : price;

  const discountPercentage =
    hasDiscount && Number(price) > 0
      ? Math.round(
          ((Number(price) - Number(salePrice)) /
            Number(price)) *
            100
        )
      : 0;

  // =====================================================
  // VARIANTS
  // =====================================================

  const hasVariants =
    Array.isArray(variants) && variants.length > 0;

  const variantCount = hasVariants
    ? variants.length
    : 0;

  const variantStock = hasVariants
    ? variants.reduce(
        (total, variant) =>
          total + Number(variant?.stock || 0),
        0
      )
    : 0;

  /*
   * If variants exist, their stock becomes the
   * more accurate inventory value.
   *
   * Otherwise use the product's normal totalStock.
   */

  const stock = hasVariants
    ? variantStock
    : Number(totalStock || 0);

  // =====================================================
  // STOCK STATUS
  // =====================================================

  const stockStatus =
    stock <= 0
      ? "Out of Stock"
      : stock <= 5
        ? "Low Stock"
        : "In Stock";

  const stockClass =
    stock <= 0
      ? "border-red-200 bg-red-50 text-red-700"
      : stock <= 5
        ? "border-orange-200 bg-orange-50 text-orange-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";

  // =====================================================
  // IMAGE FALLBACK
  // =====================================================

  const productImage =
    image || "/placeholder.png";

  // =====================================================
  // GRID VIEW
  // =====================================================

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          {/* IMAGE */}

          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
            <img
              src={productImage}
              alt={title || "Product"}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* PRODUCT INFO */}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {brand && (
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {brand}
                </span>
              )}

              {hasDiscount && (
                <Badge className="rounded-full bg-pink-500 px-2.5 text-xs text-white hover:bg-pink-500">
                  <Tag className="mr-1 h-3 w-3" />
                  {discountPercentage}% OFF
                </Badge>
              )}

              {hasVariants && (
                <Badge
                  variant="secondary"
                  className="rounded-full"
                >
                  <Layers3 className="mr-1 h-3 w-3" />
                  {variantCount} Variants
                </Badge>
              )}
            </div>

            <h2 className="mt-1 truncate text-lg font-bold">
              {title || "Untitled Product"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {category || "Uncategorized"}
            </p>

            {hasVariants && (
              <p className="mt-1 text-xs text-muted-foreground">
                Variant inventory enabled
              </p>
            )}
          </div>

          {/* PRICE */}

          <div className="min-w-[120px]">
            <p className="text-lg font-bold text-indigo-600">
              ₹{Number(displayPrice || 0).toFixed(0)}
            </p>

            {hasDiscount && (
              <p className="text-sm text-muted-foreground line-through">
                ₹{Number(price || 0).toFixed(0)}
              </p>
            )}
          </div>

          {/* STOCK */}

          <div className="min-w-[130px]">
            <Badge
              variant="outline"
              className={`rounded-full ${stockClass}`}
            >
              {stock <= 5 && (
                <AlertTriangle className="mr-1 h-3 w-3" />
              )}

              <Package className="mr-1 h-3 w-3" />

              {stock} Stock
            </Badge>
          </div>

          {/* ACTIONS */}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl"
              onClick={() =>
                handleEditProduct(product)
              }
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="rounded-xl"
              onClick={() =>
                handleDelete(_id)
              }
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // =====================================================
  // GRID VIEW
  // =====================================================

  return (
    <Card className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={productImage}
          alt={title || "Product"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* IMAGE OVERLAY */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent opacity-70" />

        {/* DISCOUNT */}

        {hasDiscount && (
          <Badge className="absolute left-3 top-3 rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white shadow-md hover:bg-pink-500">
            <Tag className="mr-1 h-3 w-3" />
            {discountPercentage}% OFF
          </Badge>
        )}

        {/* STOCK */}

        <Badge
          variant="outline"
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold shadow-md ${stockClass}`}
        >
          {stock <= 5 && (
            <AlertTriangle className="mr-1 h-3 w-3" />
          )}

          {stockStatus}
        </Badge>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <CardContent className="p-5">
        {/* BRAND + VARIANT */}

        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 truncate text-xs font-bold uppercase tracking-widest text-indigo-600">
            {brand || "Brand"}
          </div>

          {hasVariants && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
              <Layers3 className="h-3 w-3" />
              {variantCount}
            </span>
          )}
        </div>

        {/* TITLE */}

        <h2 className="mt-2 line-clamp-1 text-lg font-bold tracking-tight">
          {title || "Untitled Product"}
        </h2>

        {/* CATEGORY */}

        <p className="mt-1 text-sm text-muted-foreground">
          {category || "Uncategorized"}
        </p>

        {/* RATING */}

        <div className="mt-3 flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

          <span className="font-semibold">
            {Number(
              averageReview || 0
            ).toFixed(1)}
          </span>

          <span className="text-muted-foreground">
            Rating
          </span>
        </div>

        {/* PRICE */}

        <div className="mt-4 flex items-end gap-2">
          <span className="text-xl font-bold text-indigo-600">
            ₹
            {Number(
              displayPrice || 0
            ).toFixed(0)}
          </span>

          {hasDiscount && (
            <span className="pb-0.5 text-sm text-muted-foreground line-through">
              ₹
              {Number(
                price || 0
              ).toFixed(0)}
            </span>
          )}
        </div>

        {/* INVENTORY */}

        <div className="mt-4 rounded-xl bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />

              <span>
                Inventory
              </span>
            </div>

            <span
              className={`text-sm font-bold ${
                stock <= 0
                  ? "text-red-600"
                  : stock <= 5
                    ? "text-orange-600"
                    : "text-emerald-600"
              }`}
            >
              {stock} units
            </span>
          </div>

          {/* VARIANT SUMMARY */}

          {hasVariants && (
            <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs text-muted-foreground">
              <span>
                Product variants
              </span>

              <span className="font-medium text-foreground">
                {variantCount} combinations
              </span>
            </div>
          )}
        </div>
      </CardContent>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <CardFooter className="grid grid-cols-2 gap-3 p-5 pt-0">
        <Button
          variant="outline"
          className="h-10 rounded-xl border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          onClick={() =>
            handleEditProduct(product)
          }
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="destructive"
          className="h-10 rounded-xl"
          onClick={() =>
            handleDelete(_id)
          }
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;