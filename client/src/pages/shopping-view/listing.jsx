import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";

import {
  addToCart,
  fetchCartItems,
} from "@/store/shop/cart-slice";

import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";

import {
  ArrowUpDownIcon,
  SlidersHorizontal,
  PackageSearch,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(
        `${key}=${encodeURIComponent(paramValue)}`
      );
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();

  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  const { cartItems } = useSelector(
    (state) => state.shopCart
  );

  const { user } = useSelector(
    (state) => state.auth
  );

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const [openDetailsDialog, setOpenDetailsDialog] =
    useState(false);

  // Mobile filter state
  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  const { toast } = useToast();

  const categorySearchParam =
    searchParams.get("category");

  /* =====================================================
     SORT
  ===================================================== */

  function handleSort(value) {
    setSort(value);
  }

  /* =====================================================
     FILTER
  ===================================================== */

  function handleFilter(
    getSectionId,
    getCurrentOption
  ) {
    let cpyFilters = {
      ...filters,
    };

    const currentSection =
      cpyFilters[getSectionId] || [];

    const optionIndex =
      currentSection.indexOf(getCurrentOption);

    if (optionIndex === -1) {
      cpyFilters[getSectionId] = [
        ...currentSection,
        getCurrentOption,
      ];
    } else {
      cpyFilters[getSectionId] =
        currentSection.filter(
          (item) => item !== getCurrentOption
        );
    }

    // Remove empty filter sections
    if (
      cpyFilters[getSectionId]?.length === 0
    ) {
      delete cpyFilters[getSectionId];
    }

    setFilters(cpyFilters);

    sessionStorage.setItem(
      "filters",
      JSON.stringify(cpyFilters)
    );
  }

  /* =====================================================
     PRODUCT DETAILS
  ===================================================== */

  function handleGetProductDetails(
    getCurrentProductId
  ) {
    dispatch(
      fetchProductDetails(getCurrentProductId)
    );
  }

  /* =====================================================
     ADD TO CART
  ===================================================== */

  function handleAddtoCart(
    getCurrentProductId,
    getTotalStock
  ) {
    const getCartItems =
      cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem =
        getCartItems.findIndex(
          (item) =>
            item.productId ===
            getCurrentProductId
        );

      if (indexOfCurrentItem > -1) {
        const getQuantity =
          getCartItems[indexOfCurrentItem]
            .quantity;

        if (
          getQuantity + 1 >
          getTotalStock
        ) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(
          fetchCartItems(user?.id)
        );

        toast({
          title: "Product added to cart",
        });
      }
    });
  }

  /* =====================================================
     INITIAL FILTER / SORT
  ===================================================== */

  useEffect(() => {
    setSort("price-lowtohigh");

    setFilters(
      JSON.parse(
        sessionStorage.getItem("filters")
      ) || {}
    );
  }, [categorySearchParam]);

  /* =====================================================
     UPDATE URL
  ===================================================== */

  useEffect(() => {
    const createQueryString =
      createSearchParamsHelper(filters);

    if (createQueryString) {
      setSearchParams(
        new URLSearchParams(
          createQueryString
        )
      );
    } else {
      setSearchParams({});
    }
  }, [
    filters,
    setSearchParams,
  ]);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  useEffect(() => {
    if (
      filters !== null &&
      sort !== null
    ) {
      dispatch(
        fetchAllFilteredProducts({
          filterParams: filters,
          sortParams: sort,
        })
      );
    }
  }, [
    dispatch,
    sort,
    filters,
  ]);

  /* =====================================================
     OPEN PRODUCT DETAILS
  ===================================================== */

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [productDetails]);

  /* =====================================================
     PRODUCT COUNT
  ===================================================== */

  const productCount =
    productList?.length || 0;

  const activeFilterCount =
    Object.values(filters).reduce(
      (total, items) =>
        total + items.length,
      0
    );

  return (
    <div className="min-h-screen bg-background">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:px-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Collection
              </p>

              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                All Products
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Discover products you'll love.
              </p>
            </div>

            {/* Product count */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                bg-background
                px-3.5
                py-1.5
                text-sm
                font-medium
              "
            >
              <PackageSearch
                className="h-4 w-4 text-muted-foreground"
              />

              <span>
                {productCount}{" "}
                {productCount === 1
                  ? "Product"
                  : "Products"}
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">

          {/* =================================================
              DESKTOP FILTER SIDEBAR
          ================================================= */}

          <aside className="hidden w-64 shrink-0 lg:block">

            <div className="sticky top-4 rounded-xl border bg-card p-4 shadow-sm">

              <ProductFilter
                filters={filters}
                handleFilter={handleFilter}
              />

            </div>

          </aside>

          {/* =================================================
              PRODUCT AREA
          ================================================= */}

          <main className="min-w-0 flex-1">

            {/* =================================================
                MOBILE FILTER + SORT
            ================================================= */}

            <div className="mb-4 flex items-center gap-2 lg:hidden">

              {/* Filter button */}

              <Button
                variant="outline"
                onClick={() =>
                  setMobileFilterOpen(
                    !mobileFilterOpen
                  )
                }
                className="
                  h-10
                  flex-1
                  rounded-lg
                  bg-card
                  px-3
                  text-sm
                "
              >
                <SlidersHorizontal
                  className="mr-2 h-4 w-4"
                />

                Filters

                {activeFilterCount > 0 && (
                  <span
                    className="
                      ml-2
                      flex
                      h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-indigo-600
                      px-1.5
                      text-[10px]
                      font-bold
                      text-white
                    "
                  >
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              {/* Mobile Sort */}

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button
                    variant="outline"
                    className="
                      h-10
                      flex-1
                      rounded-lg
                      bg-card
                      px-3
                      text-sm
                    "
                  >
                    <ArrowUpDownIcon
                      className="mr-2 h-4 w-4"
                    />

                    Sort
                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >

                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >

                    {sortOptions.map(
                      (sortItem) => (
                        <DropdownMenuRadioItem
                          key={sortItem.id}
                          value={sortItem.id}
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      )
                    )}

                  </DropdownMenuRadioGroup>

                </DropdownMenuContent>

              </DropdownMenu>

            </div>

            {/* =================================================
                MOBILE FILTER PANEL
            ================================================= */}

            {mobileFilterOpen && (
              <div
                className="
                  mb-4
                  rounded-xl
                  border
                  bg-card
                  p-4
                  shadow-sm
                  lg:hidden
                "
              >

                <div className="mb-4 flex items-center justify-between border-b pb-3">

                  <div>
                    <h2 className="text-base font-semibold">
                      Filters
                    </h2>

                    {activeFilterCount > 0 && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {activeFilterCount} selected
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setMobileFilterOpen(
                        false
                      )
                    }
                    className="rounded-lg"
                  >
                    Done
                  </Button>

                </div>

                <ProductFilter
                  filters={filters}
                  handleFilter={handleFilter}
                />

              </div>
            )}

            {/* =================================================
                DESKTOP TOOLBAR
            ================================================= */}

            <div
              className="
                mb-5
                hidden
                rounded-xl
                border
                bg-card
                p-3
                lg:flex
                lg:items-center
                lg:justify-between
              "
            >

              <div className="px-2">

                <p className="text-sm font-medium">
                  {productCount} products found
                </p>

                <p className="text-xs text-muted-foreground">
                  Browse and find your favorite items
                </p>

              </div>

              {/* Desktop Sort */}

              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button
                    variant="outline"
                    className="rounded-lg"
                  >
                    <ArrowUpDownIcon
                      className="mr-2 h-4 w-4"
                    />

                    Sort by

                    <span className="ml-1 text-muted-foreground">
                      {sortOptions.find(
                        (item) =>
                          item.id === sort
                      )?.label ||
                        "Default"}
                    </span>
                  </Button>

                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56"
                >

                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >

                    {sortOptions.map(
                      (sortItem) => (
                        <DropdownMenuRadioItem
                          key={sortItem.id}
                          value={sortItem.id}
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      )
                    )}

                  </DropdownMenuRadioGroup>

                </DropdownMenuContent>

              </DropdownMenu>

            </div>

            {/* =================================================
                MOBILE PRODUCT COUNT
            ================================================= */}

            <div
              className="
                mb-4
                flex
                items-center
                justify-between
                lg:hidden
              "
            >
              <div>
                <p className="text-sm font-semibold">
                  {productCount} products found
                </p>

                <p className="text-xs text-muted-foreground">
                  Browse your favorites
                </p>
              </div>

              {sort && (
                <p className="max-w-[130px] truncate text-xs text-muted-foreground">
                  {sortOptions.find(
                    (item) =>
                      item.id === sort
                  )?.label}
                </p>
              )}
            </div>

            {/* =================================================
                PRODUCT GRID
            ================================================= */}

            {productCount > 0 ? (

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  sm:gap-4
                  lg:grid-cols-3
                  xl:grid-cols-3
                "
              >

                {productList.map(
                  (productItem) => (
                    <ShoppingProductTile
                      key={
                        productItem?._id ||
                        productItem?.id
                      }
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

              /* =================================================
                 EMPTY STATE
              ================================================= */

              <div
                className="
                  flex
                  min-h-[350px]
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  bg-muted/20
                  p-6
                  text-center
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
                  "
                >
                  <PackageSearch
                    className="h-6 w-6 text-muted-foreground"
                  />
                </div>

                <h2 className="mt-4 text-lg font-semibold">
                  No products found
                </h2>

                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  We couldn't find any products
                  matching your current filters.
                  Try changing or removing some
                  filters.
                </p>

                <Button
                  variant="outline"
                  className="mt-4 rounded-lg"
                  onClick={() => {
                    setFilters({});

                    sessionStorage.removeItem(
                      "filters"
                    );
                  }}
                >
                  Clear Filters
                </Button>

              </div>

            )}

          </main>

        </div>

      </div>

      {/* =================================================
          PRODUCT DETAILS DIALOG
      ================================================= */}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

    </div>
  );
}

export default ShoppingListing;