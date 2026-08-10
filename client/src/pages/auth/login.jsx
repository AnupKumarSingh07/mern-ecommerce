import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LockKeyhole className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Sign in to your account to continue shopping and manage your
            orders.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-muted/40 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background">
              <UserRound className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <p className="text-sm font-semibold">Sign in to your account</p>
              <p className="text-xs text-muted-foreground">
                Enter your credentials below
              </p>
            </div>
          </div>

          <CommonForm
            formControls={loginFormControls}
            buttonText="Sign In"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
          />

          {/* Register */}
          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
            </p>

            <Link
              to="/auth/register"
              className="mt-2 inline-block text-sm font-semibold text-primary transition-colors hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Your account information is securely protected.</span>
        </div>
      </div>
    </div>
  );
}

export default AuthLogin;