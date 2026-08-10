import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShoppingCart, ArrowUpRight } from "lucide-react";

import {
  brandOptionsMap,
  categoryOptionsMap,
} from "@/config";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const isOutOfStock = Number(product?.totalStock) === 0;

  const isLowStock =
    Number(product?.totalStock) > 0 &&
    Number(product?.totalStock) < 10;

  const isOnSale = Number(product?.salePrice) > 0;

  const productImage =
    product?.image ||
    product?.images?.[0] ||
    product?.imageUrl ||
    "";

  function handleProductClick() {
    if (!isOutOfStock) {
      handleGetProductDetails(product?._id);
    }
  }

  function handleCartClick(event) {
    event.stopPropagation();

    if (!isOutOfStock) {
      handleAddtoCart(product?._id, product?.totalStock);
    }
  }

  return (
    <Card
      onClick={handleProductClick}
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        bg-card
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {productImage ? (
          <img
            src={productImage}
            alt={product?.title || "Product"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        {/* Image overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/25
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* =================================================
            STOCK / SALE BADGE
        ================================================= */}

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {isOutOfStock ? (
            <Badge
              className="
                rounded-full
                border-0
                bg-black/80
                px-3
                py-1
                text-xs
                font-medium
                text-white
                backdrop-blur-sm
              "
            >
              Out of stock
            </Badge>
          ) : isLowStock ? (
            <Badge
              className="
                rounded-full
                border
                border-orange-200
                bg-orange-50
                px-3
                py-1
                text-xs
                font-medium
                text-orange-700
                shadow-sm
                backdrop-blur-sm
              "
            >
              Only {product?.totalStock} left
            </Badge>
          ) : isOnSale ? (
            <Badge
              className="
                rounded-full
                border-0
                bg-primary
                px-3
                py-1
                text-xs
                font-medium
                text-primary-foreground
              "
            >
              Sale
            </Badge>
          ) : null}
        </div>

        {/* =================================================
            QUICK VIEW
        ================================================= */}

        {!isOutOfStock && (
          <div
            className="
              absolute
              bottom-3
              right-3
              translate-y-2
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-white
                text-black
                shadow-lg
                transition-transform
                duration-200
                hover:scale-110
              "
              title="View product"
            >
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <CardContent className="p-4">
        {/* Brand */}

        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {brandOptionsMap[product?.brand] || product?.brand}
        </p>

        {/* Product title */}

        <h3
          className="
            mt-1
            line-clamp-2
            min-h-[48px]
            text-sm
            font-semibold
            leading-6
            tracking-tight
            transition-colors
            group-hover:text-primary
          "
        >
          {product?.title}
        </h3>

        {/* Category */}

        <p className="mt-1 text-xs text-muted-foreground">
          {categoryOptionsMap[product?.category] || product?.category}
        </p>

        {/* Price */}

        <div className="mt-4 flex items-baseline gap-2">
          {isOnSale ? (
            <>
              <span className="text-lg font-bold text-primary">
                ${product?.salePrice}
              </span>

              <span className="text-sm text-muted-foreground line-through">
                ${product?.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              ${product?.price}
            </span>
          )}
        </div>

        {/* =================================================
            ADD TO CART
        ================================================= */}

        <Button
          disabled={isOutOfStock}
          onClick={handleCartClick}
          className="
            mt-4
            h-10
            w-full
            rounded-xl
            transition-all
            duration-200
            group-hover:shadow-md
          "
        >
          <ShoppingCart className="mr-2 h-4 w-4" />

          {isOutOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default ShoppingProductTile;