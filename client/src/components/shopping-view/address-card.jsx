import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  // Check if selected by matching either object ID or direct ID
  const isSelected =
    (selectedId?._id && selectedId._id === addressInfo?._id) ||
    selectedId === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all duration-200 ${
        isSelected
          ? "border-primary border-[2px] shadow-sm bg-accent/20"
          : "border-border hover:border-muted-foreground/40"
      }`}
    >
      <CardContent className="grid p-4 gap-2">
        <div className="flex flex-col">
          <Label className="font-semibold text-base">
            {addressInfo?.address}
          </Label>
          <span className="text-sm text-muted-foreground">
            {addressInfo?.city}, {addressInfo?.pincode}
          </span>
          <span className="text-sm text-muted-foreground mt-1">
            Phone: {addressInfo?.phone}
          </span>
          {addressInfo?.notes && (
            <span className="text-xs text-muted-foreground/80 mt-1 italic">
              Note: {addressInfo?.notes}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;