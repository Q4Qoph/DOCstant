"use client"

import React, { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Filter,
    Loader2,
    Users,
    FileText,
    UserCheck,
    Pill,
    X,
    Check,
    User,
    Phone,
    MapPin,
    Weight,
    Ruler,
    Thermometer,
    Heart,
} from "lucide-react"
import api from "@/lib/axios"
import type { Patient, PrescriptionRecord } from "@/types"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { useNotifications } from "@/hooks/useNotifications"
import Link from "next/link"
import { formatDistanceToNow, isAfter, subHours } from "date-fns";

interface PrescribedPatient {
    id: number
    nurseId: string | null
    name: string
    diagnosisId: string
    medicationDescriptions: any[]
    createdTime: string
}

interface PrescribedPatientWithDetails extends PrescribedPatient {
    patientDetails?: Patient
}

interface PrescriptionWithPatientDetails extends PrescriptionRecord {
    patientDetails?: Patient
}

const fetchMedications = async (companyId: string) => {
    const response = await api.get("/api/inventory", { params: { companyId } })
    return response.data
}

export default function PrescriptionDashboard() {
    const { user } = useAuth()
    const { sendNotification } = useNotifications()
    const [filter, setFilter] = useState<string>("all")
    const [activeTab, setActiveTab] = useState<string>("prescriptions")

    const [patientFilter, setPatientFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Patient action states
    const [selectedPatient, setSelectedPatient] = useState<PrescribedPatientWithDetails | null>(null)
    const [showMedForm, setShowMedForm] = useState(false)
    const [selectedMed, setSelectedMed] = useState<string>("")
    const [medDescription, setMedDescription] = useState("")
    const [actionType, setActionType] = useState<"assign" | "administer" | null>(null)

    // Prescription action states
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionWithPatientDetails | null>(null)
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [comment, setComment] = useState("")
    const [prescriptionActionType, setPrescriptionActionType] = useState<"approve" | "reject" | null>(null)

    const router = useRouter()
    const queryClient = useQueryClient()

    const receptionistId = user?.id

    const getReceptionistId = () => {
        return localStorage.getItem("receptionistId") || "1"
    }

    // Fetch medications
    const medsQuery = useQuery({
        queryKey: ["medications"],
        queryFn: () => fetchMedications(user?.companyId!),
    })

    // Fetch prescriptions with patient details
    const {
        data: allPrescriptions = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["prescriptions", filter],
        queryFn: async () => {
            const response = await api.get(`/api/prescription`, { params: { companyId: user?.companyId } })
            const prescriptions = response.data as PrescriptionRecord[]

            // Fetch patient details for each prescription
            const prescriptionsWithDetails = await Promise.all(
                prescriptions.map(async (prescription) => {
                    try {
                        if (prescription.diagnosisId) {
                            const diagnosisResponse = await api.get(`/api/DiagnosisRecord/${prescription.diagnosisId}`)
                            return {
                                ...prescription,
                                patientDetails: diagnosisResponse.data as Patient,
                            }
                        }
                        return prescription
                    } catch (error) {
                        console.error(`Failed to fetch details for prescription ${prescription.id}:`, error)
                        return prescription
                    }
                }),
            )

            return prescriptionsWithDetails
        },
        enabled: activeTab === "prescriptions",
    })

    // Apply filters to prescriptions
    const prescriptions = React.useMemo(() => {
        if (!allPrescriptions) return []

        let filtered = [...allPrescriptions]

        // Filter by approval status
        if (filter !== "all") {
            switch (filter) {
                case "approved":
                    filtered = filtered.filter((prescription) => prescription.status == "Approved")
                    break
                case "unapproved":
                    filtered = filtered.filter((prescription) => prescription.status == "Rejected")
                case "pending":
                    filtered = filtered.filter((prescription) => prescription.status == "")
                    break
            }
        }

        return filtered
    }, [allPrescriptions, filter])

    // Prescription action mutation
    const prescriptionActionMutation = useMutation({
        mutationFn: async ({
            action,
            prescriptionId,
            comment,
        }: {
            action: "approve" | "reject"
            prescriptionId: number
            comment?: string
        }) => {
            if (!comment?.trim()) {
                throw new Error("Please input comment and try again.")
            }
            const receptionistId = getReceptionistId()
            let endpoint = ""
            const config: any = {}
            let response

            switch (action) {
                case "approve":
                case "reject":
                    endpoint = `/${action}/${prescriptionId}`
                    config.params = { comment }
                    response = (await api.put(endpoint, null, config)).data

                    sendNotification({
                        title: action === "approve" ? "Medication Approved" : "Medication Rejected",
                        message:
                            action === "approve"
                                ? `Prescription #${prescriptionId} has been approved.`
                                : `Prescription #${prescriptionId} was rejected. Reason: "${comment}"`,
                        fromUserId: user!.id,
                        fromDepartment: 3,
                        toDepartment: 2,
                        toUserIds: [receptionistId],
                    })
                    return response

                default:
                    throw new Error(`Unknown action: ${action}`)
            }
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] })
            const actionMessages = {
                approve: "Prescription approved successfully",
                reject: "Prescription rejected successfully",
            }
            toast.success(actionMessages[variables.action])

            // Reset states
            setSelectedPrescription(null)
            setShowCommentForm(false)
            setComment("")
            setPrescriptionActionType(null)
        },
        onError: (error: any) => {
            const message = error?.response?.data || error?.response?.data?.message
                || error?.message
                || "Failed to update prescription";
            toast.error(message);
        }
    })

    // Fetch all prescribed patients (for "all" filter)
    const {
        data: allPrescribedPatients = [],
        isLoading: isAllPatientsLoading,
        error: allPatientsError,
    } = useQuery({
        queryKey: ["all-prescribed-patients"],
        queryFn: async () => {
            const response = await api.get(`/api/Receptionist/newPatientMedicaton`, { params: { companyId: user?.companyId } })
            const patients = response.data as PrescribedPatient[]

            // Fetch patient details for each prescribed patient
            const patientsWithDetails = await Promise.all(
                patients.map(async (patient) => {
                    try {
                        const diagnosisResponse = await api.get(`/api/DiagnosisRecord/${patient.diagnosisId}`)
                        return {
                            ...patient,
                            patientDetails: diagnosisResponse.data as Patient,
                        }
                    } catch (error) {
                        console.error(`Failed to fetch details for patient ${patient.id}:`, error)
                        return patient
                    }
                }),
            )

            return patientsWithDetails
        },
        enabled: activeTab === "patients" && patientFilter !== "mine",
    })

    // Fetch my assigned patients (for "mine" filter)
    const {
        data: myAssignedPatients = [],
        isLoading: isMyPatientsLoading,
        error: myPatientsError,
    } = useQuery({
        queryKey: ["my-assigned-patients", receptionistId],
        queryFn: async () => {
            if (!receptionistId) return []

            const response = await api.get(`/api/Receptionist/assignedPatient/${receptionistId}`)
            const patients = response.data as PrescribedPatient[]

            // Fetch patient details for each assigned patient
            const patientsWithDetails = await Promise.all(
                patients.map(async (patient) => {
                    try {
                        const diagnosisResponse = await api.get(`/api/DiagnosisRecord/${patient.diagnosisId}`)
                        return {
                            ...patient,
                            patientDetails: diagnosisResponse.data as Patient,
                        }
                    } catch (error) {
                        console.error(`Failed to fetch details for patient ${patient.id}:`, error)
                        return patient
                    }
                }),
            )

            return patientsWithDetails
        },
        enabled: activeTab === "patients" && patientFilter === "mine" && !!receptionistId,
    })

    // Patient action mutation
    const patientActionMutation = useMutation({
        mutationFn: async ({
            action,
            patientId,
            nurseId,
            nurseName,
            medicationId,
            description,
        }: {
            action: "assign" | "administer"
            patientId: string | number
            nurseId?: string
            nurseName?: string
            medicationId?: number
            description?: string
        }) => {
            let endpoint = ""
            let data: any = null
            let response

            switch (action) {
                case "assign":
                    endpoint = `/api/receptionist/${patientId}/assignnurse`
                    data = { nurseId, name: nurseName }
                    response = (await api.put(endpoint, data)).data
                    return response

                case "administer":
                    endpoint = `/api/receptionist/administerMeds`
                    data = { description, administeredMedId: medicationId }
                    response = (await api.post(endpoint, data)).data
                    return response
                default:
                    throw new Error(`Unknown action: ${action}`)
            }
        },
        onSuccess: (data, variables) => {
            // Invalidate both queries to refresh data
            queryClient.invalidateQueries({ queryKey: ["all-prescribed-patients"] })
            queryClient.invalidateQueries({ queryKey: ["my-assigned-patients"] })

            const actionMessages = {
                assign: "Patient assigned to you successfully",
                administer: "Medicine administered successfully",
            }
            toast.success(actionMessages[variables.action])

            // Send notification
            if (variables.action === "assign") {
                sendNotification({
                    title: "Patient Assigned",
                    message: `Patient has been assigned to ${user?.name}`,
                    fromUserId: user!.id,
                    fromDepartment: 3,
                    toDepartment: 2,
                    toUserIds: [receptionistId!],
                })
            }

            // Reset states
            setSelectedPatient(null)
            setShowMedForm(false)
            setSelectedMed("")
            setMedDescription("")
            setActionType(null)
        },
        onError: () => {
            toast.error("Failed to perform action")
        },
    })

    // Get the appropriate data source and loading state
    const getPatientData = () => {
        if (patientFilter === "mine") {
            return {
                patients: myAssignedPatients,
                isLoading: isMyPatientsLoading,
                error: myPatientsError,
            }
        } else {
            return {
                patients: allPrescribedPatients,
                isLoading: isAllPatientsLoading,
                error: allPatientsError,
            }
        }
    }

    const { patients: basePatients, isLoading: isPatientsLoading, error: patientsError } = getPatientData()

    // Apply additional filters to the data
    const prescribedPatients = React.useMemo(() => {
        if (!basePatients) return []

        let filtered = [...basePatients]

        // Filter by date
        if (dateFilter !== "all") {
            const now = new Date()
            const filterDate = new Date()

            switch (dateFilter) {
                case "today":
                    filterDate.setHours(0, 0, 0, 0)
                    break
                case "week":
                    filterDate.setDate(now.getDate() - 7)
                    break
                case "month":
                    filterDate.setMonth(now.getMonth() - 1)
                    break
            }

            filtered = filtered.filter((patient) => new Date(patient.createdTime) >= filterDate)
        }

        // Filter by status
        if (statusFilter !== "all") {
            switch (statusFilter) {
                case "has-allergies":
                    filtered = filtered.filter((patient: any) => patient.patientDetails?.allergies)
                    break
                case "pregnant":
                    filtered = filtered.filter((patient: any) => patient.patientDetails?.isPregnant)
                    break
                case "has-medications":
                    filtered = filtered.filter((patient) => patient.medicationDescriptions?.length > 0)
                    break
                case "no-medications":
                    filtered = filtered.filter((patient) => !patient.medicationDescriptions?.length)
                    break
            }
        }

        return filtered
    }, [basePatients, dateFilter, statusFilter])

    const handlePrescriptionAction = (prescription: PrescriptionWithPatientDetails, action: "approve" | "reject") => {
        setSelectedPrescription(prescription)
        setPrescriptionActionType(action)
        setShowCommentForm(true)
    }

    const handlePrescriptionSubmit = () => {
        if (!selectedPrescription || !prescriptionActionType) return

        prescriptionActionMutation.mutate({
            action: prescriptionActionType,
            prescriptionId: selectedPrescription.id,
            comment: comment || "",
        })
    }

    const handlePatientAction = (patient: PrescribedPatientWithDetails, action: "assign" | "administer") => {
        setSelectedPatient(patient)
        setActionType(action)

        if (action === "assign") {
            patientActionMutation.mutate({
                action,
                patientId: patient.id,
                nurseId: user?.id,
                nurseName: user?.name,
            })
        } else if (action === "administer") {
            setShowMedForm(true)
        }
    }

    const handleAdministerSubmit = () => {
        if (!selectedPatient) return

        patientActionMutation.mutate({
            action: "administer",
            patientId: selectedPatient.id,
            medicationId: selectedPatient.id,
            description: medDescription,
        })
    }


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const isNewItem = (dateString: string) => {
        const itemDate = new Date(dateString)
        const twoHoursAgo = subHours(new Date(), 6)
        return isAfter(itemDate, twoHoursAgo)
    }

    const isLatestItem = (index: number) => {
        return index === 0
    }

    if (error || patientsError) {
        return (
            <div className="p-8">
                <Card className="border-red-200">
                    <CardContent className="pt-6">
                        <p className="text-red-600">Error loading data. Please try again.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col space-y-4">
                <div>
                    <h1 className="text-3xl font-bold">Prescription Management</h1>
                    <p className="">Review and manage prescription approvals and prescribed patients</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            All Prescriptions
                        </TabsTrigger>
                        <TabsTrigger value="patients" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Prescribed Patients
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="prescriptions" className="space-y-4">
                        <Card >
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Filters
                                </CardTitle>
                                <CardDescription>Filter prescriptions by approval status</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="flex gap-4">
                                    <Select value={filter} onValueChange={setFilter}>
                                        <SelectTrigger className="w-[200px] border-blue-200 focus:ring-blue-500">
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Prescriptions</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="unapproved">Rejected</SelectItem>
                                            <SelectItem value="pending">Pending Approval</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="shadow-none bg-transparent py-4">
                            <div>
                                <CardTitle>Prescriptions</CardTitle>
                                <CardDescription>
                                    {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} found
                                </CardDescription>
                            </div>
                            <div className="pt-6">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                        <span className="ml-2">Loading prescriptions...</span>
                                    </div>
                                ) : prescriptions.length === 0 ? (
                                    <div className="text-center py-8 text-blue-600">No prescriptions found for the selected filter.</div>
                                ) : (
                                    <div className="grid gap-6">
                                        {prescriptions.map((prescription: PrescriptionWithPatientDetails, index) => (
                                            <Card key={prescription.id}
                                                //  className="hover:shadow-md transition-shadow duration-200"
                                                className={`cursor-pointer hover:shadow-none ${isNewItem(prescription.createdAt) ? "border-green-500 border-2" : ""
                                                    }`}
                                            >
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                                <Pill className="h-6 w-6 text-purple-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex gap-2">
                                                                    <h3 className="text-lg font-semibold text-gray-900">{prescription.drugName}</h3>
                                                                    {isLatestItem(index) ? (
                                                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                                                            Latest
                                                                        </Badge>
                                                                    ) : isNewItem(prescription.createdAt) ? (
                                                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                                                            New
                                                                        </Badge>
                                                                    ) : null}

                                                                </div>

                                                                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                                    <span className="flex items-center">
                                                                        <span className="font-medium">Dosage:</span>
                                                                        <span className="ml-1">{prescription.medicineDosage}</span>
                                                                    </span>
                                                                    <span className="flex items-center">
                                                                        <span className="font-medium">Quantity:</span>
                                                                        <span className="ml-1">{prescription.quantity}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge
                                                                variant={
                                                                    prescription.status === "Pending"
                                                                        ? "secondary"
                                                                        : prescription.status === "Approved"
                                                                            ? "default"
                                                                            : prescription.status === "Rejected" ? "destructive" : "secondary"
                                                                }
                                                                className={
                                                                    prescription.status === "Pending"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : prescription.status === "Approved"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                }
                                                            >
                                                                {prescription.status}
                                                            </Badge>


                                                            <p className="text-xs text-gray-500 mt-2">
                                                                Created: {formatDate(prescription.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Patient Information */}
                                                    {prescription.patientDetails && (
                                                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
                                                                <User className="h-4 w-4" />
                                                                Patient Information
                                                            </h4>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-sm font-medium text-blue-700">Name:</span>
                                                                        <TooltipProvider>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Link
                                                                                        className="group flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                                                                                        href={`/dashboard/patients/${prescription.diagnosisId}`}
                                                                                    >
                                                                                        <span className="text-sm text-blue-600 group-hover:text-blue-700">
                                                                                            {prescription.patientDetails?.name}
                                                                                        </span>

                                                                                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                        </svg>
                                                                                    </Link>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    <p>View patient details</p>
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                        </TooltipProvider>
                                                                        {/* <span className="text-sm text-blue-600">{prescription.patientDetails.name}</span> */}
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-sm font-medium text-blue-700">Age & Gender:</span>
                                                                        <span className="text-sm text-blue-600">
                                                                            {prescription.patientDetails.age}y, {prescription.patientDetails.sex}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Phone className="h-3 w-3 text-blue-600" />
                                                                        <span className="text-sm text-blue-600">
                                                                            {prescription.patientDetails.phoneNumber || "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-start space-x-2">
                                                                        <span className="text-sm font-medium text-blue-700 mt-0.5">Chief Complaint:</span>
                                                                        <span className="text-sm text-blue-600">
                                                                            {prescription.patientDetails.chiefComplaint || "Not specified"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-start space-x-2">
                                                                        <MapPin className="h-3 w-3 text-blue-600 mt-0.5" />
                                                                        <span className="text-sm text-blue-600">
                                                                            {prescription.patientDetails.address || "Not provided"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Vital Signs */}
                                                            <div className="mt-3 pt-3 border-t border-blue-200">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                                                    {prescription.patientDetails.weight && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Weight className="h-3 w-3 text-blue-600" />
                                                                            <span className="text-blue-600">{prescription.patientDetails.weight}</span>
                                                                        </div>
                                                                    )}
                                                                    {prescription.patientDetails.height && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Ruler className="h-3 w-3 text-blue-600" />
                                                                            <span className="text-blue-600">{prescription.patientDetails.height}</span>
                                                                        </div>
                                                                    )}
                                                                    {prescription.patientDetails.temperature && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Thermometer className="h-3 w-3 text-blue-600" />
                                                                            <span className="text-blue-600">{prescription.patientDetails.temperature}</span>
                                                                        </div>
                                                                    )}
                                                                    {prescription.patientDetails.heartRate && (
                                                                        <div className="flex items-center gap-1">
                                                                            <Heart className="h-3 w-3 text-blue-600" />
                                                                            <span className="text-blue-600">{prescription.patientDetails.heartRate}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Allergies Warning */}
                                                    {prescription.patientDetails?.allergies && (
                                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm font-medium text-red-800">⚠️ Allergies:</span>
                                                                <span className="text-sm text-red-700">{prescription.patientDetails.allergies}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Comments */}
                                                    {prescription.comments && (
                                                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                                            <h4 className="text-sm font-medium text-gray-800 mb-1">Comments:</h4>
                                                            <p className="text-sm text-gray-700">{prescription.comments}</p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                        <div className="text-xs text-gray-500">Prescription ID: #{prescription.id}</div>
                                                        <div className="flex space-x-2">
                                                            {prescription.status == "Pending" && (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handlePrescriptionAction(prescription, "approve")}
                                                                        disabled={prescriptionActionMutation.isPending}
                                                                        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                                                    >
                                                                        {prescriptionActionMutation.isPending &&
                                                                            prescriptionActionType === "approve" &&
                                                                            selectedPrescription?.id === prescription.id ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <Check className="h-4 w-4" />
                                                                        )}
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={() => handlePrescriptionAction(prescription, "reject")}
                                                                        disabled={prescriptionActionMutation.isPending}
                                                                        className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                                                    >
                                                                        {prescriptionActionMutation.isPending &&
                                                                            prescriptionActionType === "reject" &&
                                                                            selectedPrescription?.id === prescription.id ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <X className="h-4 w-4" />
                                                                        )}
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {
                                                                prescription.status == "Approved" && (
                                                                    <>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => handlePrescriptionAction(prescription, "reject")}
                                                                            disabled={prescriptionActionMutation.isPending}
                                                                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                            Revoke Approval
                                                                        </Button>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="patients" className="space-y-6">
                        {/* Enhanced Filter Section */}
                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    Patient Filters
                                </CardTitle>
                                <CardDescription>Filter and organize your prescribed patients</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Patient Assignment Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Patient Assignment</label>
                                        <Select value={patientFilter} onValueChange={setPatientFilter}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Filter by assignment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Patients</SelectItem>
                                                <SelectItem value="mine">My Patients Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Date Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Time Period</label>
                                        <Select value={dateFilter} onValueChange={setDateFilter}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Filter by date" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Time</SelectItem>
                                                <SelectItem value="today">Today</SelectItem>
                                                <SelectItem value="week">This Week</SelectItem>
                                                <SelectItem value="month">This Month</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Status Filter */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Patient Status</label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Filter by status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Statuses</SelectItem>
                                                <SelectItem value="has-allergies">Has Allergies</SelectItem>
                                                <SelectItem value="pregnant">Pregnant Patients</SelectItem>
                                                <SelectItem value="has-medications">With Medications</SelectItem>
                                                <SelectItem value="no-medications">No Medications</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Active Filters Display */}
                                {(patientFilter !== "all" || dateFilter !== "all" || statusFilter !== "all") && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-medium text-gray-700">Active filters:</span>
                                            {patientFilter !== "all" && (
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    {patientFilter === "mine" ? "My Patients" : patientFilter}
                                                    <button
                                                        onClick={() => setPatientFilter("all")}
                                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            )}
                                            {dateFilter !== "all" && (
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    {dateFilter === "today" ? "Today" : dateFilter === "week" ? "This Week" : "This Month"}
                                                    <button
                                                        onClick={() => setDateFilter("all")}
                                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            )}
                                            {statusFilter !== "all" && (
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    {statusFilter === "has-allergies"
                                                        ? "Has Allergies"
                                                        : statusFilter === "pregnant"
                                                            ? "Pregnant"
                                                            : statusFilter === "has-medications"
                                                                ? "With Medications"
                                                                : "No Medications"}
                                                    <button
                                                        onClick={() => setStatusFilter("all")}
                                                        className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                                    >
                                                        ×
                                                    </button>
                                                </Badge>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setPatientFilter("all")
                                                    setDateFilter("all")
                                                    setStatusFilter("all")
                                                }}
                                                className="text-xs"
                                            >
                                                Clear All
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Results Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    {patientFilter === "mine" ? "My Assigned Patients" : "All Prescribed Patients"}
                                    {(patientFilter !== "all" || dateFilter !== "all" || statusFilter !== "all") && (
                                        <Badge variant="outline" className="ml-2">
                                            {prescribedPatients.length} filtered
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    Showing {prescribedPatients.length} patient{prescribedPatients.length !== 1 ? "s" : ""}
                                    {patientFilter === "mine" ? " assigned to you" : " with prescribed medications"}
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Patients Display */}
                        {isPatientsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                                    <p className="text-gray-600">Loading prescribed patients...</p>
                                </div>
                            </div>
                        ) : prescribedPatients.length === 0 ? (
                            <Card>
                                <CardContent className="py-12">
                                    <div className="text-center">
                                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {basePatients.length === 0
                                                ? patientFilter === "mine"
                                                    ? "No patients assigned to you"
                                                    : "No prescribed patients found"
                                                : "No patients match your filters"}
                                        </h3>
                                        <p className="text-gray-600">
                                            {basePatients.length === 0
                                                ? patientFilter === "mine"
                                                    ? "You don't have any patients assigned to you yet."
                                                    : "There are currently no patients with prescribed medications."
                                                : "Try adjusting your filters to see more results."}
                                        </p>
                                        {(patientFilter !== "all" || dateFilter !== "all" || statusFilter !== "all") && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setPatientFilter("all")
                                                    setDateFilter("all")
                                                    setStatusFilter("all")
                                                }}
                                                className="mt-4"
                                            >
                                                Clear All Filters
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6">
                                {prescribedPatients.map((patient: PrescribedPatientWithDetails) => (
                                    <Card key={patient.id} className="hover:shadow-md transition-shadow duration-200">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start space-x-4">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Link
                                                                        className="group flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                                                                        href={`/dashboard/patients/${patient.diagnosisId}`}
                                                                    >
                                                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                                                                            {patient.patientDetails?.name || patient.name || "Unknown Patient"}
                                                                        </h3>
                                                                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </Link>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>View patient details</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                            <span className="flex items-center">
                                                                <span className="font-medium">Age:</span>
                                                                <span className="ml-1">{patient.patientDetails?.age || "N/A"}y</span>
                                                            </span>
                                                            <span className="flex items-center">
                                                                <span className="font-medium">Gender:</span>
                                                                <span className="ml-1">{patient.patientDetails?.sex || "N/A"}</span>
                                                            </span>
                                                            <span className="flex items-center">
                                                                <span className="font-medium">ID:</span>
                                                                <span className="ml-1">{patient.patientDetails?.idNumber || "N/A"}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="mb-2">
                                                        {patient.medicationDescriptions?.length || 0} medication(s)
                                                    </Badge>
                                                    <p className="text-xs text-gray-500">Prescribed: {formatDate(patient.createdTime)}</p>
                                                    {patient.nurseId === receptionistId && (
                                                        <Badge variant="default" className="mt-1 bg-blue-100 text-blue-800">
                                                            Assigned to me
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-gray-700">Phone:</span>
                                                        <span className="text-sm text-gray-600">
                                                            {patient.patientDetails?.phoneNumber || "Not provided"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start space-x-2">
                                                        <span className="text-sm font-medium text-gray-700 mt-0.5">Address:</span>
                                                        <span className="text-sm text-gray-600">
                                                            {patient.patientDetails?.address || "Not provided"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-start space-x-2">
                                                        <span className="text-sm font-medium text-gray-700 mt-0.5">Chief Complaint:</span>
                                                        <span className="text-sm text-gray-600">
                                                            {patient.patientDetails?.chiefComplaint || "Not specified"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start space-x-2">
                                                        <span className="text-sm font-medium text-gray-700 mt-0.5">Symptoms:</span>
                                                        <span className="text-sm text-gray-600">
                                                            {patient.patientDetails?.symptoms || "Not specified"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {patient.patientDetails?.allergies && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-red-800">⚠️ Allergies:</span>
                                                        <span className="text-sm text-red-700">{patient.patientDetails.allergies}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {patient.medicationDescriptions && patient.medicationDescriptions.length > 0 && (
                                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                    <h4 className="text-sm font-medium text-green-800 mb-2">💊 Medications Administered:</h4>
                                                    <div className="space-y-1">
                                                        {patient.medicationDescriptions.map((med: any, index: number) => (
                                                            <div key={index} className="text-sm text-green-700">
                                                                • {med.description}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                    {patient.patientDetails?.weight && <span>Weight: {patient.patientDetails.weight}</span>}
                                                    {patient.patientDetails?.height && <span>Height: {patient.patientDetails.height}</span>}
                                                    {patient.patientDetails?.temperature && (
                                                        <span>Temp: {patient.patientDetails.temperature}</span>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2">
                                                    {/* Assign to Self Button - only show for unassigned patients when viewing "all" */}
                                                    {patientFilter === "all" && patient.nurseId !== receptionistId && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handlePatientAction(patient, "assign")}
                                                            disabled={patientActionMutation.isPending}
                                                            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                                                        >
                                                            {patientActionMutation.isPending &&
                                                                actionType === "assign" &&
                                                                selectedPatient?.id === patient.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <UserCheck className="h-4 w-4" />
                                                            )}
                                                            Assign to Me
                                                        </Button>
                                                    )}

                                                    {/* Administer Medicine Button - only show for assigned patients */}
                                                    {(patientFilter === "mine" || patient.nurseId === receptionistId) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handlePatientAction(patient, "administer")}
                                                            disabled={patientActionMutation.isPending}
                                                            className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                                                        >
                                                            <Pill className="h-4 w-4" />
                                                            Administer Medicine
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Prescription Comment Dialog */}
            <Dialog open={showCommentForm} onOpenChange={setShowCommentForm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {prescriptionActionType === "approve" ? "Approve Prescription" : "Reject Prescription"}
                        </DialogTitle>
                        <DialogDescription>
                            {prescriptionActionType === "approve"
                                ? "Add a comment for approval"
                                : "Add a reason for rejection"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Enter your comment..."
                                className="mt-3"
                                required
                                disabled={prescriptionActionMutation.isPending}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCommentForm(false)
                                    setSelectedPrescription(null)
                                    setComment("")
                                    setPrescriptionActionType(null)
                                }}
                                disabled={prescriptionActionMutation.isPending}
                                className="flex-1"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePrescriptionSubmit}
                                disabled={prescriptionActionMutation.isPending}
                                className={`flex-1 ${prescriptionActionType === "approve"
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-red-600 hover:bg-red-700"
                                    }`}
                            >
                                {prescriptionActionMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : prescriptionActionType === "approve" ? (
                                    <Check className="h-4 w-4 mr-2" />
                                ) : (
                                    <X className="h-4 w-4 mr-2" />
                                )}
                                {prescriptionActionType === "approve" ? "Approve" : "Reject"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Administer Medicine Dialog */}
            <Dialog open={showMedForm} onOpenChange={setShowMedForm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Administer Medicine</DialogTitle>
                        <DialogDescription>
                            Please record the medicine you are giving to{" "}
                            {selectedPatient?.patientDetails?.name || "the patient"}, and include a brief description.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={medDescription}
                                onChange={(e) => setMedDescription(e.target.value)}
                                placeholder="Enter a brief description..."
                                className="mt-3"
                                required
                                disabled={patientActionMutation.isPending}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowMedForm(false)
                                    setSelectedPatient(null)
                                    setSelectedMed("")
                                    setMedDescription("")
                                    setActionType(null)
                                }}
                                disabled={patientActionMutation.isPending}
                                className="flex-1"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAdministerSubmit}
                                disabled={!medDescription.trim() || patientActionMutation.isPending}
                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                                {patientActionMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Pill className="h-4 w-4 mr-2" />
                                )}
                                Administer
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
