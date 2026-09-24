import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "./header";
import AdminSideBar from "./sidebar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#f7f8fc]">
      {/* =========================================
          SIDEBAR
      ========================================= */}

      <AdminSideBar
        open={isSidebarOpen}
        setOpen={setIsSidebarOpen}
      />

      {/* =========================================
          MAIN AREA
      ========================================= */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <AdminHeader setOpen={setIsSidebarOpen} />

        {/* Page Content */}
        <main
          role="main"
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-auto
            bg-[#f7f8fc]
            px-4
            py-5
            md:px-6
            md:py-6
            lg:px-7
            lg:py-7
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;