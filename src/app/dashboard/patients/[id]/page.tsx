"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft, Edit, Trash2, Phone, MapPin, User, Calendar, FileText,
    Activity, TestTube, Camera, Bot, Stethoscope, Save, Pill, Sparkles,
    Plus, Clock, DollarSign, CreditCard, Heart, Thermometer, Weight,
    Ruler, Target, AlertCircle
} from "lucide-react";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import EditPatientForm from "../(components)/EditPatientForm";
import PatientDetailsSkeleton from "./loading";
import PrescriptionSheet from "../../prescriptions/(components)/PrescriptionSheet";
import LabTestForm from "../(components)/LabTestForm";
import AdmitPatientForm from "../(components)/AdmitPatientForm";
import TreatmentForm from "../(components)/TreatmentForm";
import ReevaluationForm from "../(components)/ReevaluationForm";
import ExpenseForm from "../(components)/ExpenseForm";
import { toast } from "sonner";
import PatientTabs from "./(components)/PatientTabs";
import BasicInfo from "./(components)/BasicInfo";
import Reevaluate from "./(components)/Reevaluate";
import Expenses from "./(components)/Expenses";

// Types
interface Treatment {
    id: number;
    diagnosisRecord: {
        id: string;
        name: string;
        age: number;
        sex: string;
        phoneNumber: string;
        chiefComplaint: string;
        weight: string;
        height: string;
        temperature: string;
        bloodPresure: string;
        respiratoryRate: string;
        heartRate: string;
        symptoms: string;
        address: string;
        idNumber: string;
        medicalHistory: string;
        allergies: string;
        toxicHabits: string;
        vaccinations: any[];
        treatments: string[];
        inpatient: any[];
        expenses: any[];
        payments: any[];
        isPregnant: boolean;
        prescriptions: any[];
        examinations: any[];
        labtests: any[];
        reevaluation: any[];
        laboratoryResults: string;
        department: number;
        imageResults: string;
        aiResponse: string;
        comments: string;
    };
    diagnosisId: string;
    description: string;
}

const getPatientById = (id: ParamValue) => api.get(`/api/diagnosisrecord/${id}`);
const getTreatments = (diagnosisId: string) => api.get(`/api/Treatment/${diagnosisId}`);
const createTreatment = (data: { diagnosisId: string; description: string }) =>
    api.post('/api/Treatment', data);


const RecordDetails = () => {
    const [prescOpen, setPrescOpen] = useState(false);
    const [labTestOpen, setLabTestOpen] = useState(false);
    const [admitOpen, setAdmitOpen] = useState(false);
    const [treatmentOpen, setTreatmentOpen] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("basic-info");

    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        data: patient,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["patient", id],
        queryFn: () => getPatientById(id).then((res) => res.data),
        enabled: !!id,
    });

    const {
        data: treatments,
        isLoading: treatmentsLoading,
    } = useQuery({
        queryKey: ["treatments", id],
        queryFn: () => getTreatments(id as string).then((res) => res.data),
        enabled: !!id,
    });




    const createTreatmentMutation = useMutation({
        mutationFn: createTreatment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["treatments", id] });
            setTreatmentOpen(false);
        },
    });



    const onBack = () => {
        router.back();
    };

    const onEdit = () => {
        setIsSheetOpen(true);
    };

    const onDelete = () => {
        // Implement delete logic
    };


    if (isLoading) {
        return <PatientDetailsSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            {/* <Button
                                onClick={onBack}
                                variant="outline"
                                className="border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to List
                            </Button> */}
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    {patient?.name || 'Patient Details'}
                                </h1>
                                <p className="text-slate-600 mt-1">
                                    ID: {patient?.idNumber} • {patient?.age} years old
                                </p>
                            </div>
                        </div>
                        <div className="space-x-2">
                            <Button variant="outline" onClick={() => setPrescOpen(true)} className="border-blue-500 text-blue-500 hover:text-blue-600">
                                <Pill className="h-4 w-4 mr-2" />
                                Prescribe Medication
                            </Button>
                            <Button onClick={() => setAdmitOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                                <Stethoscope className="h-4 w-4 mr-2" />
                                Admit Patient
                            </Button>
                        </div>

                    </div>
                </div>

                {/* Main Content with Tabs */}
                <div className="bg-white rounded-2xl border border-slate-200">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <PatientTabs />

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* Basic Information Tab */}
                            <BasicInfo
                                patient={patient}
                            />

                            {/* Medical History Tab */}
                            <TabsContent value="medical-history" className="mt-0">
                                <div className="space-y-6">
                                    <Card className="border-slate-200 shadow-none">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                                Medical History
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                    {patient.medicalHistory}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Card className="border-red-200 shadow-none">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-red-700">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Allergies
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                        {patient.allergies}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-orange-200 shadow-none">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-orange-700">
                                                    <AlertCircle className="h-5 w-5" />
                                                    Toxic Habits
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                        {patient.toxicHabits}
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Vaccinations Tab */}
                            <TabsContent value="vaccinations" className="mt-0">
                                <Card className="border-slate-200 shadow-none">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5 text-green-600" />
                                            Vaccinations ({patient.vaccinations.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {patient.vaccinations.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {patient.vaccinations.map((vaccination: any, index: Key) => (
                                                    <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                                            {vaccination.vaccineName}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Activity className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                                <p className="text-slate-500 text-lg">No vaccinations recorded</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Examinations Tab */}
                            <TabsContent value="examinations" className="mt-0">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Stethoscope className="h-5 w-5 text-blue-600" />
                                            Physical Examinations ({patient.examinations.length})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {patient.examinations.length > 0 ? (
                                            <div className="space-y-4">
                                                {patient.examinations.map((examination: any, index: any) => (
                                                    <div key={index} className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <h4 className="font-semibold text-lg">Examination #{index + 1}</h4>
                                                            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                                                {examination.technique}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                            {examination.physicalExamination}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <Stethoscope className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                                <p className="text-slate-500 text-lg">No examinations recorded</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Treatments Tab */}
                            <TabsContent value="treatments" className="mt-0">
                                {/* Treatments Tab Content */}
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex justify-between border-b border-slate-200">
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="h-5 w-5 text-blue-600" />
                                            Treatments ({treatments?.length || 0})
                                        </CardTitle>
                                        <Button onClick={() => setTreatmentOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Treatment
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {treatmentsLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : treatments && treatments.length > 0 ? (
                                            <div className="space-y-4">
                                                {treatments.map((treatment: Treatment, index: number) => (
                                                    <div key={treatment.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h4 className="font-semibold">Treatment #{index + 1}</h4>
                                                            <Badge className="bg-green-100 text-green-800 border-green-300">
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                Active
                                                            </Badge>
                                                        </div>
                                                        <p className="text-gray-700 whitespace-pre-wrap">{treatment.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                <p>No treatments recorded yet</p>
                                                <Button onClick={() => setTreatmentOpen(true)} variant="outline" className="mt-3">
                                                    Add First Treatment
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Expenses Tab */}
                            <Expenses id={id} />

                            {/* Laboratory Results Tab */}
                            <TabsContent value="laboratory" className="mt-0">
                                <Card className="border-slate-200 shadow-none">
                                    <CardHeader className="flex justify-between border-b border-slate-200">
                                        <CardTitle className="flex items-center gap-2">
                                            <TestTube className="h-5 w-5 text-blue-600" />
                                            Laboratory Results
                                        </CardTitle>
                                        <Button onClick={() => setLabTestOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                            Add Test
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                            <p className="text-gray-700 whitespace-pre-wrap">{patient.laboratoryResults}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* AI Analysis Tab */}
                            <TabsContent value="ai-analysis" className="mt-0">
                                {patient.aiResponse ? (
                                    <Card className="shadow-none">
                                        <CardHeader className="flex justify-between border-b border-slate-200">
                                            <CardTitle className="flex items-center gap-2">
                                                <Bot className="h-5 w-5 text-blue-600" />
                                                AI Analysis & Response
                                            </CardTitle>
                                            <Button className="bg-blue-500 hover:bg-blue-600">
                                                <Sparkles className="h-4 w-4 mr-2" />
                                                Get Diagnosis
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <p className="text-gray-700 whitespace-pre-wrap">{patient.aiResponse}</p>
                                            </div>
                                            <Button variant="outline" className="border-blue-500 text-blue-500 hover:text-blue-600 mt-4">
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Diagnosis
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card className="shadow-none">
                                        <CardContent className="p-6">
                                            <div className="text-center py-8 text-gray-500">
                                                <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                <p>No AI analysis available</p>
                                                <Button className="bg-blue-500 hover:bg-blue-600 mt-3">
                                                    <Sparkles className="h-4 w-4 mr-2" />
                                                    Generate AI Analysis
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Reevaluations Tab */}
                            <Reevaluate id={id} patient={patient} />
                        </div> {/* End of Tab Content */}
                    </Tabs>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-8">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                onClick={onEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Update
                            </Button>
                        </SheetTrigger>
                        <EditPatientForm
                            initialData={patient}
                            onCancel={() => setIsSheetOpen(false)}
                        />
                    </Sheet>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Patient Record</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete this patient record? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => onDelete()}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Modals and Sheets */}
                <PrescriptionSheet
                    diagnosisId={patient.id}
                    open={prescOpen}
                    onOpenChange={setPrescOpen}
                />
                <LabTestForm
                    open={labTestOpen}
                    onOpenChange={setLabTestOpen}
                    diagnosisId={id}
                />
                <AdmitPatientForm
                    open={admitOpen}
                    onOpenChange={setAdmitOpen}
                    diagnosisId={id}
                />
                <TreatmentForm
                    open={treatmentOpen}
                    onOpenChange={setTreatmentOpen}
                    diagnosisId={id as string}
                    onSubmit={(data) => createTreatmentMutation.mutate(data)}
                    isLoading={createTreatmentMutation.isPending}
                />

            </div>
        </div>
    );
}

export default RecordDetails;