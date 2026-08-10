import { StarIcon, ShoppingCart, Package, Truck } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
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

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    if (!reviewMsg.trim() || rating === 0) {
      toast({
        title: "Please add a rating and write a review.",
        variant: "destructive",
      });

      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");

        dispatch(getReviews(productDetails?._id));

        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails, dispatch]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce(
          (sum, reviewItem) => sum + reviewItem.reviewValue,
          0
        ) / reviews.length
      : 0;

  const isOutOfStock = productDetails?.totalStock === 0;
  const isLowStock =
    productDetails?.totalStock > 0 &&
    productDetails?.totalStock < 10;

  const isOnSale = productDetails?.salePrice > 0;

  const productImage =
    productDetails?.image ||
    productDetails?.images?.[0] ||
    productDetails?.imageUrl ||
    "";

  const discountPercentage =
    isOnSale && productDetails?.price
      ? Math.round(
          ((productDetails.price - productDetails.salePrice) /
            productDetails.price) *
            100
        )
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        className="
          max-w-5xl
          max-h-[90vh]
          overflow-y-auto
          p-0
          rounded-2xl
        "
      >
        {productDetails && (
          <div className="p-5 sm:p-7">
            {/* =====================================================
                PRODUCT SECTION
            ===================================================== */}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Product Image */}

              <div className="relative overflow-hidden rounded-2xl bg-muted">
                <div className="aspect-[4/5] w-full">
                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productDetails?.title || "Product"}
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>

                {/* Sale Badge */}

                {isOnSale && (
                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      rounded-full
                      bg-primary
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-primary-foreground
                    "
                  >
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* Stock Badge */}

                {isOutOfStock && (
                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      rounded-full
                      bg-black/80
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-white
                      backdrop-blur-sm
                    "
                  >
                    Out of stock
                  </div>
                )}
              </div>

              {/* Product Information */}

              <div className="flex flex-col justify-center">
                <div className="space-y-5">
                  {/* Product Title */}

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Product
                    </p>

                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {productDetails?.title}
                    </h2>
                  </div>

                  {/* Rating */}

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                      <span className="font-semibold">
                        {averageReview.toFixed(1)}
                      </span>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      ({reviews?.length || 0} reviews)
                    </span>
                  </div>

                  <Separator />

                  {/* Description */}

                  <p className="text-sm leading-7 text-muted-foreground">
                    {productDetails?.description}
                  </p>

                  {/* Price */}

                  <div className="flex items-center gap-3">
                    {isOnSale ? (
                      <>
                        <span className="text-3xl font-bold text-primary">
                          ${productDetails?.salePrice}
                        </span>

                        <span className="text-lg text-muted-foreground line-through">
                          ${productDetails?.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">
                        ${productDetails?.price}
                      </span>
                    )}
                  </div>

                  {/* Stock Information */}

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
                        isOutOfStock
                          ? "border-destructive/30 bg-destructive/5 text-destructive"
                          : isLowStock
                          ? "border-yellow-500/30 bg-yellow-500/5 text-yellow-700"
                          : "border-border bg-muted/40 text-muted-foreground"
                      }
                    `}
                  >
                    <Package className="h-4 w-4" />

                    {isOutOfStock
                      ? "This product is currently out of stock."
                      : isLowStock
                      ? `Only ${productDetails?.totalStock} items left in stock.`
                      : `${productDetails?.totalStock} items available.`}
                  </div>

                  {/* Add To Cart */}

                  <Button
                    disabled={isOutOfStock}
                    onClick={() =>
                      handleAddToCart(
                        productDetails?._id,
                        productDetails?.totalStock
                      )
                    }
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />

                    {isOutOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </Button>

                  {/* Delivery Info */}

                  {!isOutOfStock && (
                    <div className="grid grid-cols-2 gap-3">
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
                          {productDetails?.totalStock} available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* =====================================================
                REVIEWS SECTION
            ===================================================== */}

            <div className="mt-10">
              <Separator />

              <div className="mt-8">
                <h3 className="text-xl font-bold">
                  Customer Reviews
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  See what other customers think about this product.
                </p>
              </div>

              {/* Existing Reviews */}

              <div className="mt-6 space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem, index) => (
                    <div
                      key={reviewItem?._id || index}
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
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold">
                                {reviewItem?.userName}
                              </p>

                              <div className="mt-1">
                                <StarRatingComponent
                                  rating={reviewItem?.reviewValue}
                                  handleRatingChange={() => {}}
                                />
                              </div>
                            </div>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {reviewItem?.reviewMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed p-8 text-center">
                    <StarIcon className="mx-auto h-8 w-8 text-muted-foreground" />

                    <p className="mt-3 font-medium">
                      No reviews yet
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Be the first person to review this product.
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  WRITE REVIEW
              ================================================= */}

              <div className="mt-8 rounded-2xl border bg-muted/30 p-5">
                <h3 className="text-lg font-semibold">
                  Write a Review
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Share your experience with this product.
                </p>

                <div className="mt-5 space-y-5">
                  {/* Rating */}

                  <div>
                    <Label className="mb-2 block">
                      Your Rating
                    </Label>

                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>

                  {/* Review Input */}

                  <div>
                    <Label className="mb-2 block">
                      Your Review
                    </Label>

                    <Input
                      name="reviewMsg"
                      value={reviewMsg}
                      onChange={(event) =>
                        setReviewMsg(event.target.value)
                      }
                      placeholder="Write your review..."
                      className="h-11 rounded-xl"
                    />
                  </div>

                  {/* Submit */}

                  <Button
                    onClick={handleAddReview}
                    disabled={
                      reviewMsg.trim() === "" ||
                      rating === 0
                    }
                    className="rounded-xl"
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