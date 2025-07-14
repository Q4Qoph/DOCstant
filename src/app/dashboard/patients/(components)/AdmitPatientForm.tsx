"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { ParamValue } from "next/dist/server/request/params";

interface AdmitPatientFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    diagnosisId?: ParamValue;
}

export default function AdmitPatientForm({ open, onOpenChange, diagnosisId }: AdmitPatientFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        diagnosisId: diagnosisId || "",
        ward: "",
        room: "",
        bed: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const response = await api.post("/api/inpatient", formData);

            if (response.status === 200) {
                toast.success("Patient admitted successfully");
                setFormData({
                    diagnosisId: diagnosisId || "",
                    ward: "",
                    room: "",
                    bed: ""
                });
                onOpenChange(false)
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to admit patient");
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
                    <SheetTitle>Admit Patient</SheetTitle>
                    <SheetDescription>
                        Admit patient to hospital ward
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="ward">Ward</Label>
                        <Input
                            id="ward"
                            value={formData.ward}
                            onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.ward ? 'border-red-500' : ''}`}
                            placeholder="Enter ward name (e.g., General Ward, ICU)"
                            required
                        />
                        {errors.ward && <p className="text-red-500 text-sm mt-1">{errors.ward}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="room">Room</Label>
                            <Input
                                id="room"
                                value={formData.room}
                                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                                className={`border-blue-200 focus:border-blue-500 ${errors.room ? 'border-red-500' : ''}`}
                                placeholder="Room number"
                                required
                            />
                            {errors.room && <p className="text-red-500 text-sm mt-1">{errors.room}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bed">Bed</Label>
                            <Input
                                id="bed"
                                value={formData.bed}
                                onChange={(e) => setFormData(prev => ({ ...prev, bed: e.target.value }))}
                                className={`border-blue-200 focus:border-blue-500 ${errors.bed ? 'border-red-500' : ''}`}
                                placeholder="Bed number"
                                required
                            />
                            {errors.bed && <p className="text-red-500 text-sm mt-1">{errors.bed}</p>}
                        </div>
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
                            {isLoading ? "Admitting..." : "Admit Patient"}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}