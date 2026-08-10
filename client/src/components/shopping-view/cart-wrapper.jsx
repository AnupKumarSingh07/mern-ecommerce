import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const totalItems =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      : 0;

  function handleCheckout() {
    navigate("/shop/checkout");
    setOpenCartSheet(false);
  }

  return (
    <SheetContent
      side="right"
      className="
        flex
        w-full
        flex-col
        p-0
        sm:max-w-md
      "
    >
      {/* Header */}
      <SheetHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>

          <div>
            <SheetTitle className="text-lg">
              Your Cart
            </SheetTitle>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
      </SheetHeader>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {cartItems && cartItems.length > 0 ? (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <UserCartItemsContent
                key={item?._id || item?.productId}
                cartItem={item}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Your cart is empty
            </h3>

            <p className="mt-2 max-w-[260px] text-sm text-muted-foreground">
              Looks like you haven't added anything to your
              cart yet.
            </p>

            <Button
              variant="outline"
              className="mt-5 rounded-xl"
              onClick={() => {
                navigate("/shop/listing");
                setOpenCartSheet(false);
              }}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      {cartItems && cartItems.length > 0 && (
        <div className="border-t bg-background px-6 py-5">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Subtotal
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Taxes and shipping calculated at checkout
              </p>
            </div>

            <span className="text-xl font-bold">
              ${totalCartAmount.toFixed(2)}
            </span>
          </div>

          {/* Checkout */}
          <Button
            onClick={handleCheckout}
            className="
              mt-5
              h-12
              w-full
              rounded-xl
              text-sm
              font-semibold
              shadow-sm
            "
          >
            Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Continue Shopping */}
          <Button
            variant="ghost"
            onClick={() => {
              navigate("/shop/listing");
              setOpenCartSheet(false);
            }}
            className="mt-2 w-full text-sm"
          >
            Continue Shopping
          </Button>
        </div>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;