import { AlignJustify, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6">
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
        aria-label="Open sidebar"
      >
        <AlignJustify className="h-5 w-5" />
      </Button>

      {/* Right Section */}
      <div className="ml-auto flex items-center gap-3 md:gap-4">
        {/* Admin Info */}
        <div className="hidden items-center gap-2 md:flex">
          <UserCircle2 className="h-8 w-8 text-primary" />

          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {user?.userName || "Admin"}
            </span>

            <span className="text-xs text-muted-foreground">
              Administrator
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;