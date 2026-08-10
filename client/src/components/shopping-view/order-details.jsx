import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  function formatOrderDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClasses(status) {
    switch (status) {
      case "confirmed":
        return "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400";

      case "pending":
        return "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-400";

      case "delivered":
        return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400";

      default:
        return "border-muted bg-muted text-muted-foreground";
    }
  }

  return (
    <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl p-0 sm:w-full">
      {/* Header */}
      <DialogHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <DialogTitle className="text-lg font-bold sm:text-xl">
              Order Details
            </DialogTitle>

            <p
              className="mt-1 max-w-[250px] truncate text-xs text-muted-foreground sm:max-w-md"
              title={orderDetails?._id}
            >
              Order #{orderDetails?._id}
            </p>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6 px-5 py-5 sm:px-6 sm:py-6">
        {/* Order Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Order Date */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />

              <span className="text-xs font-medium">
                Order Date
              </span>
            </div>

            <p className="mt-2 text-sm font-semibold">
              {formatOrderDate(orderDetails?.orderDate)}
            </p>
          </div>

          {/* Order Price */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />

              <span className="text-xs font-medium">
                Order Total
              </span>
            </div>

            <p className="mt-2 text-lg font-bold">
              ${Number(orderDetails?.totalAmount || 0).toFixed(2)}
            </p>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />

              <span className="text-xs font-medium">
                Payment Method
              </span>
            </div>

            <p className="mt-2 text-sm font-semibold capitalize">
              {orderDetails?.paymentMethod || "N/A"}
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="rounded-xl border bg-card p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Order Status
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Current status of your order
              </p>
            </div>

            <Badge
              variant="outline"
              className={`w-fit rounded-full px-4 py-1.5 text-xs font-medium capitalize ${getStatusClasses(
                orderDetails?.orderStatus
              )}`}
            >
              {orderDetails?.orderStatus || "N/A"}
            </Badge>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Payment Status
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Current payment status
              </p>
            </div>

            <Badge
              variant="outline"
              className="w-fit rounded-full px-4 py-1.5 text-xs font-medium capitalize"
            >
              {orderDetails?.paymentStatus || "N/A"}
            </Badge>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-base font-semibold">
                Order Items
              </h3>

              <p className="text-xs text-muted-foreground">
                Products included in this order
              </p>
            </div>
          </div>

          {orderDetails?.cartItems &&
          orderDetails.cartItems.length > 0 ? (
            <div className="space-y-3">
              {orderDetails.cartItems.map((item, index) => (
                <div
                  key={item?.productId || item?._id || index}
                  className="flex flex-col gap-4 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Product Image */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                      {item?.image ? (
                        <img
                          src={item.image}
                          alt={item?.title || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {item?.title}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Quantity: {item?.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Price
                    </p>

                    <p className="text-sm font-bold">
                      $
                      {(
                        Number(item?.price || 0) *
                        Number(item?.quantity || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No order items found.
              </p>
            </div>
          )}
        </div>

        {/* Shipping Information */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-base font-semibold">
                Shipping Information
              </h3>

              <p className="text-xs text-muted-foreground">
                Delivery address for this order
              </p>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            {/* Customer */}
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {user?.userName || "N/A"}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Address
                </p>

                <p className="mt-1 text-sm font-medium">
                  {orderDetails?.addressInfo?.address || "N/A"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {orderDetails?.addressInfo?.city},{" "}
                  {orderDetails?.addressInfo?.pincode}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium">
                  {orderDetails?.addressInfo?.phone || "N/A"}
                </p>
              </div>
            </div>

            {/* Notes */}
            {orderDetails?.addressInfo?.notes && (
              <>
                <Separator className="my-4" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Delivery Notes
                  </p>

                  <p className="mt-1 text-sm">
                    {orderDetails.addressInfo.notes}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Final Total */}
        <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Total Amount
            </span>

            <span className="text-2xl font-bold">
              ${Number(orderDetails?.totalAmount || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;