import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "./header";
import AdminSideBar from "./sidebar";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <AdminSideBar
        open={isSidebarOpen}
        setOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <AdminHeader setOpen={setIsSidebarOpen} />

        {/* Page Content */}
        <main
          role="main"
          className="flex flex-1 flex-col overflow-auto bg-muted/40 p-4 md:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;