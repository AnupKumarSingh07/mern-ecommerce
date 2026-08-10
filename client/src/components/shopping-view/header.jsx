import {
  HousePlug,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback } from "../ui/avatar";

import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";

import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems({ mobile = false, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem(
      "filters",
      JSON.stringify(currentFilter)
    );

    if (
      location.pathname.includes("listing") &&
      currentFilter !== null
    ) {
      setSearchParams(
        new URLSearchParams(
          `?category=${getCurrentMenuItem.id}`
        )
      );
    } else {
      navigate(getCurrentMenuItem.path);
    }

    onNavigate?.();
  }

  function isMenuItemActive(menuItem) {
    const currentCategory = searchParams.get("category");

    // Home
    if (menuItem.id === "home") {
      return location.pathname === "/shop/home";
    }

    // Products
    if (menuItem.id === "products") {
      return (
        location.pathname === "/shop/listing" &&
        !currentCategory
      );
    }

    // Search
    if (menuItem.id === "search") {
      return location.pathname === "/shop/search";
    }

    // Category items
    if (location.pathname === "/shop/listing") {
      return currentCategory === menuItem.id;
    }

    return false;
  }

  return (
    <nav
      className={
        mobile
          ? "flex flex-col gap-2"
          : "hidden items-center gap-7 lg:flex"
      }
    >
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isActive = isMenuItemActive(menuItem);

        return (
          <button
            key={menuItem.id}
            type="button"
            onClick={() => handleNavigate(menuItem)}
            className={
              mobile
                ? `rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                : `group relative text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`
            }
          >
            {menuItem.label}

            {!mobile && (
              <span
                className={`absolute -bottom-2 left-0 h-0.5 bg-foreground transition-all duration-200 ${
                  isActive
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector(
    (state) => state.shopCart
  );

  const [openCartSheet, setOpenCartSheet] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  const cartCount = cartItems?.items?.length || 0;

  const userInitial =
    user?.userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      {/* Cart */}
      <Sheet
        open={openCartSheet}
        onOpenChange={setOpenCartSheet}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="
              relative
              h-10
              w-10
              rounded-full
              transition-all
              duration-200
              hover:bg-muted
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
            "
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  px-1
                  text-[10px]
                  font-bold
                  text-primary-foreground
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full sm:max-w-md"
        >
          <UserCartWrapper
            setOpenCartSheet={setOpenCartSheet}
            cartItems={
              cartItems?.items?.length > 0
                ? cartItems.items
                : []
            }
          />
        </SheetContent>
      </Sheet>

      {/* Account */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="
              ml-1
              rounded-full
              outline-none
              ring-offset-background
              transition-all
              duration-200
              hover:scale-105
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
            "
            aria-label="Account menu"
          >
            <Avatar className="h-9 w-9 border border-border">
              <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-64 rounded-xl p-2"
        >
          <DropdownMenuLabel className="px-3 py-2">
            <div className="text-sm font-semibold">
              {user?.userName || "Account"}
            </div>

            <div className="mt-0.5 text-xs font-normal text-muted-foreground">
              Manage your account
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="cursor-pointer rounded-lg py-2.5"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="
              cursor-pointer
              rounded-lg
              py-2.5
              text-destructive
              focus:text-destructive
            "
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [openMobileMenu, setOpenMobileMenu] =
    useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        border-b
        bg-background/95
        shadow-sm
        backdrop-blur
        supports-[backdrop-filter]:bg-background/80
      "
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/shop/home"
            className="
              flex
              items-center
              gap-2
              rounded-lg
              outline-none
              transition-opacity
              hover:opacity-80
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-primary
                text-primary-foreground
              "
            >
              <HousePlug className="h-5 w-5" />
            </div>

            <span className="hidden text-lg font-bold tracking-tight sm:block">
              E-commerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <MenuItems />

          {/* Desktop Right Actions */}
          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <HeaderRightContent />

            {/* Mobile Menu */}
            <Sheet
              open={openMobileMenu}
              onOpenChange={setOpenMobileMenu}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[85%] max-w-sm"
              >
                <div className="flex h-full flex-col">
                  {/* Mobile Logo */}
                  <div className="mb-8 flex items-center gap-2">
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-primary
                        text-primary-foreground
                      "
                    >
                      <HousePlug className="h-5 w-5" />
                    </div>

                    <span className="text-lg font-bold">
                      E-commerce
                    </span>
                  </div>

                  {/* Mobile Navigation */}
                  <MenuItems
                    mobile
                    onNavigate={() =>
                      setOpenMobileMenu(false)
                    }
                  />

                  {/* Mobile Footer */}
                  <div className="mt-auto border-t pt-6">
                    <p className="text-xs text-muted-foreground">
                      Shop smarter. Shop better.
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;