import { Outlet } from "react-router-dom";
import { ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";

function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-muted/30">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left — Brand Panel */}
        <div className="relative hidden overflow-hidden bg-black lg:flex">
          {/* Background decoration */}
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  The MeltingPoint
                </p>

                <p className="text-xs text-white/50">
                  Shopping Experience
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="max-w-lg">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Your shopping journey starts here
              </div>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Welcome to your
                <span className="block text-white/60">
                  shopping experience.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                Discover products you love, manage your orders, and enjoy a
                simple and secure shopping experience.
              </p>

              {/* Trust point */}
              <div className="mt-8 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <ShieldCheck className="h-4 w-4 text-white/80" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Secure & trusted
                  </p>

                  <p className="text-xs text-white/50">
                    Your account and orders stay protected.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} The MeltingPoint Shopping
            </p>
          </div>
        </div>

        {/* Right — Authentication */}
        <div className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <span className="text-lg font-bold tracking-tight">
                The MeltingPoint
              </span>
            </div>

            {/* Auth Content */}
            <div className="rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;