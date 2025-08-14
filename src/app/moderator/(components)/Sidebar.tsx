"use client"

import { cn, getRoleDisplayName } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, FileText, Package, TestTube, Calendar, Settings, LogOut, User, Plus, List, HeartPulse, Pill, BedDouble, Bell, MSquareIcon, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FileText, href: '/moderator' },
      // { id: 'subs', label: 'Subscribers', icon: Users, href: '/moderator/subscribers' },
      // { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/moderator/chat' },
      // { id: 'notifications', label: 'Notifications', icon: Bell, href: '/moderator/notifications' },
    ];
    return baseItems
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 h-full flex flex-col fixed z-50 top-0 left-0",
        collapsed ? "w-16" : "w-64",
        "md:relative md:z-auto" // On desktop, default positioning
      )}
    >
      {/* Logo Section */}
      <div className="p-4">
        <div className="">
          {collapsed && (
            <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm p-2">DOC</span>
            </div>
          )}
          {!collapsed && (
            <div >
              <div className="h-14 relative ">
                <Image src="/logo.png" alt="Logo" fill className="object-contain rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.id} href={item.href} className={cn(
                "flex items-center p-2 w-full justify-start transition-colors",
                collapsed ? "px-2" : "px-3",
                isActive
                  ? "bg-blue-50 text-blue-500 hover:bg-blue-100 border-l-3 border-blue-500"
                  : "hover:bg-gray-100"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-500" : "text-gray-600"
                )} />
                {!collapsed && (
                  <span className={cn(
                    "ml-2",
                    isActive ? "text-blue-500 font-medium" : "text-gray-700"
                  )}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* User Info and Logout - Fixed at bottom */}
      <div className="p-3 border-t mt-auto">
        {!collapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role || '')}</p>
            <p className="text-xs text-gray-500">{user?.phone}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full hover:bg-red-50 hover:text-red-700 transition-colors",
            collapsed ? "px-2" : "justify-start"
          )}
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;