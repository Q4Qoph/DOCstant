"use client"

import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardTopbar from "@/components/DashboardTopbar";
import { useAuth } from "@/contexts/AuthContext";
import { Patient } from "@/types";
import { useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    return (
        <div className="flex h-screen bg-gray-50">
            <DashboardSidebar
                collapsed={sidebarCollapsed}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardTopbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout