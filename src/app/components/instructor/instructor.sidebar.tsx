import { BookA, FileText, Home, BarChart, Users } from "lucide-react";
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
  { name: "Dashboard", href: "/instructor/dashboard", icon: Home },
  { name: "Mis Cursos", href: "/instructor/courses", icon: BookA },
  { name: "Contenido", href: "/instructor/content", icon: FileText },
  { name: "Estudiantes", href: "/instructor/students", icon: Users },
  { name: "Informes", href: "/instructor/reports", icon: BarChart },
];

const InstructorSidebar = () => {
  const location = useLocation();

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
                isActive={
                  location.pathname === href ||
                  location.pathname.startsWith(`${href}/`)
                }
                tooltip={name}
              >
                <Link
                  to={href}
                  className="flex gap-4 items-center hover:bg-gray-200 p-3 rounded"
                >
                  <Icon className="h-5 w-5 text-purple-600" />
                  <span className="text-base font-medium text-gray-800">
                    {name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default InstructorSidebar;
