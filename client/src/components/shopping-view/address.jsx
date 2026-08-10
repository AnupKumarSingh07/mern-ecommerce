import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";

import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";

import AddressCard from "./address-card";
import { useToast } from "../ui/use-toast";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { addressList } = useSelector((state) => state.shopAddress);

  const { toast } = useToast();

  function handleManageAddress(event) {
    event.preventDefault();

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);

      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    if (currentEditedId !== null) {
      dispatch(
        editaAddress({
          userId: user?.id,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));

          setCurrentEditedId(null);
          setFormData(initialAddressFormData);

          toast({
            title: "Address updated successfully",
          });
        }
      });
    } else {
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllAddresses(user?.id));

          setFormData(initialAddressFormData);

          toast({
            title: "Address added successfully",
          });
        }
      });
    }
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({
        userId: user?.id,
        addressId: getCurrentAddress?._id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));

        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);

    setFormData({
      address: getCurrentAddress?.address || "",
      city: getCurrentAddress?.city || "",
      phone: getCurrentAddress?.phone || "",
      pincode: getCurrentAddress?.pincode || "",
      notes: getCurrentAddress?.notes || "",
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAllAddresses(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="space-y-8">
      {/* Saved Addresses */}
      <Card className="w-full">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">
              Shipping Address
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Select an address for your order
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          {addressList && addressList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {addressList.map((singleAddressItem) => (
                <AddressCard
                  key={singleAddressItem?._id}
                  addressInfo={singleAddressItem}
                  handleDeleteAddress={handleDeleteAddress}
                  handleEditAddress={handleEditAddress}
                  setCurrentSelectedAddress={
                    setCurrentSelectedAddress
                  }
                  selectedId={selectedId}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-center">
              <p className="font-medium">
                No saved addresses
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Add an address below to continue with checkout.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Address */}
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">
            {currentEditedId !== null
              ? "Edit Address"
              : "Add New Address"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5">
          <CommonForm
            formControls={addressFormControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={
              currentEditedId !== null ? "Update Address" : "Add Address"
            }
            onSubmit={handleManageAddress}
            isBtnDisabled={!isFormValid()}
          />

          {currentEditedId !== null && (
            <button
              type="button"
              onClick={() => {
                setCurrentEditedId(null);
                setFormData(initialAddressFormData);
              }}
              className="mt-3 w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel editing
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Address;