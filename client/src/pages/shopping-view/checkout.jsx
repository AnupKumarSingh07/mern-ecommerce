import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
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

  function handleInitiateRazorpayPayment() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!currentSelectedAddress) {
      toast({
        title: "Please select a delivery address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const activeUserId = user?.id || user?._id;
    if (!activeUserId) {
      toast({
        title: "User session not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsPaymentStart(true);

    const orderData = {
      userId: activeUserId,
      cartId: cartItems?._id || cartItems?.id || "",
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title || "Product",
        image: singleCartItem?.image || "",
        variantId: singleCartItem?.variantId || null,
        color: singleCartItem?.color || null,
        size: singleCartItem?.size || null,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price || 0,
        quantity: singleCartItem?.quantity || 1,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id || "",
        address: currentSelectedAddress?.address || "",
        city: currentSelectedAddress?.city || "",
        pincode: currentSelectedAddress?.pincode || "",
        phone: currentSelectedAddress?.phone || "",
        notes: currentSelectedAddress?.notes || "",
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((orderRes) => {
      if (orderRes?.payload?.success) {
        const { amount, currency, razorpayOrderId, orderId } = orderRes.payload;

        const razorpayKey =
          import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_your_key_id_here";

        const razorpayOptions = {
          key: razorpayKey,
          amount: amount,
          currency: currency,
          name: "The MeltingPoint Store",
          description: "Order Payment",
          image: img,
          order_id: razorpayOrderId,
          handler: function (response) {
            dispatch(
              capturePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId,
              })
            ).then((captureRes) => {
              setIsPaymentStart(false);
              if (captureRes?.payload?.success) {
                if (activeUserId) {
                  dispatch(fetchCartItems(activeUserId));
                }
                navigate("/shop/payment-success");
              } else {
                toast({
                  title: "Payment verification failed",
                  description:
                    captureRes?.payload?.message || "Please contact support",
                  variant: "destructive",
                });
              }
            });
          },
          prefill: {
            name: user?.userName || "",
            email: user?.email || "",
            contact: currentSelectedAddress?.phone || "",
          },
          theme: {
            color: "#18181b",
          },
          modal: {
            ondismiss: function () {
              setIsPaymentStart(false);
              toast({
                title: "Payment Cancelled",
                description: "You closed the payment window without completing.",
              });
            },
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      } else {
        setIsPaymentStart(false);
        toast({
          title: "Unable to initiate payment",
          description: orderRes?.payload?.message || "Please try again later.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
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

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="min-w-0">
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>

          <div className="min-w-0 lg:sticky lg:top-6">
            <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review your items before checkout
                </p>
              </div>

              <div className="space-y-3">
                {cartItems &&
                cartItems.items &&
                cartItems.items.length > 0 ? (
                  cartItems.items.map((item, index) => (
                    <UserCartItemsContent
                      key={`${item?.productId || "product"}-${
                        item?.variantId || "no-variant"
                      }-${index}`}
                      cartItem={item}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed p-6 text-center">
                    <p className="font-medium">Your cart is empty</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Add products to continue.
                    </p>
                  </div>
                )}
              </div>

              <div className="my-6 border-t" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  ₹{totalCartAmount.toFixed(2)}
                </span>
              </div>

              <Button
                onClick={handleInitiateRazorpayPayment}
                className="mt-6 h-12 w-full rounded-xl text-base font-semibold"
                disabled={isPaymentStart || totalCartAmount <= 0}
              >
                {isPaymentStart
                  ? "Processing Payment..."
                  : `Pay ₹${totalCartAmount.toFixed(2)} with Razorpay`}
              </Button>

              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secured by Razorpay. UPI, Cards, NetBanking, and Wallets accepted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;