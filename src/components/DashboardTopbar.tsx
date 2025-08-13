"use client"

import { Button } from '@/components/ui/button';
import { Menu, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import { getRoleDisplayName } from '@/lib/utils';


interface HeaderProps {
    onToggleSidebar: () => void;
}

const DashboardTopbar: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
                        <Menu className="h-4 w-4" />
                    </Button>
                    <div>
                        <p className="text-sm text-gray-600">
                            {new Date().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <NotificationDropdown />
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardTopbar;