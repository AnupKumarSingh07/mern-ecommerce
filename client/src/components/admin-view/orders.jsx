import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Button } from "../ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Dialog,
  DialogContent,
} from "../ui/dialog";

import {
  Package,
  ArrowRight,
} from "lucide-react";

import { Badge } from "../ui/badge";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";

import AdminOrderDetailsView from "./order-details";

function AdminOrdersView() {
  const [
    openDetailsDialog,
    setOpenDetailsDialog,
  ] = useState(false);

  const {
    orderList,
    orderDetails,
    isLoading,
    error,
  } = useSelector(
    (state) =>
      state.adminOrder
  );

  const dispatch = useDispatch();

  // ===============================================
  // FETCH ORDERS
  // ===============================================

  useEffect(() => {
    dispatch(
      getAllOrdersForAdmin()
    );
  }, [dispatch]);

  // ===============================================
  // OPEN DETAILS
  // ===============================================

  useEffect(() => {
    if (orderDetails) {
      setOpenDetailsDialog(
        true
      );
    }
  }, [orderDetails]);

  function handleFetchOrderDetails(
    id
  ) {
    if (!id) return;

    dispatch(
      getOrderDetailsForAdmin(id)
    );
  }

  function handleCloseDialog() {
    setOpenDetailsDialog(false);

    dispatch(
      resetOrderDetails()
    );
  }

  // ===============================================
  // STATUS STYLE
  // ===============================================

  function getStatusClasses(
    status
  ) {
    switch (status) {
      case "confirmed":
        return "border-green-200 bg-green-50 text-green-700";

      case "inProcess":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "inShipping":
        return "border-purple-200 bg-purple-50 text-purple-700";

      case "delivered":
        return "border-green-200 bg-green-50 text-green-700";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";

      case "pending":
      default:
        return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }
  }

  function formatOrderDate(
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

  return (
    <>
      <Card className="w-full">
        <CardHeader className="border-b px-5 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                All Orders
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage all customer orders
              </p>
            </div>

            {orderList.length >
              0 && (
              <div className="rounded-full border bg-muted/40 px-4 py-2 text-sm">
                <span className="font-medium">
                  {orderList.length}{" "}
                  {orderList.length ===
                  1
                    ? "Order"
                    : "Orders"}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-6">
          {/* LOADING */}
          {isLoading &&
          orderList.length ===
            0 ? (
            <div className="px-6 py-10 text-center text-muted-foreground">
              Loading orders...
            </div>
          ) : null}

          {/* ERROR */}
          {!isLoading &&
          error ? (
            <div className="mx-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {/* EMPTY */}
          {!isLoading &&
          !error &&
          orderList.length ===
            0 ? (
            <div className="px-6 py-12 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

              <h3 className="font-semibold">
                No orders found
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Orders will appear here after a customer places an order.
              </p>
            </div>
          ) : null}

          {/* ORDERS */}
          {orderList.length >
            0 ? (
            <div className="overflow-hidden rounded-2xl border mx-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Order ID
                    </TableHead>

                    <TableHead>
                      Order Date
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead className="text-right">
                      Price
                    </TableHead>

                    <TableHead className="text-right">
                      Details
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orderList.map(
                    (order) => (
                      <TableRow
                        key={
                          order?._id
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                              <Package className="h-4 w-4" />
                            </div>

                            <div>
                              <p className="font-medium">
                                Order
                              </p>

                              <p
                                className="max-w-[180px] truncate text-xs text-muted-foreground"
                                title={
                                  order?._id
                                }
                              >
                                #
                                {
                                  order?._id
                                }
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {formatOrderDate(
                            order?.orderDate
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`capitalize ${getStatusClasses(
                              order?.orderStatus
                            )}`}
                          >
                            {order?.orderStatus ||
                              "N/A"}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right font-semibold">
                          ₹
                          {Number(
                            order?.totalAmount ||
                              0
                          ).toFixed(2)}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleFetchOrderDetails(
                                order?._id
                              )
                            }
                          >
                            View
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog
        open={
          openDetailsDialog
        }
        onOpenChange={
          (open) => {
            if (!open) {
              handleCloseDialog();
            }
          }
        }
      >
        {orderDetails && (
          <AdminOrderDetailsView
            orderDetails={
              orderDetails
            }
          />
        )}
      </Dialog>
    </>
  );
}

export default AdminOrdersView;