import {
  BadgeCheck,
  Image,
  LayoutDashboard,
  ShoppingBasket,
  Store,
} from "lucide-react";

import { Fragment } from "react";
import { NavLink } from "react-router-dom";

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
    <nav className="space-y-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const Icon = menuItem.icon;

        return (
          <NavLink
            key={menuItem.id}
            to={menuItem.path}
            onClick={() => setOpen?.(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-foreground/10"
                      : "bg-muted/60 group-hover:bg-background"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <span className="flex-1">
                  {menuItem.label}
                </span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
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
      className="flex min-w-0 items-center gap-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Store className="h-5 w-5" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-bold tracking-tight">
          Admin Panel
        </p>

        <p className="text-xs text-muted-foreground">
          Store Management
        </p>
      </div>
    </NavLink>
  );
}

function AdminSideBar({ open, setOpen }) {
  return (
    <Fragment>
      {/* =========================================
          Mobile Sidebar
      ========================================= */}
      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetContent
          side="left"
          className="flex w-[280px] flex-col p-0 sm:w-[320px]"
        >
          <SheetHeader className="border-b px-5 py-5 text-left">
            <SheetTitle>
              <AdminBrand />
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-1 flex-col">
            <div className="flex-1 px-4 py-5">
              <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Navigation
              </p>

              <MenuItems setOpen={setOpen} />
            </div>

            <div className="border-t px-5 py-4">
              <p className="text-xs text-muted-foreground">
                Admin Dashboard
              </p>

              <p className="mt-1 text-xs font-medium">
                Store Management
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* =========================================
          Desktop Sidebar
      ========================================= */}
      <aside className="hidden w-64 shrink-0 border-r bg-background lg:flex lg:flex-col">
        {/* Brand */}
        <div className="border-b px-5 py-5">
          <AdminBrand />
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>

          <MenuItems />
        </div>

        {/* Bottom section */}
        <div className="border-t px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Admin Dashboard
          </p>

          <p className="mt-1 text-xs font-medium">
            Store Management
          </p>
        </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;