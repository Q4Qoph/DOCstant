"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    ArrowLeft,
    Check,
    X,
    User,
    Calendar,
    Phone,
    MapPin,
    Heart,
    Activity,
    Thermometer,
    Weight,
    Ruler,
    UserCheck,
    Loader2,
} from "lucide-react"
import api from "@/lib/axios"
import { toast } from "sonner"

const PrescriptionDetails = () => {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const prescriptionId = params.id as string

    const [comment, setComment] = useState("")
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [actionType, setActionType] = useState<"approve" | "reject" | "assign" | null>(null)

    const getReceptionistId = () => {
        return localStorage.getItem("receptionistId") || "1"
    }

    const {
        data: prescription,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["prescription", prescriptionId],
        queryFn: async () => {
            // const response = await api.get(`/api/prescription/${prescriptionId}`)
            // return response.data
            return {
                "id": 4,
                "record": null,
                "diagnosisId": "df706e57-7bc4-4a32-3417-08ddaffb5030",
                "drugName": "Brofen",
                "quantity": 1,
                "medicineDosage": "1 X 3",
                "comments": "Test",
                "approve": true,
                "createdAt": "2025-06-20T16:14:50.8540575",
                "updatedAt": "0001-01-01T00:00:00"
            }
        },
    })

    // Mutation for updating prescription status
    const updatePrescriptionMutation = useMutation({
        mutationFn: async ({ action, comment }: { action: "approve" | "reject" | "assign"; comment: string }) => {
            const receptionistId = getReceptionistId()

            let endpoint = ""
            const params: any = { comment, receptionistId }

            switch (action) {
                case "approve":
                    endpoint = `/approve/${prescriptionId}`
                    break
                case "reject":
                    endpoint = `/reject/${prescriptionId}`
                    break
                case "assign":
                    endpoint = `/api/receptionist/${prescriptionId}/assignnurse`
                    break
            }

            const response = await api.put(endpoint, null, { params })
            return response.data
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["prescription", prescriptionId] })
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] })

            const actionMessages = {
                approve: "Prescription approved successfully",
                reject: "Prescription rejected successfully",
                assign: "Prescription assigned to you successfully",
            }

            toast.success(actionMessages[variables.action])
            setShowCommentForm(false)
            setComment("")
            setActionType(null)
        },
        onError: () => {
            toast.error("Failed to update prescription")
        },
    })

    const handleAction = (action: "approve" | "reject" | "assign") => {
        setActionType(action)
        if (action == "approve" || "reject") {
            setShowCommentForm(true)
        } else {

        }
    }

    const handleSubmit = () => {
        if (actionType) {
            updatePrescriptionMutation.mutate({
                action: actionType,
                comment: comment || "",
            })
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading prescription details...</span>
            </div>
        )
    }

    if (error || !prescription) {
        return (
            <div className="p-8">
                <Card className="border-red-200">
                    <CardContent className="pt-6">
                        <p className="text-red-600">Error loading prescription details. Please try again.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            <div className="space-y-5">
                <div>
                    <h1 className="text-3xl font-bold">Prescription Details</h1>
                    <p className="text-muted-foreground">Review prescription information and take action</p>
                </div>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prescription Information */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Prescription Information
                                <Badge
                                    variant={prescription.approve ? "default" : "secondary"}
                                    className={prescription.approve ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                                >
                                    {prescription.approve ? "Approved" : "Pending"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Drug Name</Label>
                                    <p className="font-semibold">{prescription.drugName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Quantity</Label>
                                    <p className="font-semibold">{prescription.quantity}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Dosage</Label>
                                    <p className="font-semibold">{prescription.medicineDosage}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                                    <p className="font-semibold">{formatDate(prescription.createdAt)}</p>
                                </div>
                            </div>
                            {prescription.comments && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Comments</Label>
                                    <p className="mt-1">{prescription.comments}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Patient Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Patient Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                            <p className="font-semibold">{prescription.record?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Age & Sex</Label>
                                            <p className="font-semibold">
                                                {prescription.record?.age}y, {prescription.record?.sex}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                            <p className="font-semibold">{prescription.record?.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                                            <p className="font-semibold">{prescription.record?.address}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">ID Number</Label>
                                        <p className="font-semibold">{prescription.record?.idNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vital Signs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Vital Signs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Weight className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                                        <p className="font-semibold">{prescription.record?.weight}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Ruler className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Height</Label>
                                        <p className="font-semibold">{prescription.record?.height}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Temperature</Label>
                                        <p className="font-semibold">{prescription.record?.temperature}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">Heart Rate</Label>
                                        <p className="font-semibold">{prescription.record?.heartRate}</p>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Blood Pressure</Label>
                                    <p className="font-semibold">{prescription.record?.bloodPresure}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Respiratory Rate</Label>
                                    <p className="font-semibold">{prescription.record?.respiratoryRate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medical Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Medical Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Chief Complaint</Label>
                                <p className="mt-1">{prescription.record?.chiefComplaint}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Symptoms</Label>
                                <p className="mt-1">{prescription.record?.symptoms}</p>
                            </div>
                            {prescription.record?.medicalHistory && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Medical History</Label>
                                    <p className="mt-1">{prescription.record.medicalHistory}</p>
                                </div>
                            )}
                            {prescription.record?.allergies && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Allergies</Label>
                                    <p className="mt-1">{prescription.record.allergies}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                            <CardDescription>Take action on this prescription</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!prescription.approve && (
                                <>
                                    <Button
                                        className="w-full bg-green-50 hover:bg-green-100 text-green-500"
                                        onClick={() => handleAction("approve")}
                                        disabled={updatePrescriptionMutation.isPending}
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve Prescription
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="w-full bg-red-50 hover:bg-red-100 text-red-500"
                                        onClick={() => handleAction("reject")}
                                        disabled={updatePrescriptionMutation.isPending}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Prescription
                                    </Button>
                                </>
                            )}

                            {prescription.approve && (
                                <>
                                    <Button
                                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-500"
                                        onClick={() => handleAction("assign")}
                                        disabled={updatePrescriptionMutation.isPending}
                                    >
                                        <UserCheck className="h-4 w-4 mr-2" />
                                        Assign to Self
                                    </Button>
                                    {/* <Button
                                        variant="outline"
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={() => handleAction("reject")}
                                        disabled={updatePrescriptionMutation.isPending}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Revoke Approval
                                    </Button> */}
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {showCommentForm && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Comment</CardTitle>
                                <CardDescription>
                                    {actionType === "approve" && "Add a comment for approval"}
                                    {actionType === "reject" && "Add a reason for rejection"}
                                    {actionType === "assign" && "Add a note for assignment"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="comment">Comment</Label>
                                    <Textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Enter your comment..."
                                        className="mt-1"
                                    />
                                </div>
                                <div className="flex gap-2">

                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowCommentForm(false)
                                            setComment("")
                                            setActionType(null)
                                        }}
                                        disabled={updatePrescriptionMutation.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="bg-blue-500 hover:bg-blue-600 flex-1" onClick={handleSubmit} disabled={updatePrescriptionMutation.isPending}>
                                        {updatePrescriptionMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                        Submit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PrescriptionDetails