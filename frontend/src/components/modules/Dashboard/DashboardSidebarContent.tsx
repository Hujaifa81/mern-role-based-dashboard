"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.interface";
import { UserInfo } from "@/types/user.interface";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/services/auth/logoutUser";
import Image from "next/image";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen max-h-screen bg-slate-900 text-slate-100 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
        {!collapsed && (
          <Link href={dashboardHome}>
            <h1 className="text-xl font-semibold tracking-wide">Dashboard</h1>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="grow px-2 py-4 min-h-0">
        <nav className="space-y-2">
          {navItems.map((section, idx) => (
            <div key={section.title || idx} className="space-y-2">
              {section.title && !collapsed && (
                <div className="px-3 pt-4 pb-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </h4>
                </div>
              )}

              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = getIconComponent(item.icon);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors",
                      collapsed && "justify-center",
                      isActive
                        ? "bg-slate-800 text-white"
                        : "hover:bg-slate-800 text-slate-300"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon size={20} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-700 text-slate-200 border-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      <div className="px-2 py-3 border-t border-slate-800">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors",
            collapsed && "justify-center"
          )}
        >
          <div className="relative shrink-0">
            {userInfo.picture ? (
              <Image
                src={userInfo.picture}
                alt={userInfo.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-slate-900" />
          </div>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="px-2 py-4 border-t border-slate-800">
        <form action={logoutUser}>
          <button
            type="submit"
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-red-600/20 text-red-400 transition-colors",
              collapsed && "justify-center"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
};

export default DashboardSidebarContent;
