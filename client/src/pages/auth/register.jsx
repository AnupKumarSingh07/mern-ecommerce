import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });

        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message || "Registration failed",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-7 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Create new account
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Sign up to start shopping with us
        </p>
      </div>

      {/* Form */}
      <CommonForm
        formControls={registerFormControls}
        buttonText="Create Account"
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* Login Link */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-foreground underline-offset-4 transition-colors hover:underline"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default AuthRegister;