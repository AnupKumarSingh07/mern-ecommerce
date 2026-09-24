import {
  useState,
} from "react";

import {
  DialogContent,
} from "../ui/dialog";

import {
  Label,
} from "../ui/label";

import {
  Separator,
} from "../ui/separator";

import {
  Badge,
} from "../ui/badge";

import {
  useDispatch,
} from "react-redux";

import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";

import {
  useToast,
} from "../ui/use-toast";

import CommonForm from "../common/form";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({
  orderDetails,
}) {
  const [
    formData,
    setFormData,
  ] = useState(
    initialFormData
  );

  const dispatch =
    useDispatch();

  const {
    toast,
  } = useToast();

  // ===============================================
  // UPDATE STATUS
  // ===============================================

  function handleUpdateStatus(
    event
  ) {
    event.preventDefault();

    const status =
      formData.status;

    if (!status) {
      toast({
        title:
          "Please select an order status.",
        variant:
          "destructive",
      });

      return;
    }

    dispatch(
      updateOrderStatus({
        id: orderDetails?._id,
        orderStatus: status,
      })
    ).then((result) => {
      if (
        result?.payload?.success
      ) {
        dispatch(
          getOrderDetailsForAdmin(
            orderDetails?._id
          )
        );

        dispatch(
          getAllOrdersForAdmin()
        );

        setFormData(
          initialFormData
        );

        toast({
          title:
            result.payload
              .message,
        });
      } else {
        toast({
          title:
            result?.payload
              ?.message ||
            "Failed to update order status.",
          variant:
            "destructive",
        });
      }
    });
  }

  function formatDate(
    date
  ) {
    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getStatusClass(
    status
  ) {
    switch (status) {
      case "confirmed":
        return "bg-green-500";

      case "inProcess":
        return "bg-blue-500";

      case "inShipping":
        return "bg-purple-500";

      case "delivered":
        return "bg-green-600";

      case "rejected":
        return "bg-red-600";

      default:
        return "bg-yellow-500";
    }
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">

        {/* ========================================= */}
        {/* ORDER INFORMATION */}
        {/* ========================================= */}

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">
              Order ID
            </p>

            <Label>
              {orderDetails?._id ||
                "N/A"}
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">
              Order Date
            </p>

            <Label>
              {formatDate(
                orderDetails?.orderDate
              )}
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">
              Order Price
            </p>

            <Label>
              ₹
              {Number(
                orderDetails?.totalAmount ||
                  0
              ).toFixed(2)}
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">
              Payment Method
            </p>

            <Label className="capitalize">
              {orderDetails?.paymentMethod ||
                "N/A"}
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">
              Payment Status
            </p>

            <Label className="capitalize">
              {orderDetails?.paymentStatus ||
                "N/A"}
            </Label>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-medium">
              Order Status
            </p>

            <Badge
              className={`py-1 px-3 capitalize ${getStatusClass(
                orderDetails?.orderStatus
              )}`}
            >
              {orderDetails?.orderStatus ||
                "N/A"}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* ========================================= */}
        {/* CUSTOMER */}
        {/* ========================================= */}

        <div className="grid gap-2">
          <div className="font-medium">
            Customer
          </div>

          <div className="grid gap-1 text-sm text-muted-foreground">
            <span>
              Name:{" "}
              {orderDetails?.customerName ||
                orderDetails?.userName ||
                "Customer"}
            </span>

            {orderDetails?.customerEmail && (
              <span>
                Email:{" "}
                {
                  orderDetails.customerEmail
                }
              </span>
            )}
          </div>
        </div>

        {/* ========================================= */}
        {/* ORDER ITEMS */}
        {/* ========================================= */}

        <div className="grid gap-4">
          <div className="font-medium">
            Order Details
          </div>

          <ul className="grid gap-3">
            {orderDetails?.cartItems
              ?.length > 0 ? (
              orderDetails.cartItems.map(
                (
                  item,
                  index
                ) => (
                  <li
                    key={
                      item?.variantId ||
                      `${item?.productId}-${index}`
                    }
                    className="flex flex-col gap-1 rounded-lg border p-3 text-sm"
                  >
                    <div className="flex justify-between gap-4">
                      <span className="font-medium">
                        {item?.title ||
                          "Product"}
                      </span>

                      <span>
                        ₹
                        {Number(
                          item?.price ||
                            0
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-muted-foreground">
                      <span>
                        Quantity:{" "}
                        {
                          item?.quantity
                        }
                      </span>

                      {item?.color && (
                        <span>
                          Color:{" "}
                          {
                            item.color
                          }
                        </span>
                      )}

                      {item?.size && (
                        <span>
                          Size:{" "}
                          {
                            item.size
                          }
                        </span>
                      )}
                    </div>
                  </li>
                )
              )
            ) : (
              <li className="text-sm text-muted-foreground">
                No items found.
              </li>
            )}
          </ul>
        </div>

        {/* ========================================= */}
        {/* SHIPPING */}
        {/* ========================================= */}

        <div className="grid gap-2">
          <div className="font-medium">
            Shipping Info
          </div>

          <div className="grid gap-1 text-sm text-muted-foreground">
            <span>
              {orderDetails?.addressInfo?.address ||
                "N/A"}
            </span>

            <span>
              {orderDetails?.addressInfo?.city ||
                "N/A"}
            </span>

            <span>
              PIN:{" "}
              {orderDetails?.addressInfo?.pincode ||
                "N/A"}
            </span>

            <span>
              Phone:{" "}
              {orderDetails?.addressInfo?.phone ||
                "N/A"}
            </span>

            {orderDetails?.addressInfo?.notes && (
              <span>
                Notes:{" "}
                {
                  orderDetails
                    .addressInfo
                    .notes
                }
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* ========================================= */}
        {/* UPDATE STATUS */}
        {/* ========================================= */}

        <CommonForm
          formControls={[
            {
              label:
                "Order Status",

              name:
                "status",

              componentType:
                "select",

              options: [
                {
                  id: "pending",
                  label: "Pending",
                },
                {
                  id: "confirmed",
                  label: "Confirmed",
                },
                {
                  id: "inProcess",
                  label: "In Process",
                },
                {
                  id: "inShipping",
                  label: "In Shipping",
                },
                {
                  id: "delivered",
                  label: "Delivered",
                },
                {
                  id: "rejected",
                  label: "Rejected",
                },
              ],
            },
          ]}
          formData={
            formData
          }
          setFormData={
            setFormData
          }
          buttonText="Update Order Status"
          onSubmit={
            handleUpdateStatus
          }
        />
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;