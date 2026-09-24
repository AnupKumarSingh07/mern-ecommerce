import {
  BadgeCheck,
  Image,
  LayoutDashboard,
  LogOut,
  ShoppingBasket,
  Store,
  UserCircle2,
} from "lucide-react";

import { Fragment } from "react";
import { NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: ShoppingBasket,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: BadgeCheck,
  },
  {
    id: "features",
    label: "Banners",
    path: "/admin/features",
    icon: Image,
  },
];

function MenuItems({ setOpen }) {
  return (
    <nav className="space-y-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;

        return (
          <NavLink
            key={menuItem.id}
            to={menuItem.path}
            onClick={() => setOpen?.(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/[0.14] text-white"
                  : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-indigo-400" />
                )}

                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-indigo-500 text-white"
                      : "bg-white/[0.045] text-slate-400 group-hover:bg-white/[0.07] group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-[17px] w-[17px]" />
                </span>

                <span className="flex-1">{menuItem.label}</span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-300" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function AdminBrand() {
  return (
    <NavLink
      to="/admin/dashboard"
      className="group flex min-w-0 items-center gap-3"
    >
      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-br
          from-indigo-500
          to-violet-600
          text-white
          shadow-md
          shadow-indigo-500/20
          transition-transform
          duration-200
          group-hover:scale-[1.03]
        "
      >
        <Store className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold tracking-tight text-white">
          The MeltingPoint
        </p>

        <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Admin
        </p>
      </div>
    </NavLink>
  );
}

function AdminProfile({ onLogout }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="border-t border-white/[0.07] p-3">
      <p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Account
      </p>

      <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.05] bg-white/[0.035] p-2">
        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-indigo-500/15
            text-indigo-300
          "
        >
          <UserCircle2 className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-slate-100">
            {user?.userName || "Admin"}
          </p>

          <p className="mt-0.5 text-[10px] text-slate-500">
            Administrator
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="
          group
          mt-1.5
          flex
          w-full
          items-center
          gap-2.5
          rounded-lg
          px-3
          py-2
          text-[13px]
          font-medium
          text-slate-400
          transition-all
          duration-200
          hover:bg-red-500/[0.08]
          hover:text-red-300
        "
      >
        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-white/[0.04]
            transition-colors
            group-hover:bg-red-500/[0.10]
          "
        >
          <LogOut className="h-[17px] w-[17px]" />
        </span>

        <span>Logout</span>
      </button>
    </div>
  );
}

function AdminSideBar({ open, setOpen }) {
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <Fragment>
      {/* MOBILE SIDEBAR */}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="
            flex
            w-[260px]
            flex-col
            border-r
            border-white/[0.07]
            bg-[#111827]
            p-0
            text-white
            sm:w-[280px]
          "
        >
          <SheetHeader className="border-b border-white/[0.07] px-4 py-4 text-left">
            <SheetTitle className="text-left">
              <AdminBrand />
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-3 py-5">
              <p className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                General
              </p>

              <MenuItems setOpen={setOpen} />
            </div>

            <AdminProfile onLogout={handleLogout} />
          </div>
        </SheetContent>
      </Sheet>

      {/* DESKTOP SIDEBAR */}

      <aside
        className="
          hidden
          w-[232px]
          shrink-0
          border-r
          border-slate-800/80
          bg-[#111827]
          lg:flex
          lg:flex-col
        "
      >
        {/* Brand */}

        <div className="border-b border-white/[0.07] px-4 py-4">
          <AdminBrand />
        </div>

        {/* Navigation */}

        <div className="flex-1 px-3 py-5">
          <p className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            General
          </p>

          <MenuItems />
        </div>

        {/* Profile + Logout */}

        <AdminProfile onLogout={handleLogout} />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;