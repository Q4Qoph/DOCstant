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
const getExpenses = (diagnosisId: string) => api.get(`/api/Expense/${diagnosisId}`);
const createTreatment = (data: { diagnosisId: string; description: string }) =>
    api.post('/api/Treatment', data);
const createExpense = (data: { expenseName: string; amount: number; diagnosisId: string }) =>
    api.post('/api/Expense', data);
const getReevaluations = (diagnosisId: string) => api.get(`/api/Reevaluation/${diagnosisId}`);
const createReevaluation = (data: any) => api.post('/api/Reevaluation', data);
const createPayment = (diagnosisId: string): Promise<{ data: any }> =>
    api.post(`/api/Payment/${diagnosisId}`, {
        "approvedURL": "http://localhost:3000/dashboard/payment/success",
        "cancelURL": "http://localhost:3000/dashboard/payment/cancelled"
    });

    const RecordDetails = () => {
        const [prescOpen, setPrescOpen] = useState(false);
        const [labTestOpen, setLabTestOpen] = useState(false);
        const [admitOpen, setAdmitOpen] = useState(false);
        const [treatmentOpen, setTreatmentOpen] = useState(false);
        const [expenseOpen, setExpenseOpen] = useState(false);
        const [reevaluationOpen, setReevaluationOpen] = useState(false);
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
    
        const {
            data: expenses,
            isLoading: expensesLoading,
        } = useQuery({
            queryKey: ["expenses", id],
            queryFn: () => getExpenses(id as string).then((res) => res.data),
            enabled: !!id,
        });
        const {
            data: reevaluations,
            isLoading: reevaluationsLoading,
        } = useQuery({
            queryKey: ["reevaluations", id],
            queryFn: () => getReevaluations(id as string).then((res) => res.data),
            enabled: !!id,
        });
    
        //Add create reevaluation function
        const createReevaluationMutation = useMutation({
            mutationFn: createReevaluation,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["reevaluations", id] });
                setReevaluationOpen(false);
            },
        });
    
        const createTreatmentMutation = useMutation({
            mutationFn: createTreatment,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["treatments", id] });
                setTreatmentOpen(false);
            },
        });
    
        const createExpenseMutation = useMutation({
            mutationFn: createExpense,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["expenses", id] });
                setExpenseOpen(false);
            },
        });
    
        const createPaymentMutation = useMutation({
            mutationFn: () => createPayment(id as string),
            onSuccess: (response) => {
                window.location.href = response.data.url;
            },
            onError: (error) => {
                console.error('Payment error:', error);
                toast.error('Failed to initiate payment. Please try again.');
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
    
        const handlePayment = () => {
            if (!expenses || expenses.length === 0) {
                toast.error('No expenses to pay for this patient.');
                return;
            }
            createPaymentMutation.mutate();
        };
    
        const totalAmount = expenses?.reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0;
    
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
                            <Button
                                onClick={onBack}
                                variant="outline"
                                className="border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to List
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">
                                    {patient?.name || 'Patient Details'}
                                </h1>
                                <p className="text-slate-600 mt-1">
                                    ID: {patient?.idNumber} • {patient?.age} years old
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
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
                    </div>
                </div>

                {/* Main Content with Tabs */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="border-b border-slate-200 px-6 pt-6">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 h-auto p-1 bg-slate-100 rounded-lg">
                                <TabsTrigger 
                                    value="basic-info" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Basic Info</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="medical-history" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">Medical</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="vaccinations" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <Activity className="h-4 w-4" />
                                    <span className="hidden sm:inline">Vaccines</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="examinations" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <Stethoscope className="h-4 w-4" />
                                    <span className="hidden sm:inline">Exams</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="treatments" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <Target className="h-4 w-4" />
                                    <span className="hidden sm:inline">Treatment</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                value="expenses" 
                                className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                 >
                                <Target className="h-4 w-4" />
                                <span className="hidden sm:inline">Expenses</span>
                              </TabsTrigger>

                                <TabsTrigger 
                                    value="laboratory" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <TestTube className="h-4 w-4" />
                                    <span className="hidden sm:inline">Lab</span>
                                </TabsTrigger>

                                <TabsTrigger 
                                    value="ai-analysis" 
                                    className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                                >
                                    <Bot className="h-4 w-4" />
                                    <span className="hidden sm:inline">AI</span>
                                </TabsTrigger>

                                <TabsTrigger 
                                value="reevaluations" 
                                className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                            >
                                <Clock className="h-4 w-4" />
                                <span className="hidden sm:inline">Re-evaluate</span>
                            </TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* Basic Information Tab */}
                            <TabsContent value="basic-info" className="mt-0">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Patient Info Card */}
                                        <Card className="border-slate-200 shadow-sm">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                    Patient Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-2xl font-bold text-slate-900">{patient.name}</h3>
                                                    <div className="flex gap-2">
                                                        {patient.isPregnant && (
                                                            <Badge className="bg-pink-100 text-pink-800 border-pink-300">
                                                                Pregnant
                                                            </Badge>
                                                        )}
                                                        <Badge variant="outline" className="text-slate-600">
                                                            {patient.sex}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-4 w-4 text-slate-500" />
                                                        <div>
                                                            <p className="text-sm text-slate-600">Age</p>
                                                            <p className="font-medium">{patient.age} years</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <User className="h-4 w-4 text-slate-500" />
                                                        <div>
                                                            <p className="text-sm text-slate-600">ID Number</p>
                                                            <p className="font-medium">{patient.idNumber}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Contact Info Card */}
                                        <Card className="border-slate-200 shadow-sm">
                                            <CardHeader className="pb-3">
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
                                    </div>

                                    {/* Vital Signs Card */}
                                    <Card className="border-slate-200 shadow-sm">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="flex items-center gap-2 text-lg">
                                                <Heart className="h-5 w-5 text-red-600" />
                                                Vital Signs & Chief Complaint
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
                            </TabsContent>

                            {/* Medical History Tab */}
                            <TabsContent value="medical-history" className="mt-0">
                                <div className="space-y-6">
                                    <Card className="border-slate-200 shadow-sm">
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
                                        <Card className="border-red-200 shadow-sm">
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

                                        <Card className="border-orange-200 shadow-sm">
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
                                <Card className="border-slate-200 shadow-sm">
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
                            <TabsContent value="expenses">
                                    <Card className="border-blue-200">
                                        <CardHeader className="flex justify-between border-b border-blue-200">
                                            <CardTitle className="flex items-center gap-2">
                                                <DollarSign className="h-5 w-5" />
                                                Expenses ({expenses?.length || 0})
                                                {expenses && expenses.length > 0 && (
                                                    <Badge className="bg-blue-100 text-blue-800 border-blue-300 ml-2">
                                                        Total: ${totalAmount.toFixed(2)}
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => setExpenseOpen(true)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Expense
                                                </Button>
                                                
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6">
                                            {expensesLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                </div>
                                            ) : expenses && expenses.length > 0 ? (
                                                <div className="space-y-4">
                                                    {expenses.map((expense: any, index: number) => (
                                                        <div key={expense.id} className="p-4 rounded-lg border">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-semibold text-lg">{expense.expenseName}</h4>
                                                                <Badge className="bg-green-100 text-green-800 border-green-300 text-lg font-semibold">
                                                                    ${expense.amount.toFixed(2)}
                                                                </Badge>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Expense #{index + 1} • ID: {expense.id}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="mt-6 p-4 rounded-lg border bg-gray-50">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-lg font-semibold">Total Amount:</span>
                                                            <span className="text-2xl font-bold">
                                                                ${totalAmount.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex justify-end">
                                                            <Button
                                                                onClick={handlePayment}
                                                                disabled={createPaymentMutation.isPending}
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                            >
                                                                {createPaymentMutation.isPending ? (
                                                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                                                ) : (
                                                                    <CreditCard className="h-4 w-4 mr-2" />
                                                                )}
                                                                {createPaymentMutation.isPending ? 'Processing Payment...' : 'Pay with Stripe'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                                    <p>No expenses recorded yet</p>
                                                    <Button
                                                        onClick={() => setExpenseOpen(true)}
                                                        variant="outline"
                                                        className="mt-3"
                                                    >
                                                        Add First Expense
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>


                            {/* Laboratory Results Tab */}
                            <TabsContent value="laboratory" className="mt-0">
                                <Card className="border-slate-200 shadow-sm">
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
                                    <Card className="border-slate-200 shadow-sm">
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
                                    <Card className="border-slate-200 shadow-sm">
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
                            <TabsContent value="reevaluations" className="mt-0">
                                <Card className="border-slate-200 shadow-sm">
                                    <CardHeader className="flex justify-between border-b border-slate-200">
                                        <CardTitle className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            Patient Reevaluations
                                        </CardTitle>
                                        <Button onClick={() => setReevaluationOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Schedule Reevaluation
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {reevaluationsLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            </div>
                                        ) : reevaluations && reevaluations.length > 0 ? (
                                            <div className="space-y-6">
                                                {reevaluations.map((reevaluation: any, index: number) => (
                                                    <div key={reevaluation.id} className="bg-gradient-to-r from-blue-50 to-blue-50 p-6 rounded-lg border border-purple-200 shadow-sm">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="font-bold text-lg text-purple-800">
                                                                    Reevaluation #{index + 1}
                                                                </h4>
                                                                <p className="text-sm text-purple-600">
                                                                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                                </p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Badge className="bg-purple-100 text-purple-800 border-purple-300">Follow-up</Badge>
                                                                {reevaluation.isPregnant && (
                                                                    <Badge className="bg-pink-100 text-pink-800 border-pink-300">Pregnant</Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                                            <div className="bg-white p-3 rounded-lg border border-purple-100">
                                                                <h5 className="font-semibold text-purple-700 mb-2">Chief Complaint</h5>
                                                                <p className="text-sm text-gray-700">{reevaluation.chiefComplaint}</p>
                                                            </div>
                                                            <div className="bg-white p-3 rounded-lg border border-purple-100">
                                                                <h5 className="font-semibold text-purple-700 mb-2">Current Symptoms</h5>
                                                                <p className="text-sm text-gray-700">{reevaluation.symptoms}</p>
                                                            </div>
                                                            <div className="bg-white p-3 rounded-lg border border-purple-100">
                                                                <h5 className="font-semibold text-purple-700 mb-2">Vital Signs</h5>
                                                                <div className="text-sm text-gray-700 space-y-1">
                                                                    <div>BP: {reevaluation.bloodPresure}</div>
                                                                    <div>Temp: {reevaluation.temperature}</div>
                                                                    <div>HR: {reevaluation.heartRate}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {reevaluation.laboratoryResults && (
                                                            <div className="bg-white p-3 rounded-lg border border-purple-100 mb-4">
                                                                <h5 className="font-semibold text-purple-700 mb-2">Latest Lab Results</h5>
                                                                <p className="text-sm text-gray-700">{reevaluation.laboratoryResults}</p>
                                                            </div>
                                                        )}
                                                        {reevaluation.aiResponse && (
                                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                                                                <h5 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                                                    <Bot className="h-4 w-4" />
                                                                    AI Assessment
                                                                </h5>
                                                                <p className="text-sm text-gray-700">{reevaluation.aiResponse}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                                    <Activity className="h-12 w-12 text-purple-500" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reevaluations Yet</h3>
                                                <p className="text-gray-500 mb-4">Track patient progress with follow-up evaluations</p>
                                                <Button onClick={() => setReevaluationOpen(true)} className="bg-purple-500 hover:bg-purple-600">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Schedule First Reevaluation
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div> {/* End of Tab Content */}
                    </Tabs>
                </div> {/* End of Main Content with Tabs */}

                {/* Action Buttons */}
                <div className="space-x-2 mt-8">
                    <Button variant="outline" onClick={() => setPrescOpen(true)} className="border-blue-500 text-blue-500 hover:text-blue-600">
                        <Pill className="h-4 w-4 mr-2" />
                        Prescribe Medication
                    </Button>
                    <Button onClick={() => setAdmitOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Admit Patient
                    </Button>
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
              <ExpenseForm
                open={expenseOpen}
                onOpenChange={setExpenseOpen}
                diagnosisId={id as string}
                onSubmit={(data) => createExpenseMutation.mutate(data)}
                isLoading={createExpenseMutation.isPending}
               />
              <ReevaluationForm
                open={reevaluationOpen}
                onOpenChange={setReevaluationOpen}
                diagnosisId={id as string}
                patientData={patient}
                onSubmit={(data) => createReevaluationMutation.mutate(data)}
                isLoading={createReevaluationMutation.isPending}
              />
            </div> {/* End of max-w-7xl mx-auto */}
        </div>
    );
}

export default RecordDetails;