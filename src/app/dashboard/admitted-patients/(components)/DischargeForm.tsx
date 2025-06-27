"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface DischargeFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient: string
}

export default function DischargeForm({
    open,
    onOpenChange,
    patient
}: DischargeFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        finalDiagnosis: "",
        currentLabResult: "",
        hometreatment: "",
        dischargeDate: new Date().toISOString(),
        comments: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const response = await api.put(`/api/inpatient/${patient}`, formData);
            if (response.status === 200) {
                toast.success("Discharge summary submitted successfully");
                setFormData({
                    finalDiagnosis: "",
                    currentLabResult: "",
                    hometreatment: "",
                    dischargeDate: new Date().toISOString(),
                    comments: "",
                });
                onOpenChange(false);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to submit discharge");
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
            <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto px-8 py-4">
                <SheetHeader className="p-0">
                    <SheetTitle>Update Record</SheetTitle>
                    <SheetDescription>
                        Fill out and submit the summary
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    {[
                        { id: "finalDiagnosis", label: "Final Diagnosis" },
                        { id: "currentLabResult", label: "Current Lab Result" },
                        { id: "hometreatment", label: "Home Treatment" },
                        { id: "comments", label: "Comments" },
                    ].map(({ id, label }) => (
                        <div key={id} className="space-y-2">
                            <Label htmlFor={id}>{label}</Label>
                            <Textarea
                                id={id}
                                value={(formData as any)[id]}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, [id]: e.target.value }))
                                }
                                className={`border-blue-200 focus:border-blue-500 ${errors[id] ? "border-red-500" : ""
                                    }`}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                required
                            />
                            {errors[id] && (
                                <p className="text-red-500 text-sm mt-1">{errors[id]}</p>
                            )}
                        </div>
                    ))}

                    <div className="space-y-2">
                        <Label htmlFor="dischargeDate">Discharge Date</Label>
                        <Input
                            id="dischargeDate"
                            type="datetime-local"
                            value={formData.dischargeDate.slice(0, 16)}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    dischargeDate: new Date(e.target.value).toISOString(),
                                }))
                            }
                            required
                        />
                        {errors.dischargeDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.dischargeDate}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <SheetClose asChild>
                            <Button variant="outline" disabled={isLoading}>
                                Cancel
                            </Button>
                        </SheetClose>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? "Submitting..." : "Update Record"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
