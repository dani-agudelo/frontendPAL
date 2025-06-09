import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "root/components/ui/sidebar";
import AdminSidebar from "app/components/admin/admin.sidebar";
import { Separator } from "root/components/ui/separator";
import AdminHeader from "app/components/admin/admin.header";

import { Toaster } from "root/components/ui/sonner";

export default function AdminPage() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <Separator />
        <div className="p-4">
          <Outlet />
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
