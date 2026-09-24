import { AlignJustify } from "lucide-react";

import { Button } from "../ui/button";

function AdminHeader({ setOpen }) {
  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        shrink-0
        items-center
        justify-between
        border-b
        border-slate-200/70
        bg-white/95
        px-4
        backdrop-blur-xl
        md:px-6
        lg:px-7
      "
    >
      {/* LEFT */}

      <div className="flex items-center gap-3">
        {/* Mobile Menu */}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(true)}
          className="
            h-9
            w-9
            rounded-lg
            border-slate-200
            bg-white
            text-slate-700
            shadow-none
            transition-all
            hover:bg-slate-50
            hover:text-slate-900
            lg:hidden
          "
          aria-label="Open sidebar"
        >
          <AlignJustify className="h-[18px] w-[18px]" />
        </Button>

        {/* Header Context */}

        <div>
          <p className="text-[13px] font-medium text-slate-500">
            Welcome back
          </p>

          <p className="hidden text-[11px] text-slate-400 sm:block">
            Manage your store from your dashboard
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div className="flex items-center">
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-200
            bg-slate-50
            px-3
            py-1.5
          "
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="text-[11px] font-semibold text-slate-600">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;