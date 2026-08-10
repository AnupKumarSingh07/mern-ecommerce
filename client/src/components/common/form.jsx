import { useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

function CommonForm({
  formControls = [],
  formData = {},
  setFormData,
  onSubmit,
  buttonText = "Submit",
  isBtnDisabled = false,
  loading = false,
}) {
  const handleInputChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const handleSelectChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

  const renderInput = (control) => {
    const value = formData?.[control.name] ?? "";

    switch (control.componentType) {
      case "textarea":
        return (
          <Textarea
            id={control.name}
            name={control.name}
            value={value}
            placeholder={control.placeholder}
            onChange={handleInputChange}
            required={control.required}
            rows={4}
            className="min-h-[110px] resize-y rounded-xl border-input bg-background px-4 py-3 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2"
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(selectedValue) =>
              handleSelectChange(control.name, selectedValue)
            }
          >
            <SelectTrigger className="h-11 rounded-xl border-input bg-background px-4 shadow-sm transition-all focus:ring-2">
              <SelectValue
                placeholder={
                  control.placeholder || `Select ${control.label}`
                }
              />
            </SelectTrigger>

            <SelectContent>
              {control.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            id={control.name}
            name={control.name}
            type={control.type || "text"}
            value={value}
            placeholder={control.placeholder}
            onChange={handleInputChange}
            required={control.required}
            autoComplete={control.autoComplete}
            minLength={control.minLength}
            maxLength={control.maxLength}
            pattern={control.pattern}
            className="h-11 rounded-xl border-input bg-background px-4 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:ring-2"
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {formControls.map((control) => (
        <div key={control.name} className="space-y-2">
          <Label
            htmlFor={control.name}
            className="text-sm font-medium"
          >
            {control.label}
          </Label>

          {renderInput(control)}
        </div>
      ))}

      <Button
        type="submit"
        className="mt-2 h-11 w-full rounded-xl text-sm font-semibold shadow-sm transition-all hover:shadow-md"
        disabled={loading || isBtnDisabled}
      >
        {loading ? "Please wait..." : buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;