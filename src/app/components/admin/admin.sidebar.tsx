import { Home, BookA, FileText, Tag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "root/components/ui/sidebar";

const navigationItems = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "Course", href: "/admin/course/list", icon: BookA },
  { name: "Content", href: "/admin/content/list", icon: FileText },
  { name: "Category", href: "/admin/category/list", icon: Tag },
];

const AdminSidebar = () => {
  const location = useLocation(); // para saber en qué página está el usuario

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b justify-center h-16">
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {navigationItems.map(({ name, href, icon: Icon }) => (
            <SidebarMenuItem key={name}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === href}
                tooltip={name}
              >
                <Link to={href} className="flex gap-4 items-center hover:bg-gray-200 p-3 rounded">
                  <Icon className="h-10 w-10 text-purple-600" /> {/* Tamaño grande y color morado */}
                  <span className="text-lg font-semibold text-gray-800">{name}</span> {/* Texto estilizado */}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;