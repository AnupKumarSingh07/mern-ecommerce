import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Image,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { getFeatureImages } from "@/store/common-slice";

function AdminDashboard() {
  const dispatch = useDispatch();

  const { productList = [] } = useSelector(
    (state) => state.adminProducts
  );

  const { orderList = [] } = useSelector(
    (state) => state.adminOrder
  );

  const { featureImageList = [] } = useSelector(
    (state) => state.commonFeature
  );

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
    dispatch(getFeatureImages());
  }, [dispatch]);

  // --------------------------------------------------
  // DASHBOARD STATISTICS
  // --------------------------------------------------

  const dashboardStats = useMemo(() => {
    const totalProducts = productList.length;
    const totalOrders = orderList.length;
    const totalBanners = featureImageList.length;

    const totalRevenue = orderList.reduce((total, order) => {
      return total + Number(order?.totalAmount || 0);
    }, 0);

    const pendingOrders = orderList.filter(
      (order) => order?.orderStatus === "pending"
    ).length;

    const confirmedOrders = orderList.filter(
      (order) => order?.orderStatus === "confirmed"
    ).length;

    const deliveredOrders = orderList.filter(
      (order) => order?.orderStatus === "delivered"
    ).length;

    const rejectedOrders = orderList.filter(
      (order) => order?.orderStatus === "rejected"
    ).length;

    return {
      totalProducts,
      totalOrders,
      totalBanners,
      totalRevenue,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      rejectedOrders,
    };
  }, [productList, orderList, featureImageList]);

  // --------------------------------------------------
  // RECENT ORDERS
  // --------------------------------------------------

  const recentOrders = useMemo(() => {
    return [...orderList]
      .sort(
        (a, b) =>
          new Date(b?.orderDate || b?.createdAt) -
          new Date(a?.orderDate || a?.createdAt)
      )
      .slice(0, 5);
  }, [orderList]);

  // --------------------------------------------------
  // STAT CARD
  // --------------------------------------------------

  const statCards = [
    {
      title: "Total Products",
      value: dashboardStats.totalProducts,
      description: "Products in store",
      icon: Package,
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
      description: "Orders received",
      icon: ShoppingBag,
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardStats.totalRevenue.toLocaleString("en-IN")}`,
      description: "Revenue from orders",
      icon: IndianRupee,
    },
    {
      title: "Banners",
      value: dashboardStats.totalBanners,
      description: "Active feature banners",
      icon: Image,
    },
  ];

  // --------------------------------------------------
  // ORDER STATUS CARDS
  // --------------------------------------------------

  const orderStatusCards = [
    {
      title: "Pending",
      value: dashboardStats.pendingOrders,
      icon: Clock3,
    },
    {
      title: "Confirmed",
      value: dashboardStats.confirmedOrders,
      icon: CheckCircle2,
    },
    {
      title: "Delivered",
      value: dashboardStats.deliveredOrders,
      icon: Truck,
    },
    {
      title: "Rejected",
      value: dashboardStats.rejectedOrders,
      icon: XCircle,
    },
  ];

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  function getStatusClass(status) {
    switch (status) {
      case "confirmed":
        return "bg-green-500 text-white hover:bg-green-500";

      case "delivered":
        return "bg-blue-600 text-white hover:bg-blue-600";

      case "rejected":
        return "bg-red-600 text-white hover:bg-red-600";

      case "pending":
        return "bg-yellow-500 text-black hover:bg-yellow-500";

      default:
        return "bg-muted text-foreground";
    }
  }

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------
          PAGE HEADER
      ------------------------------------------------ */}

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Admin Panel
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back, {user?.userName || "Admin"}. Here's what's
          happening with your store.
        </p>
      </div>

      {/* ------------------------------------------------
          STAT CARDS
      ------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                      {item.value}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ------------------------------------------------
          ORDER STATUS
      ------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>Order Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderStatusCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-xl border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      {item.title}
                    </p>

                    <p className="text-2xl font-bold">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------
          RECENT ORDERS
      ------------------------------------------------ */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest orders received by your store
              </p>
            </div>

            <Badge variant="secondary">
              {orderList.length} Total
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const orderDate =
                  order?.orderDate || order?.createdAt;

                return (
                  <div
                    key={order?._id}
                    className="
                      flex
                      flex-col
                      gap-3
                      rounded-xl
                      border
                      p-4
                      transition-colors
                      hover:bg-muted/40
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    {/* Order ID */}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        Order
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        #{order?._id}
                      </p>
                    </div>

                    {/* Date */}

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order Date
                      </p>

                      <p className="text-sm font-medium">
                        {orderDate
                          ? new Date(
                              orderDate
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </p>
                    </div>

                    {/* Status */}

                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">
                        Status
                      </p>

                      <Badge
                        className={getStatusClass(
                          order?.orderStatus
                        )}
                      >
                        {order?.orderStatus || "Unknown"}
                      </Badge>
                    </div>

                    {/* Amount */}

                    <div className="sm:text-right">
                      <p className="text-xs text-muted-foreground">
                        Amount
                      </p>

                      <p className="text-sm font-bold">
                        ₹
                        {Number(
                          order?.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 font-semibold">
                No orders yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Orders will appear here once customers start
                purchasing products.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;