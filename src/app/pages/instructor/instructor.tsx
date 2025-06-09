import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "root/components/ui/sidebar";
import InstructorSidebar from "app/components/instructor/instructor.sidebar";
import { Separator } from "root/components/ui/separator";
import InstructorHeader from "app/components/instructor/instructor.header";

import { Toaster } from "root/components/ui/sonner";

export default function InstructorPage() {
  return (
    <SidebarProvider>
      <InstructorSidebar />
      <SidebarInset>
        <InstructorHeader />
        <Separator />
        <div className="p-4"></div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
