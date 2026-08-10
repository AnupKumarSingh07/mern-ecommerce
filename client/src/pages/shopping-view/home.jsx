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
            rounded-3xl
            bg-muted
            shadow-xl
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
                  ${
                    index === currentSlide
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
              from-black/75
              via-black/40
              to-black/5
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
                      aria-label={`Go to slide ${
                        index + 1
                      }`}
                      onClick={() =>
                        setCurrentSlide(index)
                      }
                      className={`
                        h-1.5
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          index === currentSlide
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
          TRUST / BENEFITS
      ===================================================== */}

      <section className="border-b bg-background">
        <div
          className="
            container
            grid
            grid-cols-2
            divide-x
            py-7
            sm:grid-cols-4
            sm:divide-x
          "
        >

          <div className="flex items-center justify-center gap-3 px-3">
            <Truck className="h-5 w-5 shrink-0 text-primary" />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Fast delivery
              </p>

              <p className="text-xs text-muted-foreground">
                Delivered to your door
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Secure payment
              </p>

              <p className="text-xs text-muted-foreground">
                Safe & protected
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-3">
            <RotateCcw className="h-5 w-5 shrink-0 text-primary" />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Easy returns
              </p>

              <p className="text-xs text-muted-foreground">
                Hassle-free shopping
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-3">
            <Headphones className="h-5 w-5 shrink-0 text-primary" />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                Support
              </p>

              <p className="text-xs text-muted-foreground">
                We're here to help
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section
        id="categories"
        className="py-16 sm:py-20"
      >
        <div className="container px-4 sm:px-6 lg:px-8">

          <div
            className="
              mb-8
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Browse collections
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Shop by category
              </h2>

              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                Find exactly what you're looking for.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() =>
                navigate("/shop/listing")
              }
              className="hidden rounded-full sm:flex"
            >
              View all

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              lg:grid-cols-5
            "
          >
            {categoriesWithIcon.map(
              (categoryItem) => {
                const CategoryIcon =
                  categoryItem.icon;

                return (
                  <Card
                    key={categoryItem.id}
                    onClick={() =>
                      handleNavigateToListingPage(
                        categoryItem,
                        "category"
                      )
                    }
                    className="
                      group
                      cursor-pointer
                      overflow-hidden
                      rounded-2xl
                      border
                      bg-card
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-foreground/20
                      hover:shadow-xl
                    "
                  >
                    <CardContent
                      className="
                        flex
                        min-h-[155px]
                        flex-col
                        items-center
                        justify-center
                        p-5
                        text-center
                        sm:min-h-[175px]
                      "
                    >
                      <div
                        className="
                          mb-5
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          bg-muted
                          transition-all
                          duration-300
                          group-hover:scale-110
                          group-hover:bg-primary
                          group-hover:text-primary-foreground
                        "
                      >
                        <CategoryIcon className="h-7 w-7" />
                      </div>

                      <span className="text-sm font-semibold">
                        {categoryItem.label}
                      </span>

                      <span
                        className="
                          mt-1
                          flex
                          items-center
                          gap-1
                          text-xs
                          text-muted-foreground
                        "
                      >
                        Explore
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/shop/listing")
              }
              className="rounded-full"
            >
              View all categories

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>

      {/* =====================================================
          BRANDS
      ===================================================== */}

      <section
        className="
          border-y
          bg-muted/30
          py-16
          sm:py-20
        "
      >
        <div className="container px-4 sm:px-6 lg:px-8">

          <div
            className="
              mb-10
              flex
              flex-col
              justify-between
              gap-4
              sm:flex-row
              sm:items-end
            "
          >
            <div>
              <p
                className="
                  mb-2
                  text-sm
                  font-medium
                  uppercase
                  tracking-wider
                  text-muted-foreground
                "
              >
                Trusted & loved
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Shop by brand
              </h2>

              <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                Explore products from brands you
                already love.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() =>
                navigate("/shop/listing")
              }
              className="hidden rounded-full sm:flex"
            >
              Explore all

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-3
              lg:grid-cols-6
            "
          >
            {brandsWithIcon.map((brandItem) => {
              const BrandIcon =
                brandItem.icon;

              return (
                <Card
                  key={brandItem.id}
                  onClick={() =>
                    handleNavigateToListingPage(
                      brandItem,
                      "brand"
                    )
                  }
                  className="
                    group
                    relative
                    cursor-pointer
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-background
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-foreground/20
                    hover:shadow-xl
                  "
                >
                  <CardContent
                    className="
                      flex
                      min-h-[155px]
                      flex-col
                      items-center
                      justify-center
                      p-5
                    "
                  >
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        bg-muted
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:bg-foreground
                        group-hover:text-background
                      "
                    >
                      <BrandIcon className="h-6 w-6" />
                    </div>

                    <span
                      className="
                        mt-4
                        text-sm
                        font-semibold
                      "
                    >
                      {brandItem.label}
                    </span>

                    <span
                      className="
                        mt-1
                        flex
                        items-center
                        gap-1
                        text-xs
                        text-muted-foreground
                        transition-all
                        duration-300
                      "
                    >
                      Shop now
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/shop/listing")
              }
              className="rounded-full"
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

      <section className="py-16 sm:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">

          <div
            className="
              mb-8
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Curated for you
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Featured products
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Discover some of our most popular picks.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() =>
                navigate("/shop/listing")
              }
              className="hidden rounded-full sm:flex"
            >
              View all

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {productList?.length > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              {productList.map(
                (productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={
                      handleGetProductDetails
                    }
                    product={productItem}
                    handleAddtoCart={
                      handleAddtoCart
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                bg-muted/30
                py-20
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

          <div className="mt-8 flex justify-center sm:hidden">
            <Button
              variant="outline"
              onClick={() =>
                navigate("/shop/listing")
              }
              className="rounded-full"
            >
              Browse all products

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="border-t py-16 sm:py-20">
        <div className="container px-4 sm:px-6 lg:px-8">

          <div
            className="
              overflow-hidden
              rounded-3xl
              bg-foreground
              px-6
              py-12
              text-center
              text-background
              sm:px-12
              sm:py-16
            "
          >
            <p className="text-sm font-medium uppercase tracking-wider opacity-70">
              Your style starts here
            </p>

            <h2
              className="
                mx-auto
                mt-3
                max-w-2xl
                text-3xl
                font-bold
                tracking-tight
                sm:text-4xl
              "
            >
              Ready to find something you love?
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-sm
                opacity-70
                sm:text-base
              "
            >
              Explore our collection and discover
              your next favorite piece.
            </p>

            <Button
              onClick={() =>
                navigate("/shop/listing")
              }
              size="lg"
              className="
                mt-7
                rounded-full
                bg-background
                px-7
                text-foreground
                hover:bg-background/90
              "
            >
              Start shopping

              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

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