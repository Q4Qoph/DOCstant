"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ParamValue } from "next/dist/server/request/params";
import { useDepartmentUsers } from "@/hooks/useDepartmentUsers";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/contexts/AuthContext";

interface LabTestFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    diagnosisId?: ParamValue;
}

export default function LabTestForm({ open, onOpenChange, diagnosisId }: LabTestFormProps) {
    const { data: specialists } = useDepartmentUsers(2);
    const { sendNotification } = useNotifications()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        testName: "",
        cost: 0,
        testDate: new Date().toISOString().slice(0, 16), // Format for datetime-local input
        diagnosisId: diagnosisId || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const submitData = {
                ...formData,
                testDate: new Date(formData.testDate).toISOString(),
                cost: Number(formData.cost)
            };

            const response = await api.post("/api/LabTest", submitData);

            if (response.status === 200) {
                toast.success("Lab test scheduled successfully");
                setFormData({
                    testName: "",
                    cost: 0,
                    testDate: new Date().toISOString().slice(0, 16),
                    diagnosisId: diagnosisId || ""
                });
                if (specialists && specialists.length > 0) {
                    sendNotification({
                        title: "Test Results Ready",
                        message: `Laboratory tests have been completed. Please <a href="/dashboard/patients/${diagnosisId}" class="text-blue-600 underline">review the results</a> and proceed with the clinical evaluation.`,
                        fromUserId: user!.id,
                        fromDepartment: 3,
                        toDepartment: 2,
                        toUserIds: specialists.map((u: any) => u.id),
                    });
                } else {
                    toast.warning("No specialists available to notify. Please follow up with the clinical team manually.");
                }

                onOpenChange(false)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to schedule lab test");
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
            <SheetContent className="sm:max-w-[900px] w-full  overflow-y-auto px-8 py-4">
                <SheetHeader className="p-0">
                    <SheetTitle>Record Lab Test</SheetTitle>
                    <SheetDescription>
                        Log a laboratory test performed or prescribed for the patient.
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

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <SheetClose asChild>
                            <Button variant="outline" disabled={isLoading}>Cancel</Button>
                        </SheetClose>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? "Saving..." : "Record Test"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}