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
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
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
        dispatch(fetchCartItems(user?.id));

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
  }, [filters, setSearchParams]);

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

  const productCount =
    productList?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Collection
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                All Products
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
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
                px-4
                py-2
                text-sm
                font-medium
              "
            >
              <PackageSearch className="h-4 w-4 text-muted-foreground" />

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

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* =================================================
              FILTER SIDEBAR
          ================================================= */}

          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-4 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />

                <h2 className="font-semibold">
                  Filters
                </h2>
              </div>

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
            {/* Toolbar */}

            <div
              className="
                mb-6
                flex
                flex-col
                gap-3
                rounded-2xl
                border
                bg-card
                p-3
                sm:flex-row
                sm:items-center
                sm:justify-between
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

              {/* Sort */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl sm:w-auto"
                  >
                    <ArrowUpDownIcon className="mr-2 h-4 w-4" />

                    Sort by

                    <span className="ml-1 text-muted-foreground">
                      {sortOptions.find(
                        (item) =>
                          item.id === sort
                      )?.label || "Default"}
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
                PRODUCT GRID
            ================================================= */}

            {productCount > 0 ? (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
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
                  min-h-[400px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  bg-muted/20
                  p-8
                  text-center
                "
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <PackageSearch className="h-7 w-7 text-muted-foreground" />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  No products found
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  We couldn't find any products
                  matching your current filters.
                  Try changing or removing some
                  filters.
                </p>

                <Button
                  variant="outline"
                  className="mt-5 rounded-xl"
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