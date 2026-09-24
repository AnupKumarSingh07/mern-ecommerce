import {
  StarIcon,
  ShoppingCart,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Check,
} from "lucide-react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  fetchCartItems,
} from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";

import { useEffect, useMemo, useState } from "react";
import {
  addReview,
  getReviews,
} from "@/store/shop/review-slice";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  // =====================================================
  // GALLERY STATE
  // =====================================================

  const [selectedImage, setSelectedImage] = useState(0);

  // =====================================================
  // VARIANT STATE
  // =====================================================

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] =
    useState(null);

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state) => state.auth
  );

  const { cartItems } = useSelector(
    (state) => state.shopCart
  );

  const { reviews } = useSelector(
    (state) => state.shopReview
  );

  const { toast } = useToast();

  // =====================================================
  // PRODUCT IMAGES
  // =====================================================

  const productImages = useMemo(() => {
    if (!productDetails) return [];

    const images = [];

    if (productDetails?.image) {
      images.push(productDetails.image);
    }

    if (Array.isArray(productDetails?.images)) {
      productDetails.images.forEach((image) => {
        if (
          image &&
          !images.includes(image)
        ) {
          images.push(image);
        }
      });
    }

    if (
      productDetails?.imageUrl &&
      !images.includes(
        productDetails.imageUrl
      )
    ) {
      images.push(productDetails.imageUrl);
    }

    return images;
  }, [productDetails]);

  // =====================================================
  // VARIANTS
  // =====================================================

  const variants = useMemo(() => {
    if (
      !productDetails ||
      !Array.isArray(productDetails.variants)
    ) {
      return [];
    }

    return productDetails.variants.filter(
      (variant) =>
        variant &&
        typeof variant === "object"
    );
  }, [productDetails]);

  // =====================================================
  // AVAILABLE COLORS
  // =====================================================

  const availableColors = useMemo(() => {
    return [
      ...new Set(
        variants
          .map((variant) =>
            String(
              variant?.color || ""
            ).trim()
          )
          .filter(Boolean)
      ),
    ];
  }, [variants]);

  // =====================================================
  // AVAILABLE SIZES
  // =====================================================

  const availableSizes = useMemo(() => {
    return [
      ...new Set(
        variants
          .map((variant) =>
            String(
              variant?.size || ""
            ).trim()
          )
          .filter(Boolean)
      ),
    ];
  }, [variants]);

  // =====================================================
  // FIND EXACT VARIANT
  // =====================================================

  function findVariant(color, size) {
    if (!color || !size) {
      return null;
    }

    return (
      variants.find((variant) => {
        const variantColor = String(
          variant?.color || ""
        ).trim();

        const variantSize = String(
          variant?.size || ""
        ).trim();

        return (
          variantColor === color &&
          variantSize === size
        );
      }) || null
    );
  }

  // =====================================================
  // RESET VARIANT WHEN PRODUCT CHANGES
  // =====================================================

  useEffect(() => {
    if (!productDetails) {
      setSelectedImage(0);
      setSelectedColor("");
      setSelectedSize("");
      setSelectedVariant(null);
      return;
    }

    setSelectedImage(0);

    const productVariants = Array.isArray(
      productDetails.variants
    )
      ? productDetails.variants
      : [];

    if (productVariants.length > 0) {
      const firstAvailableVariant =
        productVariants.find(
          (variant) =>
            Number(variant?.stock || 0) > 0
        ) || productVariants[0];

      const firstColor = String(
        firstAvailableVariant?.color || ""
      ).trim();

      const firstSize = String(
        firstAvailableVariant?.size || ""
      ).trim();

      setSelectedColor(firstColor);
      setSelectedSize(firstSize);

      setSelectedVariant(
        firstAvailableVariant || null
      );
    } else {
      setSelectedColor("");
      setSelectedSize("");
      setSelectedVariant(null);
    }
  }, [productDetails]);

  // =====================================================
  // COLOR SELECT
  // =====================================================

  function handleColorSelect(color) {
    const normalizedColor = String(
      color || ""
    ).trim();

    setSelectedColor(normalizedColor);

    // ---------------------------------------------------
    // Keep the currently selected size only if the exact
    // color + size combination exists.
    // ---------------------------------------------------

    if (selectedSize) {
      const matchingVariant = findVariant(
        normalizedColor,
        selectedSize
      );

      if (matchingVariant) {
        setSelectedVariant(
          matchingVariant
        );
        return;
      }
    }

    // ---------------------------------------------------
    // Current size is not available for this color.
    // Reset size and variant.
    // ---------------------------------------------------

    setSelectedSize("");
    setSelectedVariant(null);
  }

  // =====================================================
  // SIZE SELECT
  // =====================================================

  function handleSizeSelect(size) {
    const normalizedSize = String(
      size || ""
    ).trim();

    setSelectedSize(normalizedSize);

    if (selectedColor) {
      const matchingVariant = findVariant(
        selectedColor,
        normalizedSize
      );

      setSelectedVariant(
        matchingVariant || null
      );
    } else {
      setSelectedVariant(null);
    }
  }

  // =====================================================
  // VARIANT HELPERS
  // =====================================================

  function isColorAvailable(color) {
    return variants.some((variant) => {
      const variantColor = String(
        variant?.color || ""
      ).trim();

      return variantColor === color;
    });
  }

  function isSizeAvailable(size) {
    const normalizedSize = String(
      size || ""
    ).trim();

    return variants.some((variant) => {
      const variantSize = String(
        variant?.size || ""
      ).trim();

      if (variantSize !== normalizedSize) {
        return false;
      }

      if (!selectedColor) {
        return Number(
          variant?.stock || 0
        ) > 0;
      }

      const variantColor = String(
        variant?.color || ""
      ).trim();

      return (
        variantColor === selectedColor &&
        Number(variant?.stock || 0) > 0
      );
    });
  }

  // =====================================================
  // RATING
  // =====================================================

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  // =====================================================
  // CURRENT PRICE
  // =====================================================

  const currentPrice =
    selectedVariant
      ? Number(
          selectedVariant.price || 0
        )
      : Number(
          productDetails?.price || 0
        );

  const currentSalePrice =
    selectedVariant
      ? Number(
          selectedVariant.salePrice || 0
        )
      : Number(
          productDetails?.salePrice || 0
        );

  const hasCurrentSale =
    currentSalePrice > 0 &&
    currentSalePrice < currentPrice;

  const displayPrice = hasCurrentSale
    ? currentSalePrice
    : currentPrice;

  // =====================================================
  // CURRENT STOCK
  // =====================================================

  const currentStock =
    selectedVariant
      ? Number(
          selectedVariant.stock || 0
        )
      : Number(
          productDetails?.totalStock || 0
        );

  // =====================================================
  // DISCOUNT
  // =====================================================

  const discountPercentage =
    hasCurrentSale && currentPrice > 0
      ? Math.round(
          ((currentPrice -
            currentSalePrice) /
            currentPrice) *
            100
        )
      : 0;

  // =====================================================
  // PRODUCT STATUS
  // =====================================================

  const hasVariants =
    variants.length > 0;

  const variantSelectionRequired =
    hasVariants &&
    (!selectedColor ||
      !selectedSize);

  const noMatchingVariant =
    hasVariants &&
    selectedColor &&
    selectedSize &&
    !selectedVariant;

  const isOutOfStock =
    hasVariants
      ? !!selectedVariant &&
        currentStock <= 0
      : currentStock <= 0;

  const isLowStock =
    currentStock > 0 &&
    currentStock < 10;

  // =====================================================
  // ADD TO CART
  // =====================================================

  function handleAddToCart() {
    if (!user?.id) {
      toast({
        title:
          "Please login to add products to cart",
        variant: "destructive",
      });

      return;
    }

    // -----------------------------------------------
    // Variant validation
    // -----------------------------------------------

    if (hasVariants) {
      if (
        !selectedColor ||
        !selectedSize
      ) {
        toast({
          title:
            "Please select color and size",
          variant: "destructive",
        });

        return;
      }

      if (!selectedVariant) {
        toast({
          title:
            "This color and size combination is unavailable",
          variant: "destructive",
        });

        return;
      }

      if (currentStock <= 0) {
        toast({
          title:
            "This variant is out of stock",
          variant: "destructive",
        });

        return;
      }
    }

    const getCartItems =
      cartItems?.items || [];

    // =================================================
    // Variant ID
    // =================================================

    const currentVariantId =
      selectedVariant?._id || null;

    // =================================================
    // CHECK SAME PRODUCT + SAME VARIANT
    // =================================================

    const indexOfCurrentItem =
      getCartItems.findIndex((item) => {
        const sameProduct =
          String(item.productId) ===
          String(productDetails?._id);

        const sameVariant =
          String(
            item.variantId || ""
          ) ===
          String(
            currentVariantId || ""
          );

        return (
          sameProduct &&
          sameVariant
        );
      });

    // =================================================
    // CART STOCK CHECK
    // =================================================

    if (indexOfCurrentItem > -1) {
      const currentQuantity =
        Number(
          getCartItems[
            indexOfCurrentItem
          ]?.quantity || 0
        );

      if (
        currentQuantity + 1 >
        currentStock
      ) {
        toast({
          title: `Only ${currentStock} quantity available`,
          variant: "destructive",
        });

        return;
      }
    }

    // =================================================
    // ADD TO CART
    // =================================================

    dispatch(
      addToCart({
        userId: user?.id,
        productId:
          productDetails?._id,
        quantity: 1,
        variantId:
          currentVariantId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(
          fetchCartItems(user?.id)
        );

        toast({
          title:
            "Product added to cart",
        });
      }
    });
  }

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  function handleDialogClose() {
    setOpen(false);

    dispatch(setProductDetails());

    setRating(0);
    setReviewMsg("");
    setSelectedImage(0);

    setSelectedColor("");
    setSelectedSize("");
    setSelectedVariant(null);
  }

  // =====================================================
  // ADD REVIEW
  // =====================================================

  function handleAddReview() {
    if (
      !reviewMsg.trim() ||
      rating === 0
    ) {
      toast({
        title:
          "Please add a rating and write a review.",
        variant: "destructive",
      });

      return;
    }

    dispatch(
      addReview({
        productId:
          productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");

        dispatch(
          getReviews(
            productDetails?._id
          )
        );

        toast({
          title:
            "Review added successfully!",
        });
      }
    });
  }

  // =====================================================
  // FETCH REVIEWS
  // =====================================================

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(
        getReviews(
          productDetails?._id
        )
      );
    }
  }, [
    productDetails,
    dispatch,
  ]);

  // =====================================================
  // AVERAGE REVIEW
  // =====================================================

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce(
          (sum, reviewItem) =>
            sum +
            reviewItem.reviewValue,
          0
        ) / reviews.length
      : 0;

  // =====================================================
  // IMAGE NAVIGATION
  // =====================================================

  function handlePreviousImage() {
    if (productImages.length <= 1)
      return;

    setSelectedImage((current) =>
      current === 0
        ? productImages.length - 1
        : current - 1
    );
  }

  function handleNextImage() {
    if (productImages.length <= 1)
      return;

    setSelectedImage((current) =>
      current ===
      productImages.length - 1
        ? 0
        : current + 1
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Dialog
      open={open}
      onOpenChange={handleDialogClose}
    >
      <DialogContent
        className="
          max-h-[95vh]
          w-[calc(100%-1rem)]
          max-w-6xl
          overflow-y-auto
          rounded-2xl
          p-0
          sm:w-[calc(100%-2rem)]
        "
      >
        {productDetails && (
          <div className="p-4 sm:p-6 lg:p-8">

            {/* =================================================
                PRODUCT SECTION
            ================================================= */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

              {/* =================================================
                  PRODUCT GALLERY
              ================================================= */}

              <div className="min-w-0">

                {/* MAIN IMAGE */}

                <div
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    bg-muted/40
                  "
                >
                  <div className="aspect-square w-full">

                    {productImages.length >
                    0 ? (
                      <img
                        src={
                          productImages[
                            selectedImage
                          ]
                        }
                        alt={
                          productDetails?.title ||
                          "Product"
                        }
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                          text-sm
                          text-muted-foreground
                        "
                      >
                        No image available
                      </div>
                    )}

                  </div>

                  {/* SALE BADGE */}

                  {hasCurrentSale && (
                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        rounded-full
                        bg-gradient-to-r
                        from-indigo-600
                        to-pink-500
                        px-3
                        py-1.5
                        text-xs
                        font-bold
                        text-white
                        shadow-md
                      "
                    >
                      {discountPercentage}% OFF
                    </div>
                  )}

                  {/* OUT OF STOCK */}

                  {isOutOfStock && (
                    <div
                      className="
                        absolute
                        right-4
                        top-4
                        rounded-full
                        bg-black/80
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-white
                        backdrop-blur-sm
                      "
                    >
                      Out of stock
                    </div>
                  )}

                  {/* ZOOM */}

                  {productImages.length >
                    0 && (
                    <div
                      className="
                        pointer-events-none
                        absolute
                        bottom-4
                        right-4
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        text-slate-700
                        opacity-0
                        shadow-md
                        backdrop-blur
                        transition-opacity
                        group-hover:opacity-100
                      "
                    >
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  )}

                  {/* PREVIOUS */}

                  {productImages.length >
                    1 && (
                    <button
                      type="button"
                      onClick={
                        handlePreviousImage
                      }
                      aria-label="Previous image"
                      className="
                        absolute
                        left-3
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        text-slate-900
                        opacity-0
                        shadow-lg
                        transition-all
                        hover:scale-105
                        group-hover:opacity-100
                      "
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  )}

                  {/* NEXT */}

                  {productImages.length >
                    1 && (
                    <button
                      type="button"
                      onClick={
                        handleNextImage
                      }
                      aria-label="Next image"
                      className="
                        absolute
                        right-3
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-full
                        bg-white/90
                        text-slate-900
                        opacity-0
                        shadow-lg
                        transition-all
                        hover:scale-105
                        group-hover:opacity-100
                      "
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* THUMBNAILS */}

                {productImages.length >
                  1 && (
                  <div className="mt-3">
                    <div
                      className="
                        flex
                        gap-2
                        overflow-x-auto
                        pb-1
                      "
                    >
                      {productImages.map(
                        (
                          image,
                          index
                        ) => (
                          <button
                            type="button"
                            key={`${image}-${index}`}
                            onClick={() =>
                              setSelectedImage(
                                index
                              )
                            }
                            className={`
                              relative
                              h-16
                              w-16
                              shrink-0
                              overflow-hidden
                              rounded-lg
                              border-2
                              bg-muted
                              transition-all
                              sm:h-20
                              sm:w-20
                              ${
                                selectedImage ===
                                index
                                  ? "border-indigo-600 ring-2 ring-indigo-600/20"
                                  : "border-transparent hover:border-indigo-300"
                              }
                            `}
                          >
                            <img
                              src={image}
                              alt={`${productDetails?.title} ${
                                index + 1
                              }`}
                              className="h-full w-full object-cover"
                            />

                            {selectedImage ===
                              index && (
                              <span
                                className="
                                  absolute
                                  inset-0
                                  bg-indigo-600/10
                                "
                              />
                            )}
                          </button>
                        )
                      )}
                    </div>

                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {selectedImage + 1} /{" "}
                      {productImages.length}
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="flex flex-col justify-center">
                <div className="space-y-5">

                  {/* TITLE */}

                  <div>
                    <p
                      className="
                        mb-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-widest
                        text-indigo-600
                      "
                    >
                      {productDetails?.brand ||
                        "Product"}
                    </p>

                    <h2
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        sm:text-3xl
                      "
                    >
                      {productDetails?.title}
                    </h2>

                    {productDetails?.category && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {productDetails.category}
                      </p>
                    )}
                  </div>

                  {/* RATING */}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <StarIcon
                        className="
                          h-5
                          w-5
                          fill-yellow-400
                          text-yellow-400
                        "
                      />

                      <span className="font-semibold">
                        {averageReview.toFixed(
                          1
                        )}
                      </span>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      ({reviews?.length || 0}{" "}
                      reviews)
                    </span>
                  </div>

                  <Separator />

                  {/* DESCRIPTION */}

                  <p
                    className="
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    {productDetails?.description}
                  </p>

                  {/* =================================================
                      COLOR SELECTOR
                  ================================================= */}

                  {hasVariants &&
                    availableColors.length >
                      0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Color
                        </Label>

                        {selectedColor && (
                          <span className="text-sm text-muted-foreground">
                            {selectedColor}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {availableColors.map(
                          (color) => {
                            const isSelected =
                              selectedColor ===
                              color;

                            const colorHasStock =
                              variants.some(
                                (variant) =>
                                  String(
                                    variant?.color ||
                                      ""
                                  ).trim() ===
                                    color &&
                                  Number(
                                    variant?.stock ||
                                      0
                                  ) > 0
                              );

                            return (
                              <button
                                key={color}
                                type="button"
                                disabled={
                                  !isColorAvailable(
                                    color
                                  )
                                }
                                onClick={() =>
                                  handleColorSelect(
                                    color
                                  )
                                }
                                className={`
                                  relative
                                  min-w-[90px]
                                  rounded-xl
                                  border-2
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-medium
                                  transition-all
                                  ${
                                    isSelected
                                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20"
                                      : "border-border bg-background hover:border-indigo-300"
                                  }
                                  ${
                                    !colorHasStock
                                      ? "opacity-50"
                                      : ""
                                  }
                                `}
                              >
                                {isSelected && (
                                  <Check className="mr-1 inline-block h-4 w-4" />
                                )}

                                {color}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      SIZE SELECTOR
                  ================================================= */}

                  {hasVariants &&
                    availableSizes.length >
                      0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Size
                        </Label>

                        {selectedSize && (
                          <span className="text-sm text-muted-foreground">
                            {selectedSize}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {availableSizes.map(
                          (size) => {
                            const isSelected =
                              selectedSize ===
                              size;

                            const available =
                              isSizeAvailable(
                                size
                              );

                            return (
                              <button
                                key={size}
                                type="button"
                                disabled={
                                  !available
                                }
                                onClick={() =>
                                  handleSizeSelect(
                                    size
                                  )
                                }
                                className={`
                                  min-w-[58px]
                                  rounded-xl
                                  border-2
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-semibold
                                  transition-all
                                  ${
                                    isSelected
                                      ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                                      : "border-border bg-background hover:border-indigo-300"
                                  }
                                  ${
                                    !available
                                      ? "cursor-not-allowed opacity-40 line-through"
                                      : ""
                                  }
                                `}
                              >
                                {size}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      SELECTED VARIANT
                  ================================================= */}

                  {hasVariants && (
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      {!selectedColor ||
                      !selectedSize ? (
                        <p className="text-sm font-medium text-muted-foreground">
                          Select a color and size
                          to see price and stock.
                        </p>
                      ) : noMatchingVariant ? (
                        <p className="text-sm font-medium text-destructive">
                          This color and size
                          combination is not
                          available.
                        </p>
                      ) : selectedVariant ? (
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Selected variant
                            </p>

                            <p className="mt-1 font-semibold">
                              {selectedVariant.color ||
                                "Default"}{" "}
                              +{" "}
                              {selectedVariant.size ||
                                "Default"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Variant stock
                            </p>

                            <p
                              className={`text-sm font-semibold ${
                                currentStock <=
                                0
                                  ? "text-red-600"
                                  : currentStock <
                                    10
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {currentStock}{" "}
                              available
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* =================================================
                      PRICE
                  ================================================= */}

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl font-bold text-indigo-600">
                      ₹
                      {Number(
                        displayPrice || 0
                      ).toFixed(0)}
                    </span>

                    {hasCurrentSale && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₹
                        {Number(
                          currentPrice || 0
                        ).toFixed(0)}
                      </span>
                    )}

                    {hasCurrentSale && (
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                        {discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* =================================================
                      STOCK
                  ================================================= */}

                  <div
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      p-3
                      text-sm
                      ${
                        variantSelectionRequired
                          ? "border-indigo-500/30 bg-indigo-500/5 text-indigo-700"
                          : noMatchingVariant
                          ? "border-destructive/30 bg-destructive/5 text-destructive"
                          : isOutOfStock
                          ? "border-destructive/30 bg-destructive/5 text-destructive"
                          : isLowStock
                          ? "border-orange-500/30 bg-orange-500/5 text-orange-700"
                          : "border-border bg-muted/40 text-muted-foreground"
                      }
                    `}
                  >
                    <Package className="h-4 w-4 shrink-0" />

                    {variantSelectionRequired
                      ? "Select a variant to check stock."
                      : noMatchingVariant
                      ? "This variant is unavailable."
                      : isOutOfStock
                      ? "This variant is currently out of stock."
                      : isLowStock
                      ? `Only ${currentStock} items left in stock.`
                      : `${currentStock} items available.`}
                  </div>

                  {/* =================================================
                      ADD TO CART
                  ================================================= */}

                  <Button
                    disabled={
                      hasVariants
                        ? variantSelectionRequired ||
                          noMatchingVariant ||
                          isOutOfStock
                        : isOutOfStock
                    }
                    onClick={
                      handleAddToCart
                    }
                    className="
                      h-12
                      w-full
                      rounded-xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-pink-500
                      text-base
                      font-semibold
                      text-white
                      hover:from-indigo-700
                      hover:to-pink-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />

                    {hasVariants &&
                    variantSelectionRequired
                      ? "Select Variant"
                      : isOutOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>

                  {/* =================================================
                      DELIVERY
                  ================================================= */}

                  {!isOutOfStock &&
                    !noMatchingVariant &&
                    !variantSelectionRequired && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <Truck className="h-4 w-4" />

                            <span className="text-sm font-semibold">
                              Delivery
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Fast delivery available
                          </p>
                        </div>

                        <div className="rounded-xl border p-3">
                          <div className="mb-1 flex items-center gap-2">
                            <Package className="h-4 w-4" />

                            <span className="text-sm font-semibold">
                              Stock
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            {currentStock}{" "}
                            available
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* =================================================
                REVIEWS
            ================================================= */}

            <div className="mt-10">
              <Separator />

              <div className="mt-8">
                <h3 className="text-xl font-bold">
                  Customer Reviews
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  See what other customers
                  think about this product.
                </p>
              </div>

              {/* EXISTING REVIEWS */}

              <div className="mt-6 space-y-4">
                {reviews &&
                reviews.length > 0 ? (
                  reviews.map(
                    (
                      reviewItem,
                      index
                    ) => (
                      <div
                        key={
                          reviewItem?._id ||
                          index
                        }
                        className="
                          rounded-2xl
                          border
                          bg-card
                          p-4
                          transition-shadow
                          hover:shadow-sm
                        "
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {reviewItem?.userName
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <p className="font-semibold">
                              {
                                reviewItem?.userName
                              }
                            </p>

                            <div className="mt-1">
                              <StarRatingComponent
                                rating={
                                  reviewItem?.reviewValue
                                }
                                handleRatingChange={() => {}}
                              />
                            </div>

                            <p
                              className="
                                mt-3
                                text-sm
                                leading-6
                                text-muted-foreground
                              "
                            >
                              {
                                reviewItem?.reviewMessage
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <div
                    className="
                      rounded-2xl
                      border
                      border-dashed
                      p-8
                      text-center
                    "
                  >
                    <StarIcon className="mx-auto h-8 w-8 text-muted-foreground" />

                    <p className="mt-3 font-medium">
                      No reviews yet
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Be the first person to
                      review this product.
                    </p>
                  </div>
                )}
              </div>

              {/* WRITE REVIEW */}

              <div
                className="
                  mt-8
                  rounded-2xl
                  border
                  bg-muted/30
                  p-5
                "
              >
                <h3 className="text-lg font-semibold">
                  Write a Review
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Share your experience with
                  this product.
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <Label className="mb-2 block">
                      Your Rating
                    </Label>

                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={
                        handleRatingChange
                      }
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">
                      Your Review
                    </Label>

                    <Input
                      name="reviewMsg"
                      value={reviewMsg}
                      onChange={(event) =>
                        setReviewMsg(
                          event.target.value
                        )
                      }
                      placeholder="Write your review..."
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <Button
                    onClick={
                      handleAddReview
                    }
                    disabled={
                      reviewMsg.trim() ===
                        "" ||
                      rating === 0
                    }
                    className="
                      rounded-xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-pink-500
                      text-white
                      hover:from-indigo-700
                      hover:to-pink-600
                    "
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;