"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { diagnosisSchema, type Patient } from "@/lib/schemas";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


export default function EditPatientForm({ initialData, onCancel }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState<Patient>(
        initialData || {
            name: "",
            age: 0,
            sex: "",
            phoneNumber: "",
            chiefComplaint: "",
            weight: "",
            height: "",
            temperature: "",
            bloodPresure: "",
            respiratoryRate: "",
            heartRate: "",
            symptoms: "",
            address: "",
            idNumber: "",
            medicalHistory: "",
            allergies: "",
            toxicHabits: "",
            vaccinations: [{ vaccineName: "" }],
            isPregnant: false,
            examinations: [{ physicalExamination: "", technique: 0 }],
            laboratoryResults: "",
            imageResults: "",
        }
    );
    const isEditing = !!initialData;
    const queryClient = useQueryClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            const validatedData = diagnosisSchema.parse(formData);
            const response = await api.put(`/api/DiagnosisRecord/${initialData.id}`, validatedData)
            if (response.status == 200) {
                toast.success("Patient diagnosis record updated successfully!")
                queryClient.invalidateQueries({ queryKey: ["patient", initialData.id] })
                onCancel()
            }

        } catch (error: any) {
            const fieldErrors: Record<string, string> = {};
            error.errors?.forEach((err: any) => {
                const path = err.path.join(".");
                fieldErrors[path] = err.message;
            });
            setErrors(fieldErrors);
        }
    };

    const addVaccination = () => {
        setFormData(prev => ({
            ...prev,
            vaccinations: [...prev.vaccinations, { vaccineName: "" }]
        }));
    };

    const removeVaccination = (index: number) => {
        setFormData(prev => ({
            ...prev,
            vaccinations: prev.vaccinations.filter((_, i) => i !== index)
        }));
    };

    const updateVaccination = (index: number, vaccineName: string) => {
        setFormData(prev => ({
            ...prev,
            vaccinations: prev.vaccinations.map((vac, i) =>
                i === index ? { vaccineName } : vac
            )
        }));
    };


    return (
        <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
            <SheetHeader className="p-0">
                <SheetTitle>{isEditing ? 'Update diagnosis record' : 'Create new diagnosis record'}</SheetTitle>
                <SheetDescription>
                    {isEditing ? 'Update diagnosis information' : 'Create a new diagnosis record'}
                </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name" className="">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="age" className="">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.age ? 'border-red-500' : ''}`}
                        />
                        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sex">Sex</Label>
                        <Input
                            id="sex"
                            value={formData.sex}
                            onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.sex ? 'border-red-500' : ''}`}
                        />
                        {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber" className="">Phone Number</Label>
                        <Input
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="idNumber" className="">ID Number</Label>
                        <Input
                            id="idNumber"
                            value={formData.idNumber}
                            onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.idNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address" className="">Address</Label>
                    <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                    <Textarea
                        id="chiefComplaint"
                        value={formData.chiefComplaint}
                        onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.chiefComplaint ? 'border-red-500' : ''}`}
                    />
                    {errors.chiefComplaint && <p className="text-red-500 text-sm mt-1">{errors.chiefComplaint}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea
                        id="symptoms"
                        value={formData.symptoms}
                        onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.symptoms ? 'border-red-500' : ''}`}
                    />
                    {errors.symptoms && <p className="text-red-500 text-sm mt-1">{errors.symptoms}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.weight ? 'border-red-500' : ''}`}
                    />
                    {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.height ? 'border-red-500' : ''}`}
                    />
                    {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                        id="temperature"
                        value={formData.temperature}
                        onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.temperature ? 'border-red-500' : ''}`}
                    />
                    {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bloodPresure">Blood Pressure</Label>
                    <Input
                        id="bloodPresure"
                        value={formData.bloodPresure}
                        onChange={(e) => setFormData(prev => ({ ...prev, bloodPresure: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.bloodPresure ? 'border-red-500' : ''}`}
                    />
                    {errors.bloodPresure && <p className="text-red-500 text-sm mt-1">{errors.bloodPresure}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                    <Input
                        id="respiratoryRate"
                        value={formData.respiratoryRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.respiratoryRate ? 'border-red-500' : ''}`}
                    />
                    {errors.respiratoryRate && <p className="text-red-500 text-sm mt-1">{errors.respiratoryRate}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate</Label>
                    <Input
                        id="heartRate"
                        value={formData.heartRate}
                        onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                        className={`border-blue-200 focus:border-blue-500 ${errors.heartRate ? 'border-red-500' : ''}`}
                    />
                    {errors.heartRate && <p className="text-red-500 text-sm mt-1">{errors.heartRate}</p>}
                </div>
                {/* Medical Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="medicalHistory" className="">Medical History</Label>
                        <Textarea
                            id="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.medicalHistory ? 'border-red-500' : ''}`}
                        />
                        {errors.medicalHistory && <p className="text-red-500 text-sm mt-1">{errors.medicalHistory}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allergies" className="">Allergies</Label>
                        <Textarea
                            id="allergies"
                            value={formData.allergies}
                            onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.allergies ? 'border-red-500' : ''}`}
                        />
                        {errors.allergies && <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="toxicHabits" className="">Toxic Habits</Label>
                        <Textarea
                            id="toxicHabits"
                            value={formData.toxicHabits}
                            onChange={(e) => setFormData(prev => ({ ...prev, toxicHabits: e.target.value }))}
                            className={`border-blue-200 focus:border-blue-500 ${errors.toxicHabits ? 'border-red-500' : ''}`}
                        />
                        {errors.toxicHabits && <p className="text-red-500 text-sm mt-1">{errors.toxicHabits}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPregnant"
                            checked={formData.isPregnant}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnant: !!checked }))}
                            className="border-blue-300"
                        />
                        <Label htmlFor="isPregnant" className="">Is Pregnant</Label>
                    </div>
                </div>

                {/* Vaccinations */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <Label className=" text-lg font-semibold">Vaccinations</Label>
                        <Button
                            type="button"
                            onClick={addVaccination}
                            variant="outline"
                            size="sm"
                            className="border-blue-300  hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Vaccination
                        </Button>
                    </div>
                    {formData.vaccinations.map((vaccination, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <Input
                                value={vaccination.vaccineName}
                                onChange={(e) => updateVaccination(index, e.target.value)}
                                placeholder="Vaccine name"
                                className="border-blue-200 focus:border-blue-500"
                            />
                            {formData.vaccinations.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeVaccination(index)}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    {errors.vaccinations && <p className="text-red-500 text-sm mt-1">{errors.vaccinations}</p>}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        className="border-blue-300  hover:bg-blue-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {isLoading ? "Saving..." : initialData ? "Update Record" : "Get Diagnosis"}
                    </Button>
                </div>
            </form>
        </SheetContent>
    );
}