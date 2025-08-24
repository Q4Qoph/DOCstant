"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Sheet, SheetClose, SheetContent,
    SheetDescription, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ParamValue } from "next/dist/server/request/params";
import { useDepartmentUsers } from "@/hooks/useDepartmentUsers";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { Loader, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface LabTestFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diagnosisId?: ParamValue;
    labTest?: {
        id: number;
        testName: string;
        cost: number;
        testDate: string;
        diagnosisId: string;
        labTestResult?: string;
        name: string;
        age: string
    };
}

export default function ResultsForm({ open, onOpenChange, diagnosisId, labTest }: LabTestFormProps) {
    const { data: specialists } = useDepartmentUsers(2);
    const { sendNotification } = useNotifications();
    const { user } = useAuth();

    const queryClient = useQueryClient()

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        labResult: ""
    });

    console.log(labTest)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const response = await api.put(`/api/LabTest/${labTest?.id}`, formData.labResult, {
                headers: {
                    'Accept': 'text/plain',
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success("Results updated successfully");
                queryClient.invalidateQueries({ queryKey: ["labtests", labTest?.diagnosisId] })

                // Notify specialists about the updated results
                if (specialists && specialists.length > 0) {
                    sendNotification({
                        title: "Lab Results Updloaded",
                        message: `Laboratory test results for ${labTest?.testName} have been updated. Please <a href="/dashboard/patients/${labTest?.diagnosisId}" class="text-blue-600 underline">review the results</a> and proceed with clinical evaluation.`,
                        fromUserId: user!.id,
                        fromDepartment: 3,
                        toDepartment: 2,
                        toUserIds: specialists.map((u: any) => u.id),
                    });
                } else {
                    toast.warning("No specialists available to notify. Please follow up with the clinical team manually.");
                }

                onOpenChange(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed insert results");
            const fieldErrors: Record<string, string> = {};
            if (error.errors) {
                error.errors.forEach((err: any) => {
                    const path = err.path.join(".");
                    fieldErrors[path] = err.message;
                });
            }
            setErrors(fieldErrors);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
                <SheetHeader className="p-0">
                    <SheetTitle>Add Test Results</SheetTitle>
                    <SheetDescription>
                        Add laboratory test result for this patient.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {/* Display test information (read-only) */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        <h3 className="font-medium text-gray-900">Test Information</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-600">Patient Name:</p>
                                <p className="text-gray-900">{labTest?.name || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">Patient Age:</p>
                                <p className="text-gray-900">{labTest?.age || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">Test Name:</p>
                                <p className="text-gray-900">{labTest?.testName}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">Test Date:</p>
                                <p className="text-gray-900">
                                    {labTest ? new Date(labTest.testDate).toLocaleDateString() : ''}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">Cost:</p>
                                <p className="text-gray-900">$ {labTest?.cost}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-600">Current Status:</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs ${labTest?.labTestResult && labTest.labTestResult.trim()
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {labTest?.labTestResult && labTest.labTestResult.trim() ? 'Completed' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lab Result Input */}
                    <div className="space-y-2">
                        <Label htmlFor="labResult">Lab Test Result *</Label>
                        <textarea
                            id="labResult"
                            value={formData.labResult}
                            onChange={(e) => setFormData(prev => ({ ...prev, labResult: e.target.value }))}
                            className={`w-full min-h-[200px] px-3 py-2 border rounded-md border-blue-200 focus:border-[#0c9aff] focus:outline-none focus:ring-1 focus:ring-[#0c9aff] resize-vertical ${errors.labResult ? 'border-red-500' : ''}`}
                            placeholder="Enter the detailed laboratory test results here..."
                            required
                        />
                        {errors.labResult && <p className="text-red-500 text-sm mt-1">{errors.labResult}</p>}
                        <p className="text-sm text-gray-500">
                            Please provide detailed and accurate test results. This information will be shared with the clinical team.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <SheetClose asChild>
                            <Button variant="outline" disabled={isLoading}>Cancel</Button>
                        </SheetClose>

                        <Button
                            type="submit"
                            disabled={isLoading || !formData.labResult.trim()}
                            className="bg-[#0c9aff] hover:bg-blue-600 text-white"
                        >
                            {isLoading && <Loader className="h-5 w-5 animate-spin" />}
                            {isLoading ? "Adding Test Result" : "Add Test Results"}
                         </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}