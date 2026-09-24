import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRight,
  Airplay,
  BabyIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";

import { useNavigate } from "react-router-dom";

import {
  addToCart,
  fetchCartItems,
} from "@/store/shop/cart-slice";

import { useToast } from "@/components/ui/use-toast";

import ProductDetailsDialog from "@/components/shopping-view/product-details";

import { getFeatureImages } from "@/store/common-slice";

/* =========================================================
   CATEGORIES
========================================================= */

const categoriesWithIcon = [
  {
    id: "men",
    label: "Men",
    icon: ShirtIcon,
  },
  {
    id: "women",
    label: "Women",
    icon: CloudLightning,
  },
  {
    id: "kids",
    label: "Kids",
    icon: BabyIcon,
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: WatchIcon,
  },
  {
    id: "footwear",
    label: "Footwear",
    icon: UmbrellaIcon,
  },
];

/* =========================================================
   BRANDS
========================================================= */

const brandsWithIcon = [
  {
    id: "nike",
    label: "Nike",
    icon: Shirt,
  },
  {
    id: "adidas",
    label: "Adidas",
    icon: WashingMachine,
  },
  {
    id: "puma",
    label: "Puma",
    icon: ShoppingBasket,
  },
  {
    id: "levi",
    label: "Levi's",
    icon: Airplay,
  },
  {
    id: "zara",
    label: "Zara",
    icon: Images,
  },
  {
    id: "h&m",
    label: "H&M",
    icon: Heater,
  },
];

/* =========================================================
   SHOPPING HOME
========================================================= */

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const {
    productList,
    productDetails,
  } = useSelector((state) => state.shopProducts);

  const { featureImageList } = useSelector(
    (state) => state.commonFeature
  );

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");

    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem(
      "filters",
      JSON.stringify(currentFilter)
    );

    navigate("/shop/listing");
  }

  /* =========================================================
     PRODUCT DETAILS
  ========================================================= */

  function handleGetProductDetails(productId) {
    dispatch(fetchProductDetails(productId));
  }

  /* =========================================================
     ADD TO CART
  ========================================================= */

  function handleAddtoCart(productId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));

        toast({
          title: "Product added to cart",
          description: "The product has been added successfully.",
        });
      }
    });
  }

  /* =========================================================
     OPEN PRODUCT DETAILS DIALOG
  ========================================================= */

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  /* =========================================================
     HERO AUTO SLIDER
  ========================================================= */

  useEffect(() => {
    if (!featureImageList?.length) {
      return;
    }

    if (currentSlide >= featureImageList.length) {
      setCurrentSlide(0);
    }

    const timer = setInterval(() => {
      setCurrentSlide(
        (prevSlide) =>
          (prevSlide + 1) % featureImageList.length
      );
    }, 7000);

    return () => clearInterval(timer);
  }, [featureImageList, currentSlide]);

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  /* =========================================================
     FETCH FEATURE IMAGES
  ========================================================= */

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  /* =========================================================
     HERO NAVIGATION
  ========================================================= */

  function handlePreviousSlide() {
    if (!featureImageList?.length) {
      return;
    }

    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + featureImageList.length) %
        featureImageList.length
    );
  }

  function handleNextSlide() {
    if (!featureImageList?.length) {
      return;
    }

    setCurrentSlide(
      (prevSlide) =>
        (prevSlide + 1) % featureImageList.length
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-background">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="container px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div
          className="
            relative
            isolate
            h-[430px]
            overflow-hidden
            rounded-[1.75rem]
            bg-slate-950
            shadow-[0_20px_60px_rgba(79,70,229,0.18)]
            sm:h-[500px]
            lg:h-[580px]
            xl:h-[620px]
          "
        >

          {/* HERO IMAGES */}

          {featureImageList?.length > 0 ? (
            featureImageList.map((slide, index) => (
              <img
                key={
                  slide?._id ||
                  slide?.image ||
                  index
                }
                src={slide?.image}
                alt={`Featured collection ${index + 1}`}
                className={`
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-all
                  duration-1000
                  ease-in-out
                  ${index === currentSlide
                    ? "scale-100 opacity-100"
                    : "scale-105 opacity-0"
                  }
                `}
              />
            ))
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-muted
              "
            >
              <div className="text-center">
                <p className="text-lg font-semibold">
                  Discover your style
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                  Featured collections are coming soon.
                </p>
              </div>
            </div>
          )}

          {/* HERO GRADIENT */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-slate-950/90
              via-indigo-950/65
              to-pink-950/20
            "
          />

          {/* PREMIUM COLOR GLOW */}

          <div
            className="
              pointer-events-none
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
             bg-pink-500/20
              blur-3xl
            "
          />

          <div
            className="
    pointer-events-none
    absolute
    -bottom-32
    -left-20
    h-80
    w-80
    rounded-full
    bg-indigo-500/20
    blur-3xl
  "
          />

          {/* HERO CONTENT */}

          <div
            className="
              absolute
              inset-0
              flex
              items-center
            "
          >
            <div
              className="
                max-w-2xl
                px-6
                sm:px-10
                lg:px-14
                xl:px-16
              "
            >

              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-4
                  py-1.5
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-white
                  backdrop-blur-md
                "
              >
                New collection
              </span>

              <h1
                className="
                  mt-5
                  max-w-2xl
                  text-4xl
                  font-bold
                  leading-[1.05]
                  tracking-tight
                  text-white
                  sm:text-5xl
                  lg:text-6xl
                  xl:text-7xl
                "
              >
                Find your style.
                <br />
                Make it yours.
              </h1>

              <p
                className="
                  mt-5
                  max-w-xl
                  text-sm
                  leading-6
                  text-white/80
                  sm:text-base
                  lg:text-lg
                "
              >
                Discover carefully selected fashion,
                accessories and everyday essentials
                made for your style.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Button
                  onClick={() =>
                    navigate("/shop/listing")
                  }
                  size="lg"
                  className="
                    rounded-full
                    bg-white
                    px-7
                    font-semibold
                    text-black
                    shadow-lg
                    hover:bg-white/90
                  "
                >
                  Shop now

                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="
                    rounded-full
                    border-white/30
                    bg-white/10
                    px-7
                    font-semibold
                    text-white
                    backdrop-blur-md
                    hover:bg-white/20
                    hover:text-white
                  "
                >
                  Explore
                </Button>

              </div>
            </div>
          </div>

          {/* PREVIOUS BUTTON */}

          {featureImageList?.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousSlide}
                aria-label="Previous slide"
                className="
                  absolute
                  left-3
                  top-1/2
                  h-10
                  w-10
                  -translate-y-1/2
                  rounded-full
                  border-white/20
                  bg-black/20
                  text-white
                  backdrop-blur-md
                  transition-all
                  hover:scale-105
                  hover:bg-white
                  hover:text-black
                  sm:left-5
                "
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>

              {/* NEXT BUTTON */}

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextSlide}
                aria-label="Next slide"
                className="
                  absolute
                  right-3
                  top-1/2
                  h-10
                  w-10
                  -translate-y-1/2
                  rounded-full
                  border-white/20
                  bg-black/20
                  text-white
                  backdrop-blur-md
                  transition-all
                  hover:scale-105
                  hover:bg-white
                  hover:text-black
                  sm:right-5
                "
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>

              {/* SLIDE INDICATORS */}

              <div
                className="
                  absolute
                  bottom-6
                  left-1/2
                  flex
                  -translate-x-1/2
                  items-center
                  gap-2
                "
              >
                {featureImageList.map(
                  (slide, index) => (
                    <button
                      key={
                        slide?._id ||
                        slide?.image ||
                        index
                      }
                      type="button"
                      aria-label={`Go to slide ${index + 1
                        }`}
                      onClick={() =>
                        setCurrentSlide(index)
                      }
                      className={`
                        h-1.5
                        rounded-full
                        transition-all
                        duration-300
                        ${index === currentSlide
                          ? "w-8 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                        }
                      `}
                    />
                  )
                )}
              </div>
            </>
          )}
        </div>
      </section>


      {/* =====================================================
    QUICK CATEGORIES
===================================================== */}

      <section
        id="categories"
        className="border-y bg-background"
      >
        <div className="container px-4 py-8 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Explore
              </p>

              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Shop by category
              </h2>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate("/shop/listing")}
              className="hidden rounded-full text-sm font-semibold sm:flex"
            >
              View all
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          {/* Category strip */}
          <div
            className="
        flex
        gap-3
        overflow-x-auto
        pb-2
        scrollbar-hide
      "
          >
            {categoriesWithIcon.map((categoryItem) => {
              const CategoryIcon = categoryItem.icon;

              return (
                <button
                  key={categoryItem.id}
                  type="button"
                  onClick={() =>
                    handleNavigateToListingPage(
                      categoryItem,
                      "category"
                    )
                  }
                  className="
              group
              flex
              min-w-[120px]
              shrink-0
              flex-col
              items-center
              rounded-xl
              border
              bg-card
              px-4
              py-4
              transition-all
              duration-200
              hover:border-primary/30
              hover:shadow-md
              active:scale-[0.97]
              sm:min-w-[140px]
              sm:px-5
              sm:py-5
            "
                >
                  {/* Icon */}
                  <div
                    className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-primary/10
                text-primary
                transition-colors
                duration-200
                group-hover:bg-primary
                group-hover:text-primary-foreground
                sm:h-14
                sm:w-14
              "
                  >
                    <CategoryIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  {/* Name */}
                  <span
                    className="
                mt-3
                text-sm
                font-semibold
                whitespace-nowrap
                group-hover:text-primary
              "
                  >
                    {categoryItem.label}
                  </span>

                  <span className="mt-0.5 text-xs text-muted-foreground">
                    Explore
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile view all */}
          <div className="mt-4 flex justify-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => navigate("/shop/listing")}
              className="rounded-full px-5 text-sm"
            >
              View all categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>

      {/* =====================================================
    SHOP BY BRAND
===================================================== */}

      <section className="bg-muted/30">
        <div className="container px-4 py-8 sm:px-6 lg:px-8">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Trusted & loved
              </p>

              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Shop by brand
              </h2>
            </div>

            <Button
              variant="ghost"
              onClick={() => navigate("/shop/listing")}
              className="hidden rounded-full text-sm font-semibold sm:flex"
            >
              Explore all
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          {/* Brand strip */}
          <div
            className="
        flex
        gap-3
        overflow-x-auto
        pb-2
        scrollbar-hide
      "
          >
            {brandsWithIcon.map((brandItem) => {
              const BrandIcon = brandItem.icon;

              return (
                <button
                  key={brandItem.id}
                  type="button"
                  onClick={() =>
                    handleNavigateToListingPage(
                      brandItem,
                      "brand"
                    )
                  }
                  className="
              group
              flex
              min-w-[135px]
              shrink-0
              items-center
              gap-3
              rounded-xl
              border
              bg-background
              px-4
              py-4
              text-left
              transition-all
              duration-200
              hover:border-primary/30
              hover:shadow-md
              active:scale-[0.97]
              sm:min-w-[155px]
            "
                >
                  <div
                    className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-muted
                transition-all
                duration-200
                group-hover:bg-primary
                group-hover:text-primary-foreground
              "
                  >
                    <BrandIcon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {brandItem.label}
                    </p>

                    <p
                      className="
                  mt-0.5
                  flex
                  items-center
                  gap-1
                  text-xs
                  text-muted-foreground
                  group-hover:text-primary
                "
                    >
                      Shop now
                      <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="mt-4 flex justify-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => navigate("/shop/listing")}
              className="rounded-full px-5 text-sm"
            >
              Explore all brands
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>

      {/* =====================================================
    FEATURED PRODUCTS
===================================================== */}

      <section className="border-t bg-background py-10 sm:py-12 lg:py-14">
        <div className="container px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
            <div>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-primary" />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Trending now
                </p>
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Featured products
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Handpicked products you may love.
              </p>
            </div>

            {/* Desktop View All */}
            <Button
              variant="ghost"
              onClick={() => navigate("/shop/listing")}
              className="
          hidden
          shrink-0
          rounded-full
          px-4
          text-sm
          font-semibold
          sm:flex
        "
            >
              View all
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          {/* Products */}
          {productList?.length > 0 ? (
            <div className="relative">

              {/* Product Row */}
              <div
                className="
            flex
            gap-3
            overflow-x-auto
            pb-4
            scrollbar-hide
            snap-x
            snap-mandatory
            sm:gap-4
          "
              >
                {productList.slice(0, 8).map((productItem) => (
                  <div
                    key={productItem._id}
                    className="
                w-[175px]
                shrink-0
                snap-start
                sm:w-[205px]
                md:w-[220px]
                lg:w-[230px]
                xl:w-[240px]
              "
                  >
                    <ShoppingProductTile
                      handleGetProductDetails={
                        handleGetProductDetails
                      }
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))}
              </div>

              {/* Scroll Hint */}
              <div
                className="
            pointer-events-none
            absolute
            right-0
            top-0
            hidden
            h-full
            w-16
            bg-gradient-to-l
            from-background
            to-transparent
            sm:block
          "
              />

            </div>
          ) : (
            /* Empty State */
            <div
              className="
          rounded-2xl
          border
          bg-muted/20
          px-6
          py-16
          text-center
        "
            >
              <p className="font-medium">
                No products available right now.
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                Please check back soon.
              </p>
            </div>
          )}

          {/* Mobile View All */}
          <div className="mt-5 flex justify-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => navigate("/shop/listing")}
              className="rounded-full px-6 text-sm font-semibold"
            >
              View all products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>


      {/* =====================================================
    TRUST / BENEFITS
===================================================== */}

      <section className="border-y border-indigo-100/70 bg-gradient-to-r from-indigo-50/70 via-white to-pink-50/70">
        <div
          className="
      container
      grid
      grid-cols-2
      sm:grid-cols-4
      divide-x
      divide-indigo-100
    "
        >
          {/* Fast Delivery */}
          <div
            className="
        group
        flex
        items-center
        justify-center
        gap-3
        px-4
        py-7
        transition-all
        duration-300
        hover:bg-white/70
        sm:py-8
      "
          >
            <div
              className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-100
          text-indigo-600
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-indigo-600
          group-hover:text-white
        "
            >
              <Truck className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground">
                Fast delivery
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Delivered to your door
              </p>
            </div>
          </div>

          {/* Secure Payment */}
          <div
            className="
        group
        flex
        items-center
        justify-center
        gap-3
        px-4
        py-7
        transition-all
        duration-300
        hover:bg-white/70
        sm:py-8
      "
          >
            <div
              className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-pink-100
          text-pink-600
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-pink-600
          group-hover:text-white
        "
            >
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground">
                Secure payment
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Safe & protected
              </p>
            </div>
          </div>

          {/* Easy Returns */}
          <div
            className="
        group
        flex
        items-center
        justify-center
        gap-3
        px-4
        py-7
        transition-all
        duration-300
        hover:bg-white/70
        sm:py-8
      "
          >
            <div
              className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-indigo-100
          text-indigo-600
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-indigo-600
          group-hover:text-white
        "
            >
              <RotateCcw className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground">
                Easy returns
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Hassle-free shopping
              </p>
            </div>
          </div>

          {/* Customer Support */}
          <div
            className="
        group
        flex
        items-center
        justify-center
        gap-3
        px-4
        py-7
        transition-all
        duration-300
        hover:bg-white/70
        sm:py-8
      "
          >
            <div
              className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-pink-100
          text-pink-600
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-pink-600
          group-hover:text-white
        "
            >
              <Headphones className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-foreground">
                24/7 support
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                We're here to help
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
    FINAL CTA
===================================================== */}

      <section className="border-t bg-background py-12 sm:py-16 lg:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div
            className="
        relative
        isolate
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-indigo-600
        via-indigo-600
        to-pink-600
        px-6
        py-12
        text-center
        text-white
        shadow-[0_20px_60px_rgba(79,70,229,0.20)]
        sm:px-12
        sm:py-16
        lg:px-20
        lg:py-20
      "
          >
            {/* Background Glow */}
            <div
              className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-64
          w-64
          rounded-full
          bg-pink-400/30
          blur-3xl
        "
            />

            <div
              className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          h-72
          w-72
          rounded-full
          bg-indigo-400/30
          blur-3xl
        "
            />

            {/* Decorative Circle */}
            <div
              className="
          pointer-events-none
          absolute
          right-10
          top-10
          hidden
          h-20
          w-20
          rounded-full
          border
          border-white/10
          sm:block
        "
            />

            {/* Content */}
            <div className="relative mx-auto max-w-2xl">
              <span
                className="
            inline-flex
            items-center
            rounded-full
            border
            border-white/20
            bg-white/10
            px-4
            py-1.5
            text-xs
            font-semibold
            uppercase
            tracking-[0.16em]
            backdrop-blur-md
          "
              >
                Start shopping
              </span>

              <h2
                className="
            mt-5
            text-3xl
            font-bold
            leading-tight
            tracking-tight
            sm:text-4xl
            lg:text-5xl
          "
              >
                Find something you'll love.
              </h2>

              <p
                className="
            mx-auto
            mt-4
            max-w-xl
            text-sm
            leading-6
            text-white/80
            sm:text-base
          "
              >
                Explore our latest collection and discover
                products made for your style, everyday needs,
                and special moments.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/shop/listing")}
                  size="lg"
                  className="
              w-full
              rounded-full
              bg-white
              px-7
              font-semibold
              text-indigo-600
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-white/90
              sm:w-auto
            "
                >
                  Shop now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="
              w-full
              rounded-full
              border-white/30
              bg-white/10
              px-7
              font-semibold
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-white/20
              hover:text-white
              sm:w-auto
            "
                >
                  Explore categories
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCT DETAILS DIALOG
      ===================================================== */}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

    </div>
  );
}

export default ShoppingHome;