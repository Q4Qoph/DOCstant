"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import NewRecordForm from "./NewRecordForm";

const patients = [{
    id: "1",
    name: "Jane Doe",
    age: 32,
    idNumber: "12345678",
    phoneNumber: "0712345678",
    address: "123 Nairobi St",
    isPregnant: true,
    vaccinations: [1, 2],
    examinations: [1],
    medicalHistory: "Previous medical history includes routine checkups and one hospitalization."
},
{
    id: "2",
    name: "Jane Doe",
    age: 32,
    idNumber: "12345678",
    phoneNumber: "0712345678",
    address: "123 Nairobi St",
    isPregnant: true,
    vaccinations: [1, 2],
    examinations: [1],
    medicalHistory: "Previous medical history includes routine checkups and one hospitalization."
}]

export default function Records() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['records'],
        queryFn: () => api.get("/api/diagnosisrecord"),
    });

    const router = useRouter()

    const onAdd = () => {
        setIsSheetOpen(true);
    };

    const onView = (id: string) => {
        router.push(`/dashboard/records/${id}`)
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold t">Diagnosis Records</h1>
                {/* <Button
                    onClick={onAdd}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Patient
                </Button> */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={onAdd} className="flex bg-blue-500 hover:bg-blue-600 items-center space-x-2">
                            <Plus className="h-4 w-4 mr-2" />
                            <span>Add New Patient</span>
                        </Button>
                    </SheetTrigger>
                    <NewRecordForm
                        isOpen={isSheetOpen}
                        onClose={() => setIsSheetOpen(false)}
                    />
                </Sheet>
            </div>

            {isLoading ? (
                <div className="text-center py-8 600">Loading patients...</div>
            ) : patients.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="600 text-lg">No patients found.</p>
                        <Button onClick={onAdd} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                            Add First Patient
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {patients.map((patient, index) => (
                        <Card key={index} className="border-blue-200">
                            <CardHeader className="border-b border-blue-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="900">{patient.name}</CardTitle>
                                        <p className="700 text-sm">
                                            Age: {patient.age} • ID: {patient.idNumber}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => onView(patient.id)}
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-300 700 hover:bg-blue-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="700 font-medium">Phone:</p>
                                        <p className="text-gray-700">{patient.phoneNumber}</p>
                                    </div>
                                    <div>
                                        <p className="700 font-medium">Address:</p>
                                        <p className="text-gray-700 truncate">{patient.address}</p>
                                    </div>
                                    <div>
                                        <p className="700 font-medium">Status:</p>
                                        <div className="flex gap-1 mt-1 flex-wrap">
                                            {patient.isPregnant && (
                                                <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                                                    Pregnant
                                                </Badge>
                                            )}
                                            <Badge className="bg-blue-100 800 border-blue-300">
                                                {patient.vaccinations.length} Vaccination{patient.vaccinations.length !== 1 ? "s" : ""}
                                            </Badge>
                                            <Badge className="bg-green-100 text-green-800 border-green-300">
                                                {patient.examinations.length} Examination{patient.examinations.length !== 1 ? "s" : ""}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-blue-100">
                                    <p className="700 font-medium text-xs mb-1">Medical History:</p>
                                    <p className="text-gray-600 text-xs line-clamp-2">
                                        {patient.medicalHistory.length > 100
                                            ? `${patient.medicalHistory.substring(0, 100)}...`
                                            : patient.medicalHistory}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
