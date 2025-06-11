"use client"

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, FileText, Package, TestTube, Calendar, Settings, LogOut, User, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, collapsed }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FileText },
      { id: 'patients', label: 'Patients', icon: Users },
    ];

    switch (user?.role) {
      case 'RN':
        return [
          ...baseItems,
          { id: 'patient-registration', label: 'Register Patient', icon: Plus },
          { id: 'payments', label: 'Payments', icon: Package },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
        ];
      case 'GP':
      case 'C':
        return [
          ...baseItems,
          { id: 'consultations', label: 'Consultations', icon: User },
          { id: 'prescriptions', label: 'Prescriptions', icon: Package },
          { id: 'appointments', label: 'Appointments', icon: Calendar },
        ];
      case 'P':
        return [
          ...baseItems,
          { id: 'prescriptions', label: 'Prescriptions', icon: Package },
          { id: 'inventory', label: 'Inventory', icon: Package },
        ];
      case 'L':
        return [
          ...baseItems,
          { id: 'lab-results', label: 'Lab Results', icon: TestTube },
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'Users', icon: Users },
          { id: 'departments', label: 'Departments', icon: Settings },
          { id: 'inventory', label: 'Inventory', icon: Package },
          { id: 'reports', label: 'Reports', icon: FileText },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4">
        <div className="">
          {
            collapsed &&
            <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm p-2 ">DOC</span>
            </div>
          }
          {!collapsed && (
            <div className="p-4">
              <div className="h-14 relative">
                <Image src="/logo.png" alt="Logo" fill className="object-contain rounded-lg" />
              </div>
            </div>
          )}
        </div>
      </div>


      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  collapsed ? "px-2" : "px-3"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span className="ml-2">{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        {!collapsed && (
          <div className="mb-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
            <p className="text-xs text-gray-500">{user?.phone}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn("w-full", collapsed ? "px-2" : "justify-start")}
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