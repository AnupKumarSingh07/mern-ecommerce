import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] =
    useState(null);

  const [isPaymentStart, setIsPaymemntStart] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();

  // ==========================================
  // TOTAL CART AMOUNT
  // ==========================================

  const totalCartAmount =
    cartItems &&
    cartItems.items &&
    cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // ==========================================
  // PAYPAL PAYMENT
  // ==========================================

  function handleInitiatePaypalPayment() {
    // Check cart
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }

    // Check address
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    // Start loading
    setIsPaymemntStart(true);

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,

      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,

        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,

        quantity: singleCartItem?.quantity,
      })),

      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },

      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    console.log("ORDER DATA:", orderData);

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log("CREATE ORDER RESPONSE:", data);

      if (
        data?.payload?.success &&
        data?.payload?.approvalURL
      ) {
        console.log(
          "PAYPAL APPROVAL URL:",
          data.payload.approvalURL
        );

        // Redirect to PayPal
        window.location.href = data.payload.approvalURL;
      } else {
        console.error(
          "PAYPAL ORDER CREATION FAILED:",
          data
        );

        setIsPaymemntStart(false);

        toast({
          title: "Unable to start PayPal payment",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-background">

      {/* ======================================
          CHECKOUT BANNER
      ====================================== */}

      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Banner Content */}
        <div className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-white/80">
              Secure Checkout
            </p>

            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      {/* ======================================
          CHECKOUT CONTENT
      ====================================== */}

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">

          {/* ==================================
              LEFT — SHIPPING ADDRESS
          ================================== */}

          <div className="min-w-0">
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={
                setCurrentSelectedAddress
              }
            />
          </div>

          {/* ==================================
              RIGHT — ORDER SUMMARY
          ================================== */}

          <div className="min-w-0 lg:sticky lg:top-6">

            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">

              {/* Heading */}

              <div className="mb-5">
                <h2 className="text-xl font-semibold">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Review your items before checkout
                </p>
              </div>

              {/* Cart Items */}

              <div className="space-y-3">
                {cartItems &&
                cartItems.items &&
                cartItems.items.length > 0 ? (
                  cartItems.items.map((item) => (
                    <UserCartItemsContent
                      key={
                        item?._id ||
                        item?.productId
                      }
                      cartItem={item}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed p-6 text-center">
                    <p className="font-medium">
                      Your cart is empty
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Add products to continue.
                    </p>
                  </div>
                )}
              </div>

              {/* Divider */}

              <div className="my-6 border-t" />

              {/* Total */}

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  Total
                </span>

                <span className="text-2xl font-bold">
                  ${totalCartAmount.toFixed(2)}
                </span>
              </div>

              {/* PayPal Button */}

              <Button
                onClick={handleInitiatePaypalPayment}
                className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
                disabled={isPaymentStart}
              >
                {isPaymentStart
                  ? "Processing PayPal Payment..."
                  : "Checkout with PayPal"}
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                You will be redirected to PayPal to complete
                your payment.
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;