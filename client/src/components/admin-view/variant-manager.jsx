import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

function VariantManager({ variants = [], setVariants }) {
  // ===============================
  // Add Variant
  // ===============================
  function addVariant() {
    setVariants([
      ...variants,
      {
        color: "",
        size: "",
        price: "",
        salePrice: "",
        stock: "",
      },
    ]);
  }

  // ===============================
  // Remove Variant
  // ===============================
  function removeVariant(index) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  // ===============================
  // Update Variant
  // ===============================
  function updateVariant(index, field, value) {
    const updatedVariants = [...variants];

    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };

    setVariants(updatedVariants);
  }

  return (
    <div className="mt-8 rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">
            Product Variants
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Add different color, size, price and stock combinations.
          </p>
        </div>

        <Button
          type="button"
          onClick={addVariant}
          className="w-full rounded-xl sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {/* Empty State */}
      {variants.length === 0 && (
        <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
          <p className="font-medium text-muted-foreground">
            No variants added yet
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Click "Add Variant" to create your first variant.
          </p>
        </div>
      )}

      {/* Variant List */}
      <div className="space-y-4">
        {variants.map((variant, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-slate-50/70 p-4"
          >
            {/* Variant Header */}
            <div className="mb-4 flex items-center justify-between">
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                Variant {index + 1}
              </Badge>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => removeVariant(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Color */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Color
                </label>

                <Input
                  placeholder="e.g. Black"
                  value={variant.color || ""}
                  onChange={(e) =>
                    updateVariant(index, "color", e.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              {/* Size */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Size
                </label>

                <Input
                  placeholder="e.g. M"
                  value={variant.size || ""}
                  onChange={(e) =>
                    updateVariant(index, "size", e.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Price
                </label>

                <Input
                  type="number"
                  min="0"
                  placeholder="650"
                  value={variant.price || ""}
                  onChange={(e) =>
                    updateVariant(index, "price", e.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Sale Price
                </label>

                <Input
                  type="number"
                  min="0"
                  placeholder="Optional"
                  value={variant.salePrice || ""}
                  onChange={(e) =>
                    updateVariant(index, "salePrice", e.target.value)
                  }
                  className="rounded-xl"
                />
              </div>

              {/* Stock */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">
                  Stock
                </label>

                <Input
                  type="number"
                  min="0"
                  placeholder="10"
                  value={variant.stock || ""}
                  onChange={(e) =>
                    updateVariant(index, "stock", e.target.value)
                  }
                  className="rounded-xl"
                />
              </div>
            </div>

            {/* Preview */}
            {variant.color &&
              variant.size &&
              variant.price !== "" && (
                <div className="mt-4 rounded-xl border bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold">
                      {variant.color} + {variant.size}
                    </span>

                    <span className="text-muted-foreground">
                      →
                    </span>

                    <span className="font-semibold text-indigo-600">
                      ₹{Number(variant.price || 0).toFixed(0)}
                    </span>

                    {variant.salePrice && (
                      <>
                        <span className="text-muted-foreground">
                          →
                        </span>

                        <span className="font-semibold text-pink-600">
                          Sale ₹
                          {Number(variant.salePrice || 0).toFixed(0)}
                        </span>
                      </>
                    )}

                    <span className="text-muted-foreground">
                      →
                    </span>

                    <span className="font-medium">
                      {variant.stock || 0} stock
                    </span>
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VariantManager;