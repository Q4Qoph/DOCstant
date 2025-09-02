"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { patientSchema } from "@/lib/schemas";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useNotifications } from "@/hooks/useNotifications";
import { useDepartmentUsers } from "@/hooks/useDepartmentUsers";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function PatientForm({ setIsSheetOpen, onCancel }: any) {
    const { data: specialists } = useDepartmentUsers(2);
    const { sendNotification } = useNotifications()
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [searchIdNumber, setSearchIdNumber] = useState("")
    const [existingPatient, setExistingPatient] = useState<any>(null)
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: "",
        age: 0,
        sex: "",
        phoneNumber: "",
        weight: "",
        height: "",
        temperature: "",
        bloodPresure: "",
        respiratoryRate: "",
        heartRate: "",
        chiefComplaint: "",
        symptoms: "",
        address: "",
        idNumber: "",
        medicalHistory: "",
        allergies: "",
        toxicHabits: "",
        isPregnant: false
    });

    const queryClient = useQueryClient()

    // Search for existing patient
    const handleSearchPatient = async () => {
        if (!searchIdNumber.trim()) {
            toast.error("Please enter an ID number to search");
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get(`/api/DiagnosisRecord/patient/${searchIdNumber}`);

            if (response.data) {
                const patientData = response.data;
                setExistingPatient(patientData);

                // Prepopulate form with existing patient data
                setFormData({
                    name: patientData.name || "",
                    age: patientData.age || 0,
                    sex: patientData.sex || "",
                    phoneNumber: patientData.phoneNumber || "",
                    weight: patientData.weight || "",
                    height: patientData.height || "",
                    temperature: patientData.temperature || "",
                    bloodPresure: patientData.bloodPresure || "",
                    respiratoryRate: patientData.respiratoryRate || "",
                    heartRate: patientData.heartRate || "",
                    chiefComplaint: patientData.chiefComplaint || "",
                    symptoms: patientData.symptoms || "",
                    address: patientData.address || "",
                    idNumber: patientData.idNumber || searchIdNumber,
                    medicalHistory: patientData.medicalHistory || "",
                    allergies: patientData.allergies || "",
                    toxicHabits: patientData.toxicHabits || "",
                    isPregnant: patientData.isPregnant || false
                });

                toast.success("Patient found! Data has been loaded.");
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                toast.info("Patient not found. You can create a new record.");
                setFormData(prev => ({ ...prev, idNumber: searchIdNumber }));
                setExistingPatient(null);
            } else {
                toast.error("Error searching for patient");
            }
        } finally {
            setIsSearching(false);
        }
    };

    // Clear search and form
    const handleClearForm = () => {
        setSearchIdNumber("");
        setExistingPatient(null);
        setFormData({
            name: "",
            age: 0,
            sex: "",
            phoneNumber: "",
            weight: "",
            height: "",
            temperature: "",
            bloodPresure: "",
            respiratoryRate: "",
            heartRate: "",
            chiefComplaint: "",
            symptoms: "",
            address: "",
            idNumber: "",
            medicalHistory: "",
            allergies: "",
            toxicHabits: "",
            isPregnant: false
        });
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const validatedData = patientSchema.parse(formData);
            const response = await api.post("/api/DiagnosisRecord", {
                ...validatedData,
                companyId: Number(user?.companyId),
                isUpdate: !!existingPatient // Flag to indicate if this is updating an existing patient
            });

            if (response.status == 200) {
                toast.success(existingPatient ? "Patient updated successfully" : "Patient recorded successfully");
                queryClient.invalidateQueries({ queryKey: ["patients"] });

                if (specialists && specialists.length > 0) {
                    sendNotification({
                        title: existingPatient ? "Patient Update Alert" : "Patient Registration Alert",
                        message: existingPatient
                            ? "Quick Action Required: An existing patient's profile has been updated. Please review their profile immediately to see the next required steps."
                            : "Quick Action Required: A new patient has been registered. Please open their profile and complete the necessary initial actions.",

                        fromUserId: user!.id,
                        fromDepartment: 0,
                        toDepartment: 2,
                        toUserIds: specialists.map((u: any) => u.id),
                    });
                } else {
                    toast.warning("No specialists are currently available to receive notifications. Please alert the responsible department manually (e.g., via chat or phone).");
                }
                setIsSheetOpen(false);

                handleClearForm();
            }
        } catch (error: any) {
            toast.error(error.message);
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
        <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
            <SheetHeader className="p-0">
                <SheetTitle>Patient Registration</SheetTitle>
                <SheetDescription>
                    Search for existing patient or create a new patient record
                </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
                {/* Search Section */}
                <Card className="shadow-none">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Find Existing Patient
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <Input
                                    placeholder="Enter patient ID number"
                                    value={searchIdNumber}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSearchIdNumber(newValue);

                                        // If search field is cleared and we had an existing patient, reset to new record mode
                                        if (newValue === "" && existingPatient) {
                                            setExistingPatient(null);
                                            setFormData({
                                                name: "",
                                                age: 0,
                                                sex: "",
                                                phoneNumber: "",
                                                weight: "",
                                                height: "",
                                                temperature: "",
                                                bloodPresure: "",
                                                respiratoryRate: "",
                                                heartRate: "",
                                                chiefComplaint: "",
                                                symptoms: "",
                                                address: "",
                                                idNumber: "",
                                                medicalHistory: "",
                                                allergies: "",
                                                toxicHabits: "",
                                                isPregnant: false
                                            });
                                            setErrors({});
                                            toast.info("Form cleared for new patient record");
                                        }
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
                                    className=" focus:border-blue-500"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={handleSearchPatient}
                                disabled={isSearching || !searchIdNumber.trim()}
                                className="bg-[#0c9aff] hover:bg-blue-500"
                            >
                                {isSearching ? "Searching..." : "Search"}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleClearForm}
                                variant="outline"
                                className="border-gray-300"
                            >
                                Clear
                            </Button>
                        </div>

                        {existingPatient ? (
                            <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                <div className="flex items-center gap-2 text-green-800">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Patient Found:</span>
                                    <span>{existingPatient.name} (ID: {existingPatient.idNumber})</span>
                                </div>
                                <p className="text-green-700 text-sm mt-1">
                                    Form has been populated with existing data. Make any necessary updates below.
                                </p>
                            </div>
                        ) : searchIdNumber === "" ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                                <div className="flex items-center gap-2 text-blue-800">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="font-medium">New Patient Mode</span>
                                </div>
                                <p className="text-blue-700 text-sm mt-1">
                                    Ready to create a new patient record. Enter an ID number above to search for existing patients.
                                </p>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                {/* Patient Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="age">Age (yrs)</Label>
                            <Input
                                id="age"
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                                className={` focus:border-blue-500 ${errors.age ? 'border-red-500' : ''}`}
                            />
                            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sex">Sex</Label>
                            <select
                                id="sex"
                                value={formData.sex}
                                onChange={(e) => setFormData((prev) => ({ ...prev, sex: e.target.value }))}
                                className={`w-full rounded-md border  focus:border-blue-500 px-3 py-2 text-sm outline-none ${errors.sex ? "border-red-500" : ""}`}
                            >
                                <option value="">Select sex</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.sex && <p className="text-red-500 text-sm mt-1">{errors.sex}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="idNumber">ID Number</Label>
                            <Input
                                id="idNumber"
                                value={formData.idNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.idNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.address ? 'border-red-500' : ''}`}
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                            <Textarea
                                id="chiefComplaint"
                                value={formData.chiefComplaint}
                                onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.chiefComplaint ? 'border-red-500' : ''}`}
                            />
                            {errors.chiefComplaint && <p className="text-red-500 text-sm mt-1">{errors.chiefComplaint}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="symptoms">Symptoms</Label>
                        <Textarea
                            id="symptoms"
                            value={formData.symptoms}
                            onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                            className={` focus:border-blue-500 ${errors.symptoms ? 'border-red-500' : ''}`}
                        />
                        {errors.symptoms && <p className="text-red-500 text-sm mt-1">{errors.symptoms}</p>}
                    </div>

                    {/* Medical Information */}
                    <div className="space-y-2">
                        <Label htmlFor="medicalHistory">Medical History</Label>
                        <Textarea
                            id="medicalHistory"
                            value={formData.medicalHistory}
                            onChange={(e) => setFormData(prev => ({ ...prev, medicalHistory: e.target.value }))}
                            className={` focus:border-blue-500 ${errors.medicalHistory ? 'border-red-500' : ''}`}
                        />
                        {errors.medicalHistory && <p className="text-red-500 text-sm mt-1">{errors.medicalHistory}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                            id="allergies"
                            value={formData.allergies}
                            onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                            className={` focus:border-blue-500 ${errors.allergies ? 'border-red-500' : ''}`}
                        />
                        {errors.allergies && <p className="text-red-500 text-sm mt-1">{errors.allergies}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="toxicHabits">Toxic Habits</Label>
                        <Textarea
                            id="toxicHabits"
                            value={formData.toxicHabits}
                            onChange={(e) => setFormData(prev => ({ ...prev, toxicHabits: e.target.value }))}
                            className={` focus:border-blue-500 ${errors.toxicHabits ? 'border-red-500' : ''}`}
                        />
                        {errors.toxicHabits && <p className="text-red-500 text-sm mt-1">{errors.toxicHabits}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPregnant"
                            checked={formData.isPregnant}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPregnant: !!checked }))}
                            className=""
                        />
                        <Label htmlFor="isPregnant">Is Pregnant</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                                id="weight"
                                value={formData.weight}
                                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.weight ? 'border-red-500' : ''}`}
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input
                                id="height"
                                value={formData.height}
                                onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.height ? 'border-red-500' : ''}`}
                            />
                            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="temperature">Temperature (°C)</Label>
                            <Input
                                id="temperature"
                                value={formData.temperature}
                                onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.temperature ? 'border-red-500' : ''}`}
                            />
                            {errors.temperature && <p className="text-red-500 text-sm mt-1">{errors.temperature}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bloodPresure">Blood Pressure</Label>
                            <Input
                                id="bloodPresure"
                                value={formData.bloodPresure}
                                onChange={(e) => setFormData(prev => ({ ...prev, bloodPresure: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.bloodPresure ? 'border-red-500' : ''}`}
                            />
                            {errors.bloodPresure && <p className="text-red-500 text-sm mt-1">{errors.bloodPresure}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                            <Input
                                id="respiratoryRate"
                                value={formData.respiratoryRate}
                                onChange={(e) => setFormData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.respiratoryRate ? 'border-red-500' : ''}`}
                            />
                            {errors.respiratoryRate && <p className="text-red-500 text-sm mt-1">{errors.respiratoryRate}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate</Label>
                            <Input
                                id="heartRate"
                                value={formData.heartRate}
                                onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                                className={` focus:border-blue-500 ${errors.heartRate ? 'border-red-500' : ''}`}
                            />
                            {errors.heartRate && <p className="text-red-500 text-sm mt-1">{errors.heartRate}</p>}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outline"
                            className="border-blue-300 hover:bg-blue-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#0c9aff] hover:bg-blue-400 text-white"
                        >
                            {isLoading ? "Saving..." : existingPatient ? "Update Patient Data" : "Save Patient Data"}
                        </Button>
                    </div>
                </form>
            </div>
        </SheetContent>
    );
}