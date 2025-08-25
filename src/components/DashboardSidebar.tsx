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

const DashboardSidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: FileText, href: '/dashboard' },
    ];

    switch (user?.role) {
      case 'Receptionist/Nurse':
      case 0:
        return [
          ...baseItems,
          { id: 'patients', label: 'All Patients', icon: List, href: '/dashboard/patients' },
          { id: 'admitted-patients', label: 'Admitted Patients', icon: BedDouble, href: '/dashboard/admitted-patients' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
        ];
      case 'GeneralPracticioner':
      case 1:
        return [
          ...baseItems,
          { id: 'patients', label: 'All Patients', icon: List, href: '/dashboard/patients' },
          { id: 'admitted-patients', label: 'Admitted Patients', icon: BedDouble, href: '/dashboard/admitted-patients' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
        ];
      case 'Specialist':
      case 2:
        return [
          ...baseItems,
          { id: 'patients', label: 'All Patients', icon: List, href: '/dashboard/patients' },
          { id: 'admitted-patients', label: 'Admitted Patients', icon: BedDouble, href: '/dashboard/admitted-patients' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
          { id: 'labtests', label: 'Lab Tests', icon: TestTube, href: '/dashboard/labtests' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
        ];
      case 'Pharmacist':
      case 3:
        return [
          ...baseItems,
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
          { id: 'inventory', label: 'Inventory', icon: HeartPulse, href: '/dashboard/inventory' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
        ];
      case 'Lab Technician':
      case 4:
        return [
          ...baseItems,
          { id: 'labtests', label: 'Lab Tests', icon: TestTube, href: '/dashboard/labtests' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
        ];
      case 'Admin':
      case 5:
        return [
          ...baseItems,
          { id: 'patients', label: 'All Patients', icon: List, href: '/dashboard/patients' },
          { id: 'admitted-patients', label: 'Admitted Patients', icon: BedDouble, href: '/dashboard/admitted-patients' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
          { id: 'labtests', label: 'Lab Tests', icon: TestTube, href: '/dashboard/labtests' },
          { id: 'inventory', label: 'Inventory', icon: HeartPulse, href: '/dashboard/inventory' },
          { id: 'users', label: 'Users', icon: Users, href: '/dashboard/users' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
          { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
        ];
      case 'Super Admin':
        return [
          ...baseItems,
          { id: 'patients', label: 'All Patients', icon: List, href: '/dashboard/patients' },
          { id: 'admitted-patients', label: 'Admitted Patients', icon: BedDouble, href: '/dashboard/admitted-patients' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, href: '/dashboard/prescriptions' },
          { id: 'labtests', label: 'Lab Tests', icon: TestTube, href: '/dashboard/labtests' },
          { id: 'inventory', label: 'Inventory', icon: HeartPulse, href: '/dashboard/inventory' },
          { id: 'users', label: 'Users', icon: Users, href: '/dashboard/users' },
          { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/dashboard/chat' },
          { id: 'notifications', label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
        ];
      default:
        return baseItems;
    }
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
                  ? "bg-blue-50 text-[#0c9aff] hover:bg-blue-100 border-l-3 border-[#0c9aff]"
                  : "hover:bg-gray-100"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-[#0c9aff]" : "text-gray-600"
                )} />
                {!collapsed && (
                  <span className={cn(
                    "ml-2",
                    isActive ? "text-[#0c9aff] font-medium" : "text-gray-700"
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

export default DashboardSidebar;