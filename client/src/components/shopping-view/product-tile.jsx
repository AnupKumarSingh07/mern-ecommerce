import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

import {
  ShoppingCart,
  ArrowUpRight,
  Heart,
  Star,
} from "lucide-react";

import {
  brandOptionsMap,
  categoryOptionsMap,
} from "@/config";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const isOutOfStock =
    Number(product?.totalStock) === 0;

  const isLowStock =
    Number(product?.totalStock) > 0 &&
    Number(product?.totalStock) < 10;

  const isOnSale =
    Number(product?.salePrice) > 0;

  const productImage =
    product?.image ||
    product?.images?.[0] ||
    product?.imageUrl ||
    "";

  /* =====================================================
     PRODUCT CLICK
  ===================================================== */

  function handleProductClick() {
    if (!isOutOfStock) {
      handleGetProductDetails(
        product?._id
      );
    }
  }

  /* =====================================================
     CART CLICK
  ===================================================== */

  function handleCartClick(event) {
    event.stopPropagation();

    if (!isOutOfStock) {
      handleAddtoCart(
        product?._id,
        product?.totalStock
      );
    }
  }

  /* =====================================================
     WISHLIST CLICK
  ===================================================== */

  function handleWishlistClick(event) {
    event.stopPropagation();

    // Wishlist functionality can be connected later.
  }

  return (
    <Card
      onClick={handleProductClick}
      className="
        group
        overflow-hidden
        rounded-xl
        border-border/70
        bg-card
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-[0_10px_25px_rgba(79,70,229,0.10)]
      "
    >

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <div
        className="
          relative
          aspect-square
          overflow-hidden
          bg-muted/40
        "
      >

        {productImage ? (

          <img
            src={productImage}
            alt={
              product?.title ||
              "Product"
            }
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

          <div
            className="
              flex
              h-full
              items-center
              justify-center
              bg-muted
              text-xs
              text-muted-foreground
            "
          >
            No image
          </div>

        )}

        {/* =================================================
            IMAGE OVERLAY
        ================================================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* =================================================
            BADGES
        ================================================= */}

        <div
          className="
            absolute
            left-2
            top-2
            flex
            flex-col
            gap-1.5
            sm:left-3
            sm:top-3
          "
        >

          {isOutOfStock ? (

            <Badge
              className="
                rounded-full
                border-0
                bg-slate-950/85
                px-2
                py-0.5
                text-[9px]
                font-semibold
                text-white
                shadow-sm
                backdrop-blur-md
                sm:px-3
                sm:py-1
                sm:text-[11px]
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
                bg-orange-50/95
                px-2
                py-0.5
                text-[9px]
                font-semibold
                text-orange-700
                shadow-sm
                backdrop-blur-md
                sm:px-3
                sm:py-1
                sm:text-[11px]
              "
            >
              Only {product?.totalStock} left
            </Badge>

          ) : isOnSale ? (

            <Badge
              className="
                rounded-full
                border-0
                bg-gradient-to-r
                from-indigo-600
                to-pink-500
                px-2
                py-0.5
                text-[9px]
                font-semibold
                text-white
                shadow-sm
                sm:px-3
                sm:py-1
                sm:text-[11px]
              "
            >
              Sale
            </Badge>

          ) : null}

        </div>

        {/* =================================================
            WISHLIST
        ================================================= */}

        {!isOutOfStock && (

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={handleWishlistClick}
            className="
              absolute
              right-2
              top-2
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-white/90
              text-slate-700
              shadow-md
              backdrop-blur-md
              transition-all
              duration-200
              hover:scale-110
              hover:bg-white
              hover:text-pink-500
              sm:right-3
              sm:top-3
              sm:h-9
              sm:w-9
            "
          >
            <Heart
              className="
                h-3.5
                w-3.5
                sm:h-4
                sm:w-4
              "
            />
          </button>

        )}

        {/* =================================================
            QUICK VIEW
        ================================================= */}

        {!isOutOfStock && (

          <div
            className="
              absolute
              bottom-2
              right-2
              hidden
              translate-y-2
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
              sm:block
              sm:bottom-3
              sm:right-3
            "
          >

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                handleGetProductDetails(
                  product?._id
                );
              }}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-white
                text-slate-900
                shadow-lg
                transition-all
                duration-200
                hover:scale-110
                hover:bg-indigo-600
                hover:text-white
              "
              title="View product"
              aria-label="View product"
            >
              <ArrowUpRight
                className="h-4 w-4"
              />
            </button>

          </div>

        )}

      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <CardContent
        className="
          p-3
          sm:p-4
        "
      >

        {/* =================================================
            BRAND
        ================================================= */}

        <p
          className="
            text-[9px]
            font-bold
            uppercase
            tracking-[0.12em]
            text-indigo-600
            sm:text-[11px]
          "
        >
          {brandOptionsMap[
            product?.brand
          ] || product?.brand}
        </p>

        {/* =================================================
            PRODUCT TITLE
        ================================================= */}

        <h3
          className="
            mt-1
            line-clamp-2
            min-h-[40px]
            text-sm
            font-semibold
            leading-5
            tracking-tight
            text-foreground
            transition-colors
            duration-200
            group-hover:text-indigo-600
            sm:min-h-[42px]
          "
        >
          {product?.title}
        </h3>

        {/* =================================================
            CATEGORY
        ================================================= */}

        <p
          className="
            mt-1
            truncate
            text-[11px]
            text-muted-foreground
            sm:text-xs
          "
        >
          {categoryOptionsMap[
            product?.category
          ] || product?.category}
        </p>

        {/* =================================================
            RATING
        ================================================= */}

        <div
          className="
            mt-2
            flex
            items-center
            gap-1
          "
        >

          <div
            className="
              flex
              items-center
              gap-0.5
            "
          >

            <Star
              className="
                h-3
                w-3
                fill-amber-400
                text-amber-400
                sm:h-3.5
                sm:w-3.5
              "
            />

            <Star
              className="
                h-3
                w-3
                fill-amber-400
                text-amber-400
                sm:h-3.5
                sm:w-3.5
              "
            />

            <Star
              className="
                h-3
                w-3
                fill-amber-400
                text-amber-400
                sm:h-3.5
                sm:w-3.5
              "
            />

            <Star
              className="
                h-3
                w-3
                fill-amber-400
                text-amber-400
                sm:h-3.5
                sm:w-3.5
              "
            />

            <Star
              className="
                h-3
                w-3
                fill-amber-400
                text-amber-400
                sm:h-3.5
                sm:w-3.5
              "
            />

          </div>

          <span
            className="
              text-[9px]
              text-muted-foreground
              sm:text-[11px]
            "
          >
            Popular
          </span>

        </div>

        {/* =================================================
            PRICE
        ================================================= */}

        <div
          className="
            mt-2
            flex
            items-baseline
            gap-1.5
            sm:mt-3
            sm:gap-2
          "
        >

          {isOnSale ? (

            <>

              <span
                className="
                  text-base
                  font-bold
                  tracking-tight
                  text-indigo-600
                  sm:text-lg
                "
              >
                ${product?.salePrice}
              </span>

              <span
                className="
                  text-[11px]
                  text-muted-foreground
                  line-through
                  sm:text-sm
                "
              >
                ${product?.price}
              </span>

            </>

          ) : (

            <span
              className="
                text-base
                font-bold
                tracking-tight
                text-foreground
                sm:text-lg
              "
            >
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
            mt-3
            h-9
            w-full
            rounded-lg
            bg-gradient-to-r
            from-indigo-600
            to-pink-500
            px-2
            text-xs
            font-semibold
            text-white
            shadow-sm
            transition-all
            duration-300
            hover:from-indigo-700
            hover:to-pink-600
            hover:shadow-md
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:mt-4
            sm:h-10
            sm:rounded-xl
            sm:px-4
            sm:text-sm
          "
        >

          <ShoppingCart
            className="
              mr-1.5
              h-3.5
              w-3.5
              sm:mr-2
              sm:h-4
              sm:w-4
            "
          />

          {isOutOfStock
            ? "Out of stock"
            : "Add to cart"}

        </Button>

      </CardContent>

    </Card>
  );
}

export default ShoppingProductTile;