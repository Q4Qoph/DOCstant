"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Examination {
    physicalExamination: string;
    technique: number;
}

interface AddExaminationFormProps {
    patientId: string;
    patientData: any; // The existing patient data
    onCancel: () => void;
}

export default function AddExaminationForm({ patientId, patientData, onCancel }: AddExaminationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [examinations, setExaminations] = useState<Examination[]>([
        { physicalExamination: "", technique: 0 }
    ]);
    
    const queryClient = useQueryClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        // Validate examinations
        const validationErrors: Record<string, string> = {};
        examinations.forEach((exam, index) => {
            if (!exam.physicalExamination.trim()) {
                validationErrors[`examinations.${index}.physicalExamination`] = "Physical examination is required";
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Combine existing patient data with new examinations
            const updatedPatientData = {
                ...patientData,
                examinations: [...(patientData.examinations || []), ...examinations]
            };

            const response = await api.put(`/api/DiagnosisRecord/${patientId}`, updatedPatientData);
            
            if (response.status === 200) {
                toast.success("Examinations added successfully!");
                queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
                onCancel();
            }
        } catch (error: any) {
            console.error("Error adding examinations:", error);
            toast.error("Failed to add examinations. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const addExamination = () => {
        setExaminations(prev => [...prev, { physicalExamination: "", technique: 0 }]);
    };

    const removeExamination = (index: number) => {
        setExaminations(prev => prev.filter((_, i) => i !== index));
    };

    const updateExamination = (index: number, field: keyof Examination, value: string | number) => {
        setExaminations(prev =>
            prev.map((exam, i) =>
                i === index ? { ...exam, [field]: value } : exam
            )
        );
    };

    return (
        <SheetContent className="sm:max-w-[700px] w-full overflow-y-auto px-8 py-4">
            <SheetHeader className="p-0">
                <SheetTitle>Add Examination</SheetTitle>
                <SheetDescription>
                    Add new physical examinations for {patientData?.name || "this patient"}
                </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* New Examinations */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <Label className="text-lg font-semibold">New Examinations</Label>
                        <Button
                            type="button"
                            onClick={addExamination}
                            variant="outline"
                            size="sm"
                            className="border-blue-300 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Examination
                        </Button>
                    </div>
                    
                    {examinations.map((examination, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border border-blue-200 rounded-lg">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Physical Examination *</Label>
                                <Textarea
                                    value={examination.physicalExamination}
                                    onChange={(e) => updateExamination(index, 'physicalExamination', e.target.value)}
                                    placeholder="Describe the physical examination findings..."
                                    className={`border-blue-200 focus:border-blue-500 min-h-[100px] ${
                                        errors[`examinations.${index}.physicalExamination`] ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors[`examinations.${index}.physicalExamination`] && (
                                    <p className="text-red-500 text-sm">{errors[`examinations.${index}.physicalExamination`]}</p>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Technique *</Label>
                                <Select
                                    value={String(examination.technique)}
                                    onValueChange={(value) => updateExamination(index, "technique", parseInt(value))}
                                >
                                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                                        <SelectValue placeholder="Select examination technique" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Inspection</SelectItem>
                                        <SelectItem value="1">Palpation</SelectItem>
                                        <SelectItem value="2">Percussion</SelectItem>
                                        <SelectItem value="3">Auscultation</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                {examinations.length > 1 && (
                                    <Button
                                        type="button"
                                        onClick={() => removeExamination(index)}
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-red-300 text-red-700 hover:bg-red-50 mt-2"
                                    >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Remove Examination
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {errors.examinations && (
                        <p className="text-red-500 text-sm mt-1">{errors.examinations}</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        className="border-blue-300 hover:bg-blue-50"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? "Saving..." : "Save Examination(s)"}
                    </Button>
                </div>
            </form>
        </SheetContent>
    );
}