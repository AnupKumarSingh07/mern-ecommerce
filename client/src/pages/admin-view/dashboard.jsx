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
  TrendingUp,
  ArrowUpRight,
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
  // MONTHLY ANALYTICS
  // --------------------------------------------------

  const monthlyAnalytics = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (5 - index),
        1
      );

      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleString("en-IN", {
          month: "short",
        }),
        revenue: 0,
        orders: 0,
      };
    });

    orderList.forEach((order) => {
      const orderDateValue =
        order?.orderDate || order?.createdAt;

      if (!orderDateValue) return;

      const orderDate = new Date(orderDateValue);

      if (Number.isNaN(orderDate.getTime())) return;

      const matchingMonth = months.find(
        (item) =>
          item.year === orderDate.getFullYear() &&
          item.month === orderDate.getMonth()
      );

      if (!matchingMonth) return;

      matchingMonth.orders += 1;
      matchingMonth.revenue += Number(order?.totalAmount || 0);
    });

    return months;
  }, [orderList]);

  const analyticsSummary = useMemo(() => {
    const revenue = monthlyAnalytics.reduce(
      (total, month) => total + month.revenue,
      0
    );

    const orders = monthlyAnalytics.reduce(
      (total, month) => total + month.orders,
      0
    );

    const averageOrderValue =
      orders > 0 ? revenue / orders : 0;

    const bestMonth = monthlyAnalytics.reduce(
      (best, month) =>
        month.revenue > best.revenue ? month : best,
      {
        label: "-",
        revenue: 0,
        orders: 0,
      }
    );

    return {
      revenue,
      orders,
      averageOrderValue,
      bestMonth,
    };
  }, [monthlyAnalytics]);

  // --------------------------------------------------
  // CHART VALUES
  // --------------------------------------------------

  const chartData = useMemo(() => {
    const width = 700;
    const height = 230;
    const paddingX = 20;
    const paddingY = 25;

    const maxRevenue = Math.max(
      ...monthlyAnalytics.map((item) => item.revenue),
      1
    );

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;

    const points = monthlyAnalytics.map((item, index) => {
      const x =
        monthlyAnalytics.length === 1
          ? width / 2
          : paddingX +
            (index / (monthlyAnalytics.length - 1)) *
              usableWidth;

      const y =
        height -
        paddingY -
        (item.revenue / maxRevenue) * usableHeight;

      return {
        ...item,
        x,
        y,
      };
    });

    const linePath = points
      .map((point, index) => {
        return `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ");

    const areaPath = `
      ${linePath}
      L ${points[points.length - 1]?.x || width - paddingX} ${height - paddingY}
      L ${points[0]?.x || paddingX} ${height - paddingY}
      Z
    `;

    return {
      points,
      linePath,
      areaPath,
      maxRevenue,
    };
  }, [monthlyAnalytics]);

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
  // STAT CARDS
  // --------------------------------------------------

  const statCards = [
    {
      title: "Total Products",
      value: dashboardStats.totalProducts,
      description: "Products in store",
      icon: Package,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
      description: "Orders received",
      icon: ShoppingBag,
      iconClass: "bg-violet-50 text-violet-600",
    },
    {
      title: "Total Revenue",
      value: `₹${dashboardStats.totalRevenue.toLocaleString(
        "en-IN"
      )}`,
      description: "Revenue from orders",
      icon: IndianRupee,
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Banners",
      value: dashboardStats.totalBanners,
      description: "Active feature banners",
      icon: Image,
      iconClass: "bg-orange-50 text-orange-600",
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
      className: "text-amber-600 bg-amber-50",
    },
    {
      title: "Confirmed",
      value: dashboardStats.confirmedOrders,
      icon: CheckCircle2,
      className: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Delivered",
      value: dashboardStats.deliveredOrders,
      icon: Truck,
      className: "text-blue-600 bg-blue-50",
    },
    {
      title: "Rejected",
      value: dashboardStats.rejectedOrders,
      icon: XCircle,
      className: "text-red-600 bg-red-50",
    },
  ];

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  function getStatusClass(status) {
    switch (status) {
      case "confirmed":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "delivered":
        return "border-blue-200 bg-blue-50 text-blue-700";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";

      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      default:
        return "border-slate-200 bg-slate-50 text-slate-600";
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          Overview
        </p>

        <div className="mt-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-[28px]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back, {user?.userName || "Admin"}. Here's what's
            happening with your store.
          </p>
        </div>
      </section>

      {/* ==================================================
          KPI CARDS
      ================================================== */}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="
                overflow-hidden
                rounded-2xl
                border-slate-200/80
                bg-white
                shadow-[0_2px_12px_rgba(15,23,42,0.04)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]
              "
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-slate-500">
                      {item.title}
                    </p>

                    <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-900">
                      {item.value}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* ==================================================
          ANALYTICS
      ================================================== */}

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)]">
        {/* Revenue Chart */}

        <Card
          className="
            overflow-hidden
            rounded-2xl
            border-slate-200/80
            bg-white
            shadow-[0_2px_12px_rgba(15,23,42,0.04)]
          "
        >
          <CardHeader className="px-5 pb-0 pt-5 md:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  Revenue & Orders
                </CardTitle>

                <p className="mt-1 text-xs text-slate-400">
                  Store performance over the last 6 months
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />

                <span className="text-[11px] font-semibold text-emerald-700">
                  ₹
                  {analyticsSummary.revenue.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-5 pb-5 pt-4 md:px-6">
            <div className="h-[250px] w-full">
              <svg
                viewBox="0 0 700 250"
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Grid */}

                {[0, 1, 2, 3].map((line) => {
                  const y = 25 + line * 66.66;

                  return (
                    <line
                      key={line}
                      x1="20"
                      x2="680"
                      y1={y}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 5"
                    />
                  );
                })}

                {/* Area */}

                <path
                  d={chartData.areaPath}
                  fill="url(#revenueGradient)"
                  opacity="0.45"
                />

                {/* Line */}

                <path
                  d={chartData.linePath}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}

                {chartData.points.map((point) => (
                  <g key={`${point.year}-${point.month}`}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#ffffff"
                      stroke="#6366f1"
                      strokeWidth="3"
                    />
                  </g>
                ))}

                {/* Gradient */}

                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366f1"
                      stopOpacity="0.25"
                    />

                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Month Labels */}

            <div className="mt-1 grid grid-cols-6">
              {monthlyAnalytics.map((month) => (
                <div
                  key={`${month.year}-${month.month}`}
                  className="text-center text-[10px] font-medium text-slate-400"
                >
                  {month.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sales Summary */}

        <Card
          className="
            rounded-2xl
            border-slate-200/80
            bg-white
            shadow-[0_2px_12px_rgba(15,23,42,0.04)]
          "
        >
          <CardHeader className="px-5 pb-2 pt-5">
            <CardTitle className="text-base font-semibold text-slate-900">
              Sales Summary
            </CardTitle>

            <p className="mt-1 text-xs text-slate-400">
              Quick performance snapshot
            </p>
          </CardHeader>

          <CardContent className="px-5 pb-5">
            <div className="space-y-3">
              <div className="rounded-xl bg-indigo-50/70 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500">
                  Revenue
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  ₹
                  {analyticsSummary.revenue.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Orders
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {analyticsSummary.orders}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] text-slate-400">
                    Avg. Order
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    ₹
                    {Math.round(
                      analyticsSummary.averageOrderValue
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="text-[10px] text-slate-400">
                    Best Month
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {analyticsSummary.bestMonth.label}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ==================================================
          ORDER OVERVIEW
      ================================================== */}

      <Card
        className="
          rounded-2xl
          border-slate-200/80
          bg-white
          shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        "
      >
        <CardHeader className="px-5 pb-3 pt-5 md:px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Order Overview
              </CardTitle>

              <p className="mt-1 text-xs text-slate-400">
                Current order status across your store
              </p>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 sm:flex">
              <ShoppingBag className="h-3.5 w-3.5 text-slate-400" />

              <span className="text-[11px] font-medium text-slate-500">
                {dashboardStats.totalOrders} orders
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 md:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {orderStatusCards.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-slate-100
                    bg-slate-50/60
                    p-3.5
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.className}`}
                  >
                    <Icon className="h-[17px] w-[17px]" />
                  </div>

                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ==================================================
          RECENT ORDERS
      ================================================== */}

      <Card
        className="
          rounded-2xl
          border-slate-200/80
          bg-white
          shadow-[0_2px_12px_rgba(15,23,42,0.04)]
        "
      >
        <CardHeader className="px-5 pb-4 pt-5 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Recent Orders
              </CardTitle>

              <p className="mt-1 text-xs text-slate-400">
                Latest orders received by your store
              </p>
            </div>

            <Badge
              variant="secondary"
              className="rounded-full border-0 bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-600"
            >
              {orderList.length} Total
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 md:px-6">
          {recentOrders.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <div
                className="
                  hidden
                  grid-cols-[1.5fr_1fr_1fr_1fr]
                  border-b
                  border-slate-100
                  bg-slate-50/70
                  px-4
                  py-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-400
                  md:grid
                "
              >
                <span>Order</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-right">Amount</span>
              </div>

              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => {
                  const orderDate =
                    order?.orderDate || order?.createdAt;

                  return (
                    <div
                      key={order?._id}
                      className="
                        grid
                        gap-3
                        px-4
                        py-4
                        transition-colors
                        hover:bg-slate-50/70
                        md:grid-cols-[1.5fr_1fr_1fr_1fr]
                        md:items-center
                      "
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800">
                          Order
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          #{order?._id}
                        </p>
                      </div>

                      <div>
                        <p className="mb-0.5 text-[10px] text-slate-400 md:hidden">
                          Date
                        </p>

                        <p className="text-xs font-medium text-slate-600">
                          {orderDate
                            ? new Date(
                                orderDate
                              ).toLocaleDateString("en-IN")
                            : "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="mb-0.5 text-[10px] text-slate-400 md:hidden">
                          Status
                        </p>

                        <Badge
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize shadow-none ${getStatusClass(
                            order?.orderStatus
                          )}`}
                        >
                          {order?.orderStatus || "Unknown"}
                        </Badge>
                      </div>

                      <div className="md:text-right">
                        <p className="mb-0.5 text-[10px] text-slate-400 md:hidden">
                          Amount
                        </p>

                        <p className="text-xs font-bold text-slate-800">
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
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50">
                <ShoppingBag className="h-5 w-5 text-slate-400" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                No orders yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
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