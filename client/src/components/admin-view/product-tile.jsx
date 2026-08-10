import { Edit, Trash2, Tag } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const {
    _id,
    image,
    title,
    price,
    salePrice,
    totalStock,
  } = product;

  const hasDiscount = Number(salePrice) > 0;

  return (
    <Card className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.png"}
          alt={title || "Product"}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Sale Badge */}
        {hasDiscount && (
          <Badge className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            <Tag className="mr-1 h-3 w-3" />
            Sale
          </Badge>
        )}

        {/* Stock Badge */}
        <Badge
          variant={totalStock > 0 ? "secondary" : "destructive"}
          className="absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm"
        >
          {totalStock > 0
            ? `${totalStock} In Stock`
            : "Out of Stock"}
        </Badge>
      </div>

      {/* Product Details */}
      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 tracking-tight">
            {title || "Untitled Product"}
          </h2>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-bold text-green-600">
                ₹{Number(salePrice).toFixed(2)}
              </span>

              <span className="text-sm text-muted-foreground line-through">
                ₹{Number(price || 0).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold">
              ₹{Number(price || 0).toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="grid grid-cols-2 gap-3 p-5 pt-0">
        <Button
          variant="outline"
          className="h-10 rounded-xl"
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(_id);
            setFormData(product);
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="destructive"
          className="h-10 rounded-xl"
          onClick={() => handleDelete(_id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;