"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Check, X, Filter, Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { PrescriptionRecord } from "@/types"
import ActionModal from "./(components)/ActionModal"

export default function PrescriptionDashboard() {
    const [filter, setFilter] = useState<string>("all")
    const [actionModal, setActionModal] = useState<{
        isOpen: boolean
        prescription: PrescriptionRecord | null
        action: "approve" | "reject"
    }>({
        isOpen: false,
        prescription: null,
        action: "approve",
    })

    const queryClient = useQueryClient()

    // Fetch prescriptions with React Query
    const {
        data: prescriptions = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["prescriptions", filter],
        queryFn: async () => {
            const response = await api.get(`/api/prescription`)
            return response.data
        },
    })

    // Mutation for updating prescription status
    const updatePrescriptionMutation = useMutation({
        mutationFn: async ({ id, approve, comment }: { id: number; approve: boolean; comment: string }) => {
            const response = await fetch(`/api/prescriptions/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ approve, comment }),
            })
            if (!response.ok) {
                throw new Error("Failed to update prescription")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prescriptions"] })
            //   toast({
            //     title: "Success",
            //     description: "Prescription updated successfully",
            //   })
            setActionModal({ isOpen: false, prescription: null, action: "approve" })
        },
        onError: () => {
            //   toast({
            //     title: "Error",
            //     description: "Failed to update prescription",
            //     variant: "destructive",
            //   })
        },
    })

    const handleAction = (prescription: PrescriptionRecord, action: "approve" | "reject") => {
        setActionModal({
            isOpen: true,
            prescription,
            action,
        })
    }

    const handleActionSubmit = (comment: string) => {
        if (actionModal.prescription) {
            updatePrescriptionMutation.mutate({
                id: actionModal.prescription.id,
                approve: actionModal.action === "approve",
                comment,
            })
        }
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

    if (error) {
        return (
            <div className=" p-8">
                <Card className="border-red-200">
                    <CardContent className="pt-6">
                        <p className="text-red-600">Error loading prescriptions. Please try again.</p>
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
                    <p className="">Review and manage prescription approvals</p>
                </div>

                <Card >
                    <CardHeader className="">
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
                                    <SelectItem value="unapproved">Unapproved</SelectItem>
                                    <SelectItem value="pending">Pending Review</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card >
                    <CardHeader >
                        <CardTitle className="">Prescriptions</CardTitle>
                        <CardDescription>
                            {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} found
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin " />
                                <span className="ml-2">Loading prescriptions...</span>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="">Patient</TableHead>
                                            <TableHead className="">Drug</TableHead>
                                            <TableHead className="">Dosage</TableHead>
                                            <TableHead className="">Quantity</TableHead>
                                            <TableHead className="">Status</TableHead>
                                            <TableHead className="">Date</TableHead>
                                            <TableHead className="">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {prescriptions.map((prescription: PrescriptionRecord) => (
                                            <TableRow key={prescription.id} className="hover:bg-blue-50/50">
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{prescription.record?.name}</div>
                                                        <div className="text-sm">
                                                            {prescription.record?.age}y, {prescription.record?.sex}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{prescription.drugName}</TableCell>
                                                <TableCell>{prescription.medicineDosage}</TableCell>
                                                <TableCell>{prescription.quantity}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={prescription.approve ? "default" : "secondary"}
                                                        className={
                                                            prescription.approve ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                                        }
                                                    >
                                                        {prescription.approve ? "Approved" : "Pending"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-blue-600">{formatDate(prescription.createdAt)}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {!prescription.approve && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleAction(prescription, "approve")}
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    disabled={updatePrescriptionMutation.isPending}
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="destructive"
                                                                    onClick={() => handleAction(prescription, "reject")}
                                                                    disabled={updatePrescriptionMutation.isPending}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {prescription.approve && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleAction(prescription, "reject")}
                                                                disabled={updatePrescriptionMutation.isPending}
                                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {prescriptions.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-blue-600">
                                                    No prescriptions found for the selected filter.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ActionModal
                isOpen={actionModal.isOpen}
                onClose={() => setActionModal({ isOpen: false, prescription: null, action: "approve" })}
                prescription={actionModal.prescription}
                action={actionModal.action}
                onSubmit={handleActionSubmit}
                isLoading={updatePrescriptionMutation.isPending}
            />
        </div>
    )
}
