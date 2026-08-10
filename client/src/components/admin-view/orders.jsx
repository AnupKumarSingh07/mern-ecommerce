import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { ArrowRight, Package, ShoppingBag } from "lucide-react";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { orderList, orderDetails } = useSelector(
    (state) => state.adminOrder
  );

  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  function handleCloseDialog() {
    setOpenDetailsDialog(false);
    dispatch(resetOrderDetails());
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

  function formatOrderDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <>
      <Card className="w-full">
        {/* Header */}
        <CardHeader className="border-b px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                All Orders
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage all customer orders
              </p>
            </div>

            {orderList && orderList.length > 0 && (
              <div className="flex w-fit items-center gap-2 rounded-full border bg-muted/40 px-4 py-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />

                <span className="font-medium">
                  {orderList.length}{" "}
                  {orderList.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-6">
          {orderList && orderList.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-hidden rounded-2xl border md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="px-5 py-4 font-semibold">
                        Order ID
                      </TableHead>

                      <TableHead className="px-5 py-4 font-semibold">
                        Order Date
                      </TableHead>

                      <TableHead className="px-5 py-4 font-semibold">
                        Order Status
                      </TableHead>

                      <TableHead className="px-5 py-4 text-right font-semibold">
                        Order Price
                      </TableHead>

                      <TableHead className="px-5 py-4 text-right font-semibold">
                        Details
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orderList.map((orderItem) => (
                      <TableRow
                        key={orderItem?._id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        {/* Order ID */}
                        <TableCell className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold">
                                Order
                              </p>

                              <p
                                className="max-w-[180px] truncate text-xs text-muted-foreground"
                                title={orderItem?._id}
                              >
                                #{orderItem?._id}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Order Date */}
                        <TableCell className="px-5 py-5 text-sm text-muted-foreground">
                          {formatOrderDate(orderItem?.orderDate)}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-5 py-5">
                          <Badge
                            variant="outline"
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(
                              orderItem?.orderStatus
                            )}`}
                          >
                            {orderItem?.orderStatus || "N/A"}
                          </Badge>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="px-5 py-5 text-right">
                          <span className="font-semibold">
                            $
                            {Number(
                              orderItem?.totalAmount || 0
                            ).toFixed(2)}
                          </span>
                        </TableCell>

                        {/* Details */}
                        <TableCell className="px-5 py-5 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() =>
                              handleFetchOrderDetails(
                                orderItem?._id
                              )
                            }
                          >
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Order Cards */}
              <div className="space-y-4 px-4 md:hidden">
                {orderList.map((orderItem) => (
                  <div
                    key={orderItem?._id}
                    className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            Order
                          </p>

                          <p
                            className="truncate text-xs text-muted-foreground"
                            title={orderItem?._id}
                          >
                            #{orderItem?._id}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(
                          orderItem?.orderStatus
                        )}`}
                      >
                        {orderItem?.orderStatus || "N/A"}
                      </Badge>
                    </div>

                    {/* Order Information */}
                    <div className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-muted/40 p-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Order Date
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatOrderDate(
                            orderItem?.orderDate
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-bold">
                          $
                          {Number(
                            orderItem?.totalAmount || 0
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Details Button */}
                    <Button
                      variant="outline"
                      className="mt-4 h-11 w-full rounded-xl"
                      onClick={() =>
                        handleFetchOrderDetails(
                          orderItem?._id
                        )
                      }
                    >
                      View Order Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <ShoppingBag className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No orders found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Customer orders will appear here once they place
                an order.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog
        open={openDetailsDialog}
        onOpenChange={handleCloseDialog}
      >
        <AdminOrderDetailsView orderDetails={orderDetails} />
      </Dialog>
    </>
  );
}

export default AdminOrdersView;