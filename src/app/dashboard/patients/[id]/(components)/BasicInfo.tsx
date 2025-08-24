import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import {
    Phone, MapPin, User, Calendar,
    Activity, Heart, Thermometer, Weight,
    Ruler,
    Stethoscope
} from "lucide-react";
import { useState } from "react";
import AdmitPatientForm from "../../(components)/AdmitPatientForm";

const BasicInfo = ({ patient }: { patient: any }) => {
    const [admitOpen, setAdmitOpen] = useState(false);

    return (
        <TabsContent value="basic-info" className="mt-0">
            <div className="space-y-6">
                {/* Contact Info Card */}
                <Card className="border-slate-200 shadow-none w-full">
                    <CardHeader className="">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Phone className="h-5 w-5 text-green-600" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-slate-500" />
                            <div>
                                <p className="text-sm text-slate-600">Phone</p>
                                <p className="font-medium">{patient.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                            <div>
                                <p className="text-sm text-slate-600">Address</p>
                                <p className="font-medium text-slate-900">{patient.address}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vital Signs Card */}
                <Card className="border-slate-200 shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between gap-2 text-lg">
                            <p className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-600" />
                                Vital Signs & Chief Complaint
                            </p>
                            <Button onClick={() => setAdmitOpen(true)} className="bg-[#0c9aff] hover:bg-blue-050 mt-4">
                                <Stethoscope className="h-4 w-4 mr-2" />
                                Admit Patient
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-red-600" />
                                    <p className="text-sm font-medium text-red-700">Blood Pressure</p>
                                </div>
                                <p className="text-lg font-bold text-red-800">{patient.bloodPresure}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-blue-600" />
                                    <p className="text-sm font-medium text-blue-700">Temperature</p>
                                </div>
                                <p className="text-lg font-bold text-blue-800">{patient.temperature}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-green-600" />
                                    <p className="text-sm font-medium text-green-700">Heart Rate</p>
                                </div>
                                <p className="text-lg font-bold text-green-800">{patient.heartRate}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-purple-600" />
                                    <p className="text-sm font-medium text-purple-700">Respiratory Rate</p>
                                </div>
                                <p className="text-lg font-bold text-purple-800">{patient.respiratoryRate}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Weight className="h-4 w-4 text-orange-600" />
                                    <p className="text-sm font-medium text-orange-700">Weight</p>
                                </div>
                                <p className="text-lg font-bold text-orange-800">{patient.weight}</p>
                            </div>
                            <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Ruler className="h-4 w-4 text-teal-600" />
                                    <p className="text-sm font-medium text-teal-700">Height</p>
                                </div>
                                <p className="text-lg font-bold text-teal-800">{patient.height}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <h4 className="font-semibold text-slate-900 mb-3">Chief Complaint</h4>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <p className="text-slate-700">{patient.chiefComplaint}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold text-slate-900 mb-3">Current Symptoms</h4>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <p className="text-slate-700">{patient.symptoms}</p>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
            <AdmitPatientForm
                open={admitOpen}
                onOpenChange={setAdmitOpen}
                diagnosisId={patient.id}
            />
        </TabsContent>
    )
}

export default BasicInfo