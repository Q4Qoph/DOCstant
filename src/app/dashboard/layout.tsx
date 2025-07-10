"use client"

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Patient } from "@/types";
import { useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="relative z-40 md:relative md:z-auto h-full ">
                {/* Mobile sidebar */}
                <div
                    className={cn(
                        "fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
                        sidebarCollapsed ? "-translate-x-full" : "translate-x-0"
                    )}
                >
                    <DashboardSidebar collapsed={false} />
                </div>

                {/* Desktop sidebar */}
                <div className="h-full hidden md:block">
                    <DashboardSidebar collapsed={sidebarCollapsed} />
                </div>
            </div>

            {!sidebarCollapsed && (
                <div
                    onClick={() => setSidebarCollapsed(true)}
                    className="fixed inset-0 bg-black opacity-40 md:hidden z-30"
                />
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardTopbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <main className="h-[90h] flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout