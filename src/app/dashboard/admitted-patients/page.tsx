"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Plus } from "lucide-react";
import api from "@/lib/axios";
import PatientsRecordSkeleton from "../patients/loading";
import DischargeForm from "./(components)/DischargeForm";

export default function AdmittedPatients() {
    const [dischargeOpen, setDischargeOpen] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState("")

    const {
        data: inpatients,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['inpatients'],
        queryFn: async () => {
            const response = await api.get("/api/inpatient");
            return response.data;
        },
    });

    const router = useRouter();

    const onView = (id: string) => {
        router.push(`/dashboard/admited-patients/${id}`);
    };
    const onDischarge = (id: string) => {
        setSelectedPatient(id)
        setDischargeOpen(true)
    };

    return (
        <div className="py-8">
            <div className="flex justify-between items-center mb-6 px-8">
                <div>
                    <h1 className="text-3xl font-bold">Admitted Patients</h1>
                    <p className="">Manage and review admitted patients' records</p>
                </div>
            </div>

            {isLoading ? (
                <PatientsRecordSkeleton />
            ) : inpatients.length === 0 ? (
                <Card>
                    <CardContent className="text-center p-8">
                        <p className="font-semibold text-lg">No admitted patients found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 px-8">
                    {inpatients.map((entry: any) => (
                        <Card key={entry.id}>
                            <CardHeader className="border-b">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{entry.diagnosis?.name || "Unnamed Patient"}</CardTitle>
                                        <p className="text-sm text-gray-600">Age: {entry.diagnosis?.age}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* <Button
                                            onClick={() => onView(entry.id)}
                                            variant="outline"
                                            size="sm"
                                            className="border-blue-300 hover:bg-blue-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button> */}
                                        <Button onClick={() => onDischarge(entry.id)} className="bg-blue-500 hover:bg-blue-600">
                                            {/* <Stethoscope className="h-4 w-4 mr-2" /> */}
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 text-sm grid gap-2">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="font-medium">Ward/Room/Bed</p>
                                        <p className="text-gray-700">{entry.ward} / {entry.room} / {entry.bed}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Admitted On</p>
                                        <p className="text-gray-700">{new Date(entry.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Discharge Date</p>
                                        <p className="text-gray-700">{new Date(entry.dischargeDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Days Admitted</p>
                                        <p className="text-gray-700">{entry.days}</p>
                                    </div>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="font-medium text-xs mb-1">Final Diagnosis:</p>
                                    <p className="text-gray-600 text-xs line-clamp-2">
                                        {entry.finalDiagnosis || "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            <DischargeForm
                open={dischargeOpen}
                onOpenChange={setDischargeOpen}
                patient={selectedPatient}
            />
        </div>
    );
}
