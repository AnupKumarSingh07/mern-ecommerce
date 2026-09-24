import {
  HousePlug,
  LogOut,
  Menu,
  Search,
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
import { Input } from "../ui/input";

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


/* =========================================================
   NAVIGATION
========================================================= */

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
      setSearchParams({
        category: getCurrentMenuItem.id,
      });
    } else {
      navigate(getCurrentMenuItem.path);
    }

    if (onNavigate) {
      onNavigate();
    }
  }

  function isMenuItemActive(menuItem) {
    const currentCategory = searchParams.get("category");

    if (menuItem.id === "home") {
      return location.pathname === "/shop/home";
    }

    if (menuItem.id === "products") {
      return (
        location.pathname === "/shop/listing" &&
        !currentCategory
      );
    }

    if (menuItem.id === "search") {
      return location.pathname === "/shop/search";
    }

    if (location.pathname === "/shop/listing") {
      return currentCategory === menuItem.id;
    }

    return false;
  }

  return (
    <nav
      className={
        mobile
          ? "flex flex-col gap-1"
          : "hidden items-center gap-1 lg:flex"
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
                ? isActive
                  ? "rounded-xl bg-primary px-4 py-3 text-left text-sm font-semibold text-primary-foreground shadow-sm"
                  : "rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                : isActive
                  ? "relative rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200"
                  : "relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            }
          >
            {menuItem.label}
          </button>
        );
      })}
    </nav>
  );
}


/* =========================================================
   SEARCH BAR
========================================================= */

function SearchBar({ mobile = false }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("keyword") || ""
  );

  useEffect(() => {
    setSearchValue(searchParams.get("keyword") || "");
  }, [searchParams]);

  function handleSearch(event) {
    event.preventDefault();

    const keyword = searchValue.trim();

    if (!keyword) {
      navigate("/shop/search");
      return;
    }

    navigate(
      "/shop/search?keyword=" + encodeURIComponent(keyword)
    );
  }

  return (
    <form
      onSubmit={handleSearch}
      className={
        mobile
          ? "w-full"
          : "hidden min-w-0 flex-1 lg:block lg:max-w-md xl:max-w-xl"
      }
    >
      <div className="relative">
        <Search
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            h-4
            w-4
            -translate-y-1/2
            text-muted-foreground
          "
        />

        <Input
          type="search"
          value={searchValue}
          onChange={(event) =>
            setSearchValue(event.target.value)
          }
          placeholder="Search products..."
          aria-label="Search products"
          className="
            h-11
            w-full
            rounded-full
            border-border
            bg-muted/60
            pl-10
            pr-4
            text-sm
            shadow-none
            transition-all
            duration-200
            placeholder:text-muted-foreground
            hover:bg-muted
            focus-visible:border-primary
            focus-visible:bg-background
            focus-visible:ring-2
            focus-visible:ring-primary/20
          "
        />
      </div>
    </form>
  );
}


/* =========================================================
   CART + ACCOUNT
========================================================= */

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
    <div className="flex items-center gap-1.5">

      {/* CART */}

      <Sheet
        open={openCartSheet}
        onOpenChange={setOpenCartSheet}
      >
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Shopping cart"
            className="
              relative
              h-10
              w-10
              rounded-full
              text-foreground
              transition-all
              duration-200
              hover:bg-primary/10
              hover:text-primary
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            <ShoppingCart className="h-[19px] w-[19px]" />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-[18px]
                  min-w-[18px]
                  items-center
                  justify-center
                  rounded-full
                  bg-pink-500
                  px-1
                  text-[9px]
                  font-bold
                  leading-none
                  text-white
                  shadow-sm
                  ring-2
                  ring-background
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-full border-l-border bg-background sm:max-w-md"
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


      {/* ACCOUNT */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Account menu"
            className="
              rounded-full
              outline-none
              transition-transform
              duration-200
              hover:scale-105
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
            "
          >
            <Avatar
              className="
                h-9
                w-9
                border-2
                border-primary/20
              "
            >
              <AvatarFallback
                className="
                  bg-primary
                  text-sm
                  font-semibold
                  text-primary-foreground
                "
              >
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="
            w-64
            rounded-2xl
            border-border
            bg-card
            p-2
            shadow-lg
          "
        >
          <DropdownMenuLabel className="px-3 py-2.5">
            <div className="text-sm font-semibold text-foreground">
              {user?.userName || "Account"}
            </div>

            <div className="mt-1 text-xs font-normal text-muted-foreground">
              Manage your account
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="
              cursor-pointer
              rounded-xl
              py-2.5
              focus:bg-primary/10
              focus:text-primary
            "
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="
              cursor-pointer
              rounded-xl
              py-2.5
              text-destructive
              focus:bg-destructive/10
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


/* =========================================================
   MAIN SHOPPING HEADER
========================================================= */

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
        border-border/70
        bg-background/95
        shadow-sm
        backdrop-blur-xl
      "
    >

      {/* =====================================================
          DESKTOP / TABLET TOP BAR
      ===================================================== */}

      <div className="container mx-auto">

        <div
          className="
            flex
            min-h-[68px]
            items-center
            gap-3
            px-4
            sm:px-6
            lg:px-8
          "
        >

          {/* LOGO */}

          <Link
            to="/shop/home"
            className="
              flex
              shrink-0
              items-center
              gap-2.5
              rounded-xl
              outline-none
              transition-opacity
              duration-200
              hover:opacity-90
              focus-visible:ring-2
              focus-visible:ring-primary
            "
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
                bg-primary
                text-primary-foreground
                shadow-sm
              "
            >
              <HousePlug className="h-5 w-5" />
            </div>

            <div className="block min-w-0">
              <span className="block truncate text-sm font-extrabold tracking-tight sm:text-[17px]">
                The{" "}
                <span className="text-primary">
                  MeltingPoint
                </span>
              </span>

              <p className="hidden text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:block">
                Shop your style
              </p>
            </div>
          </Link>


          {/* DESKTOP NAVIGATION */}

          <MenuItems />


          {/* DESKTOP SEARCH */}

          <SearchBar />


          {/* DESKTOP ACTIONS */}

          <div className="ml-auto hidden lg:block">
            <HeaderRightContent />
          </div>


          {/* TABLET / MOBILE ACTIONS */}

          <div className="ml-auto flex items-center gap-1 lg:hidden">

            <HeaderRightContent />

            <Sheet
              open={openMobileMenu}
              onOpenChange={setOpenMobileMenu}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="
                    h-10
                    w-10
                    rounded-full
                    transition-all
                    duration-200
                    hover:bg-primary/10
                    hover:text-primary
                    focus-visible:ring-2
                    focus-visible:ring-primary
                  "
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="
                  w-[88%]
                  max-w-sm
                  border-r-border
                  bg-background
                  p-0
                "
              >
                <div className="flex h-full flex-col">

                  {/* MOBILE DRAWER HEADER */}

                  <div className="border-b px-5 pb-5 pt-7">

                    <div className="flex items-center gap-2.5">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-primary
                          text-primary-foreground
                          shadow-sm
                        "
                      >
                        <HousePlug className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="text-lg font-extrabold tracking-tight">
                          The{" "}
                          <span className="text-primary">
                            MeltingPoint
                          </span>
                        </div>

                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                          Shop your style
                        </p>
                      </div>

                    </div>

                  </div>


                  {/* MOBILE SEARCH */}

                  <div className="px-5 py-5">
                    <SearchBar mobile />
                  </div>


                  {/* MOBILE NAVIGATION */}

                  <div className="px-3">
                    <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Browse
                    </p>

                    <MenuItems
                      mobile
                      onNavigate={() =>
                        setOpenMobileMenu(false)
                      }
                    />
                  </div>


                  {/* MOBILE DRAWER FOOTER */}

                  <div className="mt-auto border-t px-5 py-5">

                    <div
                      className="
                        rounded-2xl
                        bg-primary/5
                        p-4
                      "
                    >
                      <p className="text-sm font-semibold">
                        Shop smarter. Shop better.
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Discover products made for your style.
                      </p>
                    </div>

                  </div>

                </div>
              </SheetContent>
            </Sheet>

          </div>

        </div>


        {/* ===================================================
            MOBILE SEARCH BAR
        =================================================== */}

        <div className="border-t border-border/50 px-4 pb-3 pt-2 lg:hidden sm:px-6 lg:px-8">
          <SearchBar mobile />
        </div>

      </div>
    </header>
  );
}

export default ShoppingHeader;