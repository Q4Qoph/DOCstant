"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    };
}

export default function LabTestForm({ open, onOpenChange, diagnosisId, labTest }: LabTestFormProps) {
    const isEditing = !!labTest;
    const { data: specialists } = useDepartmentUsers(2);
    const { sendNotification } = useNotifications();
    const { user } = useAuth();
 
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        testName: "",
        cost: 0,
        testDate: new Date().toISOString().slice(0, 16),
        diagnosisId: diagnosisId || ""
    });

    const queryClient = useQueryClient()

    useEffect(() => {
        if (labTest) {
            setFormData({
                testName: labTest.testName,
                cost: labTest.cost,
                testDate: labTest.testDate.slice(0, 16),
                diagnosisId: labTest.diagnosisId
            });
        } else {
            setFormData({
                testName: "",
                cost: 0,
                testDate: new Date().toISOString().slice(0, 16),
                diagnosisId: diagnosisId || ""
            });
        }
    }, [labTest, diagnosisId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                testDate: new Date(formData.testDate).toISOString(),
                cost: Number(formData.cost)
            };

            const response = isEditing
                ? await api.put(`/api/LabTest/${labTest!.id}`, payload)
                : await api.post("/api/LabTest", payload);

            if (response.status === 200) {
                toast.success(`Lab test ${isEditing ? "updated" : "scheduled"} successfully`);
                queryClient.invalidateQueries({queryKey: ["labtests", diagnosisId]})
                
                if (!isEditing) {
                    if (specialists && specialists.length > 0) {
                        sendNotification({
                            title: "Tests submitted",
                            message: `Laboratory tests have been completed. Please <a href="/dashboard/patients/${diagnosisId}" class="text-blue-600 underline">review the results</a> and proceed with the clinical evaluation.`,
                            fromUserId: user!.id,
                            fromDepartment: 3,
                            toDepartment: 2,
                            toUserIds: specialists.map((u: any) => u.id),
                        });
                    } else {
                        toast.warning("No specialists available to notify. Please follow up with the clinical team.");
                    }
                }

                onOpenChange(false);
            }
        } catch (error: any) {
            toast.error(error.message || `Failed to ${isEditing ? "update" : "create"} lab test`);
            const fieldErrors: Record<string, string> = {};
            error.errors?.forEach((err: any) => {
                const path = err.path.join(".");
                fieldErrors[path] = err.message;
            });
            setErrors(fieldErrors);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
                <SheetHeader className="p-0">
                    <SheetTitle>{isEditing ? "Update Lab Test" : "Record Lab Test"}</SheetTitle>
                    <SheetDescription>
                        {isEditing
                            ? "Modify the details of an existing laboratory test."
                            : "Log a laboratory test performed or prescribed for the patient."}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="testName">Test Name</Label>
                        <Input
                            id="testName"
                            value={formData.testName}
                            onChange={(e) => setFormData(prev => ({ ...prev, testName: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.testName ? 'border-red-500' : ''}`}
                            placeholder="Enter test name (e.g., Blood Test, X-Ray)"
                            required
                        />
                        {errors.testName && <p className="text-red-500 text-sm mt-1">{errors.testName}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cost">Cost</Label>
                        <Input
                            id="cost"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.cost}
                            onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.cost ? 'border-red-500' : ''}`}
                            placeholder="0.00"
                            required
                        />
                        {errors.cost && <p className="text-red-500 text-sm mt-1">{errors.cost}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="testDate">Test Date & Time</Label>
                        <Input
                            id="testDate"
                            type="datetime-local"
                            value={formData.testDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, testDate: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.testDate ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.testDate && <p className="text-red-500 text-sm mt-1">{errors.testDate}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <SheetClose asChild>
                            <Button variant="outline" disabled={isLoading}>Cancel</Button>
                        </SheetClose>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#0c9aff] hover:bg-blue-500 text-white"
                        >
                            {isLoading
                                ? isEditing ? "Saving..." : "Recording..."
                                : isEditing ? "Update Test" : "Record Test"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
