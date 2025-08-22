"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    Plus,
    Phone,
    MapPin,
    Heart,
    Syringe,
    Stethoscope,
    Calendar,
    Search,
    Users,
    Activity,
    TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import { useAuth } from "@/contexts/AuthContext";

export default function Records() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuth()

    const router = useRouter()

    const { data: patients, isLoading } = useQuery({
        queryKey: ["patients"],
        queryFn: async () => {
            const response = await api.get("/api/diagnosisrecord", { params: { companyId: user?.companyId } });
            return response.data;
        },
    });

    const onAdd = () => {
        setIsSheetOpen(true);
    };

    const onView = (id: string) => {
        console.log("Clicked!!")
        router.push(`/dashboard/patients/${id}`)
    };

    const patientsArray = Array.isArray(patients) ? patients : [];

    const filteredPatients = patientsArray.filter((patient: any) =>
        patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phoneNumber?.includes(searchQuery) ||
        patient.address?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[hsl(210,100%,50%)/.1]" />
                <div className="relative px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl font-bold">Patients Records</h1>
                                <p className=" text-lg">
                                    Review and manage patient diagnosis records
                                </p>
                            </div>

                            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        onClick={onAdd}
                                        size="lg"
                                        className="bg-[#0c9aff] hover:bg-blue-400 transition-all duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add New Patient
                                    </Button>
                                </SheetTrigger>
                                <PatientForm setIsSheetOpen={setIsSheetOpen} onCancel={() => setIsSheetOpen(false)} />
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 py-8 max-w-7xl mx-auto">
                {/* Stats */}
                {patients && patients.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="shadow-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-[hsl(199,89%,48%)/.1]">
                                        <Users className="h-6 w-6 text-[hsl(199,89%,48%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[hsl(215,20%,65%)]">
                                            Total Patients
                                        </p>
                                        <p className="text-2xl font-bold text-[hsl(215,25%,27%)]">
                                            {patients.length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-[hsl(142,76%,36%)/.1]">
                                        <Activity className="h-6 w-6 text-[hsl(142,76%,36%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[hsl(215,20%,65%)]">
                                            Active Cases
                                        </p>
                                        <p className="text-2xl font-bold text-[hsl(215,25%,27%)]">
                                            {patients.filter((p: any) => p.examinations?.length > 0).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-full bg-[hsl(38,92%,50%)/.1]">
                                        <TrendingUp className="h-6 w-6 text-[hsl(38,92%,50%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[hsl(215,20%,65%)]">
                                            Vaccinated
                                        </p>
                                        <p className="text-2xl font-bold text-[hsl(215,25%,27%)]">
                                            {patients.filter((p: any) => p.vaccinations?.length > 0).length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Search */}
                {patients && patients.length > 0 && (
                    <div className="mb-8">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(215,20%,65%)]" />
                            <Input
                                placeholder="Search patients by name, phone, or address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white"
                            />
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center p-8">Loading patients...</div>
                ) : !patients || patients.length === 0 ? (
                    <Card className="shadow-none">
                        <CardContent className="text-center p-12">
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="p-4 rounded-full bg-[hsl(215,20%,65%)/.5] w-fit mx-auto">
                                    <Users className="h-8 w-8 text-[hsl(215,20%,65%)]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[hsl(215,25%,27%)]">
                                    No records found
                                </h3>
                                <p className="text-[hsl(215,20%,65%)]">
                                    Get started by adding your first patient
                                </p>
                                <Button onClick={onAdd} className="mt-4 bg-[#0c9aff] hover:bg-blue-400">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Record First Patient
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredPatients.reverse().map((patient: any, index: number) => (
                            <PatientCard
                                onView={onView}
                                key={index}
                                patient={patient} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
