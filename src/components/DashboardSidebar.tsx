"use client"

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, FileText, Package, TestTube, Calendar, Settings, LogOut, User, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
  collapsed: boolean;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FileText, href: '/dashboard' },
      { id: 'users', label: 'Users', icon: Users, href: '/dashboard/users' },
    ];

    switch (user?.role) {
      case 'RN':
        return [
          ...baseItems,
          { id: 'patient-registration', label: 'Register Patient', icon: Plus, href: '/patient-registration' },
          { id: 'payments', label: 'Payments', icon: Package, href: '/payments' },
          { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
        ];
      case 'GP':
      case 'C':
        return [
          ...baseItems,
          { id: 'consultations', label: 'Consultations', icon: User, href: '/consultations' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Package, href: '/prescriptions' },
          { id: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments' },
        ];
      case 'P':
        return [
          ...baseItems,
          { id: 'prescriptions', label: 'Prescriptions', icon: Package, href: '/prescriptions' },
          { id: 'inventory', label: 'Inventory', icon: Package, href: '/inventory' },
        ];
      case 'L':
        return [
          ...baseItems,
          { id: 'lab-results', label: 'Lab Results', icon: TestTube, href: '/lab-results' },
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'Users', icon: Users, href: '/users' },
          { id: 'departments', label: 'Departments', icon: Settings, href: '/departments' },
          { id: 'inventory', label: 'Inventory', icon: Package, href: '/inventory' },
          { id: 'reports', label: 'Reports', icon: FileText, href: '/reports' },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 h-full flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
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
              <Link key={item.id} href={item.href}  className={cn(
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
            <p className="text-xs text-gray-500">{user?.role}</p>
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

export default DashboardSidebar;