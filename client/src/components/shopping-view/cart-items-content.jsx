import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  updateCartQuantity,
} from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { toast } = useToast();

  // =====================================================
  // VARIANT INFORMATION
  // =====================================================

  const hasVariant =
    Boolean(cartItem?.variantId) &&
    Boolean(cartItem?.color || cartItem?.size);

  const variantLabel = [
    cartItem?.color,
    cartItem?.size
      ? `Size ${cartItem.size}`
      : null,
  ]
    .filter(Boolean)
    .join(" • ");

  // =====================================================
  // PRICE
  // =====================================================

  const itemPrice =
    cartItem?.salePrice > 0
      ? cartItem?.salePrice
      : cartItem?.price;

  const totalItemPrice =
    itemPrice * cartItem?.quantity;

  // =====================================================
  // STOCK
  // =====================================================

  // Backend now sends variant stock as `stock`.
  // For old/non-variant products it sends totalStock.
  const availableStock =
    cartItem?.stock ?? cartItem?.totalStock ?? 0;

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  function handleUpdateQuantity(
    getCartItem,
    typeOfAction
  ) {
    const newQuantity =
      typeOfAction === "plus"
        ? getCartItem?.quantity + 1
        : getCartItem?.quantity - 1;

    // -----------------------------------------------
    // Don't allow quantity below 1
    // -----------------------------------------------

    if (newQuantity < 1) {
      return;
    }

    // -----------------------------------------------
    // Variant/product stock check
    // -----------------------------------------------

    if (
      typeOfAction === "plus" &&
      availableStock > 0 &&
      newQuantity > availableStock
    ) {
      toast({
        title: `Only ${availableStock} items available in stock`,
        variant: "destructive",
      });

      return;
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        variantId: getCartItem?.variantId || null,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
        });
      }
    });
  }

  // =====================================================
  // DELETE CART ITEM
  // =====================================================

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
        variantId: getCartItem?.variantId || null,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item deleted successfully",
        });
      }
    });
  }

  return (
    <div
      className="
        group
        flex
        w-full
        items-center
        gap-4
        rounded-2xl
        border
        bg-background
        p-4
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md

        max-sm:items-start
        max-sm:gap-3
        max-sm:p-3
      "
    >
      {/* =================================================
          PRODUCT IMAGE
          ================================================= */}

      <div
        className="
          h-20
          w-20
          shrink-0
          overflow-hidden
          rounded-xl
          bg-muted

          sm:h-24
          sm:w-24

          max-sm:h-[72px]
          max-sm:w-[72px]
        "
      >
        {cartItem?.image ? (
          <img
            src={cartItem.image}
            alt={cartItem?.title || "Product"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* =================================================
          PRODUCT INFORMATION
          ================================================= */}

      <div className="min-w-0 flex-1">
        {/* Product title */}

        <h3
          className="
            line-clamp-2
            text-sm
            font-semibold
            leading-5
            sm:text-base
          "
        >
          {cartItem?.title}
        </h3>

        {/* =================================================
            VARIANT INFORMATION
            ================================================= */}

        {hasVariant && (
          <div
            className="
              mt-1.5
              flex
              flex-wrap
              items-center
              gap-1.5
              text-xs
              sm:text-sm
            "
          >
            <span className="font-medium text-foreground">
              {variantLabel}
            </span>
          </div>
        )}

        {/* =================================================
            PRICE
            ================================================= */}

        <div className="mt-1 flex items-center gap-2">
          {cartItem?.salePrice > 0 ? (
            <>
              <span className="text-sm font-bold text-primary">
                ₹{cartItem?.salePrice}
              </span>

              <span className="text-xs text-muted-foreground line-through">
                ₹{cartItem?.price}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold">
              ₹{cartItem?.price}
            </span>
          )}
        </div>

        {/* =================================================
            STOCK INFORMATION
            ================================================= */}

        {hasVariant && (
          <p
            className={`
              mt-1
              text-xs
              ${
                availableStock <= 5
                  ? "text-orange-600"
                  : "text-muted-foreground"
              }
            `}
          >
            {availableStock > 0
              ? `${availableStock} available`
              : "Out of stock"}
          </p>
        )}

        {/* =================================================
            QUANTITY CONTROLS
            ================================================= */}

        <div className="mt-3 flex items-center gap-2">
          {/* Minus */}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={cartItem?.quantity === 1}
            onClick={() =>
              handleUpdateQuantity(
                cartItem,
                "minus"
              )
            }
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          {/* Quantity */}

          <span
            className="
              flex
              min-w-8
              items-center
              justify-center
              text-sm
              font-semibold
            "
          >
            {cartItem?.quantity}
          </span>

          {/* Plus */}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={
              availableStock > 0 &&
              cartItem?.quantity >=
                availableStock
            }
            onClick={() =>
              handleUpdateQuantity(
                cartItem,
                "plus"
              )
            }
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* =================================================
          PRICE + DELETE
          ================================================= */}

      <div
        className="
          flex
          h-full
          flex-col
          items-end
          justify-between
          gap-4
          max-sm:gap-3
        "
      >
        {/* Total item price */}

        <span className="text-sm font-bold sm:text-base">
          ₹{totalItemPrice.toFixed(2)}
        </span>

        {/* Delete */}

        <Button
          variant="ghost"
          size="icon"
          className="
            h-8
            w-8
            rounded-full
            text-muted-foreground
            transition-colors
            hover:bg-destructive/10
            hover:text-destructive
          "
          onClick={() =>
            handleCartItemDelete(cartItem)
          }
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;