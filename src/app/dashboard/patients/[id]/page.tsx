"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Trash2, Phone, MapPin, User, Calendar, FileText, Activity, TestTube, Camera, Bot } from "lucide-react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import { useQuery } from "@tanstack/react-query";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditPatientForm from "../(components)/EditPatientForm";

export const getPatientById = (id: ParamValue) => api.get(`/api/diagnosisrecord/${id}`);


const RecordDetails = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const { id } = useParams()
    const router = useRouter()

    const {
        data: patient,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["patient", id],
        queryFn: () => getPatientById(id).then((res) => res.data),
        enabled: !!id,
    });

    const onBack = () => {
        router.back()
    };

    const onEdit = () => {
        setIsSheetOpen(true);
    };

    const onDelete = () => {
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-center py-8 ">Loading patient details...</div>
            </div>
        );
    }

    // if (isError) return <div>Error</div>

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="border-blue-300  hover:bg-blue-50"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to List
                    </Button>
                    <h1 className="text-3xl font-bold ">Patient Details</h1>
                </div>
                <div className="flex gap-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button onClick={onEdit} className="flex bg-blue-500 hover:bg-blue-600 items-center space-x-2">
                                <Edit className="h-4 w-4 mr-2" />
                                <span>Update</span>
                            </Button>
                        </SheetTrigger>
                        <EditPatientForm
                            initialData={patient}
                            onCancel={() => setIsSheetOpen(false)}
                        />
                    </Sheet>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete ? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => (patient.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </div>

            {/* Basic Information */}
            <Card className="mb-6 border-blue-200">
                <CardHeader className="border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Basic Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <h3 className=" font-semibold text-lg">{patient.name}</h3>
                            <div className="flex gap-2 mt-2">
                                {patient.isPregnant && (
                                    <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                                        Pregnant
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 ">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Age:</span>
                                <span>{patient.age} years old</span>
                            </div>
                            <div className="flex items-center gap-2 ">
                                <User className="h-4 w-4" />
                                <span className="font-medium">ID:</span>
                                <span>{patient.idNumber}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 ">
                                <Phone className="h-4 w-4" />
                                <span className="font-medium">Phone:</span>
                                <span>{patient.phoneNumber}</span>
                            </div>
                            <div className="flex items-start gap-2 ">
                                <MapPin className="h-4 w-4 mt-0.5" />
                                <div>
                                    <span className="font-medium">Address:</span>
                                    <p className="text-gray-700 mt-1">{patient.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="mb-6 border-blue-200">
                <CardHeader className=" border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Medical Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h4 className=" font-semibold mb-2">Medical History</h4>
                        <div className="p-4 rounded-lg border border-blue-200">
                            <p className="text-gray-700 whitespace-pre-wrap">{patient.medicalHistory}</p>
                        </div>
                    </div>

                    <Separator className="bg-blue-200" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className=" font-semibold mb-2">Allergies</h4>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-gray-700 whitespace-pre-wrap">{patient.allergies}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className=" font-semibold mb-2">Toxic Habits</h4>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <p className="text-gray-700 whitespace-pre-wrap">{patient.toxicHabits}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vaccinations */}
            <Card className="mb-6 border-blue-200">
                <CardHeader className=" border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Vaccinations ({patient.vaccinations.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {patient.vaccinations.map((vaccination: { vaccineName: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, index: Key | null | undefined) => (
                            <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                                <Badge className="bg-green-100 text-green-800 border-green-300">
                                    {vaccination.vaccineName}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Examinations */}
            <Card className="mb-6 border-blue-200">
                <CardHeader className="border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Physical Examinations ({patient.examinations.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    {patient.examinations.map((examination: any, index: any) => (
                        <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className=" font-semibold">Examination #{index + 1}</h4>
                                <Badge className="bg-blue-100  border-blue-300">
                                    Technique: {examination.technique}
                                </Badge>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{examination.physicalExamination}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Laboratory Results */}
            <Card className="mb-6 border-blue-200">
                <CardHeader className=" border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <TestTube className="h-5 w-5" />
                        Laboratory Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{patient.laboratoryResults}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Image Results */}
            <Card className="mb-6 border-blue-200">
                <CardHeader className=" border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Image Results
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{patient.imageResults}</p>
                    </div>
                </CardContent>
            </Card>

            {/* AI Response */}
            {
             patient.aiResponse &&  
                 <Card className="mb-6 border-blue-200">
                <CardHeader className="border-b border-blue-200">
                    <CardTitle className=" flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Analysis & Response
                    </CardTitle>

                </CardHeader>
                <CardContent className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{patient.aiResponse}</p>
                    </div>
                </CardContent>
            </Card>  
            }
        
            <div className="space-x-2">
                <Button className="bg-blue-500 hover:bg-blue-600">Get Diagnosits</Button>
                <Button variant="outline" className="border-blue-500 text-blue-500 hover:text-blue-600">Save Diagnosis</Button>
            </div>
        </div>
    );
}

export default RecordDetails