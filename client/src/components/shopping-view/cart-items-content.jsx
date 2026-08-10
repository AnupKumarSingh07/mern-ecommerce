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
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      const getCartItems = cartItems?.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList?.findIndex(
          (product) => product._id === getCartItem?.productId
        );

        if (getCurrentProductIndex !== -1) {
          const getTotalStock =
            productList[getCurrentProductIndex]?.totalStock;

          if (indexOfCurrentCartItem > -1) {
            const getQuantity =
              getCartItems[indexOfCurrentCartItem]?.quantity;

            if (getQuantity + 1 > getTotalStock) {
              toast({
                title: `Only ${getQuantity} quantity can be added for this item`,
                variant: "destructive",
              });

              return;
            }
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item deleted successfully",
        });
      }
    });
  }

  const itemPrice =
    cartItem?.salePrice > 0
      ? cartItem?.salePrice
      : cartItem?.price;

  const totalItemPrice = itemPrice * cartItem?.quantity;

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
      "
    >
      {/* Product Image */}
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

      {/* Product Information */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 sm:text-base">
          {cartItem?.title}
        </h3>

        <div className="mt-1 flex items-center gap-2">
          {cartItem?.salePrice > 0 ? (
            <>
              <span className="text-sm font-bold text-primary">
                ${cartItem?.salePrice}
              </span>

              <span className="text-xs text-muted-foreground line-through">
                ${cartItem?.price}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold">
              ${cartItem?.price}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            disabled={cartItem?.quantity === 1}
            onClick={() =>
              handleUpdateQuantity(cartItem, "minus")
            }
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>

          <span className="flex min-w-8 items-center justify-center text-sm font-semibold">
            {cartItem?.quantity}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() =>
              handleUpdateQuantity(cartItem, "plus")
            }
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Price + Delete */}
      <div className="flex h-full flex-col items-end justify-between gap-4">
        <span className="text-sm font-bold sm:text-base">
          ${totalItemPrice.toFixed(2)}
        </span>

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
          onClick={() => handleCartItemDelete(cartItem)}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;