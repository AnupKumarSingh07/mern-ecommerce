import { MapPin, Phone, Pencil, Trash2, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={() =>
        setCurrentSelectedAddress &&
        setCurrentSelectedAddress(addressInfo)
      }
      className={`
        relative
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        bg-background
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        ${
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border"
        }
      `}
    >
      {/* Selected Badge */}
      {isSelected && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
          <Check className="h-3 w-3" />
          Selected
        </div>
      )}

      <CardContent className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-start gap-3 pr-20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-5 w-5 text-foreground" />
          </div>

          <div>
            <h3 className="text-base font-semibold">
              Shipping Address
            </h3>

            <p className="text-xs text-muted-foreground">
              Delivery address
            </p>
          </div>
        </div>

        {/* Address Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="font-medium">
                {addressInfo?.address}
              </p>

              <p className="text-muted-foreground">
                {addressInfo?.city} - {addressInfo?.pincode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />

            <p className="font-medium">
              {addressInfo?.phone}
            </p>
          </div>
        </div>

        {/* Notes */}
        {addressInfo?.notes && (
          <div className="mt-4 rounded-xl bg-muted/50 px-3 py-2">
            <p className="mb-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Notes
            </p>

            <p className="text-sm">
              {addressInfo.notes}
            </p>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/20 p-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 rounded-lg"
          onClick={(event) => {
            event.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          <Pencil className="mr-2 h-3.5 w-3.5" />
          Edit
        </Button>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-9 rounded-lg"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;