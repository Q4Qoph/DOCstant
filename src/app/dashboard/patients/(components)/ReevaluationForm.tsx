"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Activity, User, Heart, Thermometer, Weight, Ruler, Stethoscope, TestTube, Bot, FileText, AlertTriangle, Clock, TrendingUp } from "lucide-react";

interface ReevaluationFormData {
    name: string;
    age: number;
    sex: string;
    phoneNumber: string;
    chiefComplaint: string;
    weight: string;
    height: string;
    temperature: string;
    bloodPresure: string;
    respiratoryRate: string;
    heartRate: string;
    symptoms: string;
    doctorId: string;
    address: string;
    idNumber: string;
    medicalHistory: string;
    allergies: string;
    toxicHabits: string;
    isPregnant: boolean;
    laboratoryResults: string;
    imageResults: string;
    department: number;
    aiResponse: string;
    diagnosisId: string;
}

interface ReevaluationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diagnosisId: string;
    patientData: any;
    onSubmit: (data: ReevaluationFormData) => void;
    isLoading?: boolean;
}

const ReevaluationForm = ({
    open,
    onOpenChange,
    diagnosisId,
    patientData,
    onSubmit,
    isLoading = false
}: ReevaluationFormProps) => {
    const [formData, setFormData] = useState<ReevaluationFormData>({
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
        doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // Default doctor ID
        address: "",
        idNumber: "",
        medicalHistory: "",
        allergies: "",
        toxicHabits: "",
        isPregnant: false,
        laboratoryResults: "",
        imageResults: "",
        department: 0,
        aiResponse: "",
        diagnosisId: diagnosisId,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ReevaluationFormData, string>>>({});
    const [activeTab, setActiveTab] = useState("basic");
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    // Pre-populate form with existing patient data
    useEffect(() => {
        if (patientData && open) {
            setFormData({
                name: patientData.name || "",
                age: patientData.age || 0,
                sex: patientData.sex || "",
                phoneNumber: patientData.phoneNumber || "",
                chiefComplaint: patientData.chiefComplaint || "",
                weight: patientData.weight || "",
                height: patientData.height || "",
                temperature: "",
                bloodPresure: "",
                respiratoryRate: "",
                heartRate: "",
                symptoms: patientData.symptoms || "",
                doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                address: patientData.address || "",
                idNumber: patientData.idNumber || "",
                medicalHistory: patientData.medicalHistory || "",
                allergies: patientData.allergies || "",
                toxicHabits: patientData.toxicHabits || "",
                isPregnant: patientData.isPregnant || false,
                laboratoryResults: "",
                imageResults: "",
                department: patientData.department || 0,
                aiResponse: "",
                diagnosisId: diagnosisId,
            });
        }
    }, [patientData, open, diagnosisId]);

    const handleInputChange = (field: keyof ReevaluationFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Partial<Record<keyof ReevaluationFormData, string>> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.age || formData.age <= 0) newErrors.age = "Valid age is required";
        if (!formData.sex) newErrors.sex = "Sex is required";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
        if (!formData.chiefComplaint.trim()) newErrors.chiefComplaint = "Chief complaint is required";
        if (!formData.symptoms.trim()) newErrors.symptoms = "Current symptoms are required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateAIAnalysis = async () => {
        setIsGeneratingAI(true);
        try {
            // Simulate AI analysis generation
            await new Promise(resolve => setTimeout(resolve, 2000));

            const analysisPrompt = `
Based on the patient data:
- Age: ${formData.age}, Sex: ${formData.sex}
- Chief Complaint: ${formData.chiefComplaint}
- Current Symptoms: ${formData.symptoms}
- Vitals: BP ${formData.bloodPresure}, HR ${formData.heartRate}, Temp ${formData.temperature}°C, RR ${formData.respiratoryRate}
- Medical History: ${formData.medicalHistory}
- Lab Results: ${formData.laboratoryResults}
- Imaging: ${formData.imageResults}
            `;

            const aiAnalysis = `
**REEVALUATION ANALYSIS**

**Clinical Assessment:**
Patient presents for follow-up evaluation with ongoing symptoms. Based on current presentation and historical data, the following observations are noted:

**Symptom Progression:**
- Current symptoms appear to be ${formData.symptoms.toLowerCase().includes('improved') ? 'improving' : formData.symptoms.toLowerCase().includes('worse') ? 'worsening' : 'stable'}
- Vital signs ${formData.temperature && parseFloat(formData.temperature) > 37.5 ? 'indicate possible infection/inflammation' : 'within normal parameters'}

**Recommendations:**
1. Continue current treatment plan with modifications as needed
2. Monitor symptom progression closely
3. Consider additional diagnostic workup if symptoms persist
4. Follow-up in 1-2 weeks or sooner if symptoms worsen

**Next Steps:**
- Review all current medications
- Assess treatment compliance
- Consider consultation with specialist if indicated
- Patient education on warning signs

*This analysis is AI-generated and should be reviewed by the attending physician.*
            `;

            handleInputChange("aiResponse", aiAnalysis);
        } catch (error) {
            console.error("Error generating AI analysis:", error);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleClose = () => {
        setFormData({
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
            doctorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            address: "",
            idNumber: "",
            medicalHistory: "",
            allergies: "",
            toxicHabits: "",
            isPregnant: false,
            laboratoryResults: "",
            imageResults: "",
            department: 0,
            aiResponse: "",
            diagnosisId: diagnosisId,
        });
        setErrors({});
        setActiveTab("basic");
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto p-4">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        Patient Reevaluation
                        <Clock className="h-4 w-4 text-gray-400 ml-2" />
                    </SheetTitle>
                    <SheetDescription>
                        Conduct a comprehensive follow-up evaluation of the patient's current condition and progress.
                    </SheetDescription>
                </SheetHeader>

                <div className="my-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                <TabsTrigger value="vitals">Vitals & Symptoms</TabsTrigger>
                                <TabsTrigger value="medical">Medical History</TabsTrigger>
                                <TabsTrigger value="results">Results & AI</TabsTrigger>
                            </TabsList>

                            {/* Basic Information Tab */}
                            <TabsContent value="basic" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <User className="h-5 w-5" />
                                            Patient Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name *</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                                    className={errors.name ? "border-red-500" : ""}
                                                    disabled={isLoading}
                                                />
                                                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="age">Age *</Label>
                                                <Input
                                                    id="age"
                                                    type="number"
                                                    value={formData.age}
                                                    onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                                                    className={errors.age ? "border-red-500" : ""}
                                                    disabled={isLoading}
                                                />
                                                {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sex">Sex *</Label>
                                                <Select value={formData.sex} onValueChange={(value) => handleInputChange("sex", value)}>
                                                    <SelectTrigger className={errors.sex ? "border-red-500" : ""}>
                                                        <SelectValue placeholder="Select sex" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">Male</SelectItem>
                                                        <SelectItem value="Female">Female</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.sex && <p className="text-sm text-red-500 mt-1">{errors.sex}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number *</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    value={formData.phoneNumber}
                                                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                                    className={errors.phoneNumber ? "border-red-500" : ""}
                                                    disabled={isLoading}
                                                />
                                                {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="idNumber">ID Number</Label>
                                            <Input
                                                id="idNumber"
                                                value={formData.idNumber}
                                                onChange={(e) => handleInputChange("idNumber", e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange("address", e.target.value)}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Select value={formData.department.toString()} onValueChange={(value) => handleInputChange("department", parseInt(value))}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">Receptionist</SelectItem>
                                                    <SelectItem value="1">General Practitioner</SelectItem>
                                                    <SelectItem value="2">Specialist</SelectItem>
                                                    <SelectItem value="3">Pharmacist</SelectItem>
                                                    <SelectItem value="4">Lab Technician</SelectItem>
                                                    <SelectItem value="5">Admin</SelectItem>

                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="isPregnant"
                                                checked={formData.isPregnant}
                                                onCheckedChange={(checked) => handleInputChange("isPregnant", checked)}
                                                disabled={isLoading}
                                            />
                                            <Label htmlFor="isPregnant">Patient is pregnant</Label>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Vitals & Symptoms Tab */}
                            <TabsContent value="vitals" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Heart className="h-5 w-5 text-red-500" />
                                            Current Condition
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="chiefComplaint">Chief Complaint *</Label>
                                            <Textarea
                                                id="chiefComplaint"
                                                placeholder="What is the main reason for this reevaluation?"
                                                value={formData.chiefComplaint}
                                                onChange={(e) => handleInputChange("chiefComplaint", e.target.value)}
                                                className={errors.chiefComplaint ? "border-red-500" : ""}
                                                disabled={isLoading}
                                            />
                                            {errors.chiefComplaint && <p className="text-sm text-red-500 mt-1">{errors.chiefComplaint}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="symptoms">Current Symptoms *</Label>
                                            <Textarea
                                                id="symptoms"
                                                placeholder="Describe current symptoms and any changes since last visit..."
                                                value={formData.symptoms}
                                                onChange={(e) => handleInputChange("symptoms", e.target.value)}
                                                className={errors.symptoms ? "border-red-500" : ""}
                                                disabled={isLoading}
                                            />
                                            {errors.symptoms && <p className="text-sm text-red-500 mt-1">{errors.symptoms}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Stethoscope className="h-5 w-5 text-blue-500" />
                                            Vital Signs
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="temperature" className="flex items-center gap-2">
                                                    <Thermometer className="h-4 w-4" />
                                                    Temperature (°C)
                                                </Label>
                                                <Input
                                                    id="temperature"
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="36.5"
                                                    value={formData.temperature}
                                                    onChange={(e) => handleInputChange("temperature", e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bloodPresure" className="flex items-center gap-2">
                                                    <Heart className="h-4 w-4" />
                                                    Blood Pressure
                                                </Label>
                                                <Input
                                                    id="bloodPresure"
                                                    placeholder="120/80"
                                                    value={formData.bloodPresure}
                                                    onChange={(e) => handleInputChange("bloodPresure", e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                                                <Input
                                                    id="heartRate"
                                                    type="number"
                                                    placeholder="72"
                                                    value={formData.heartRate}
                                                    onChange={(e) => handleInputChange("heartRate", e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="respiratoryRate">Respiratory Rate (rpm)</Label>
                                                <Input
                                                    id="respiratoryRate"
                                                    type="number"
                                                    placeholder="16"
                                                    value={formData.respiratoryRate}
                                                    onChange={(e) => handleInputChange("respiratoryRate", e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="weight" className="flex items-center gap-2">
                                                    <Weight className="h-4 w-4" />
                                                    Weight (kg)
                                                </Label>
                                                <Input
                                                    id="weight"
                                                    placeholder="70.5"
                                                    value={formData.weight}
                                                    onChange={(e) => handleInputChange("weight", e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="height" className="flex items-center gap-2">
                                                    <Ruler className="h-4 w-4" />
                                                    Height (cm)
                                                </Label>
                                                <Input
                                                    id="height"
                                                    placeholder="170"
                                                    value={formData.height}
                                                    onChange={(e) => handleInputChange("height", e.target.value)}
                                                    disabled={isLoading}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Medical History Tab */}
                            <TabsContent value="medical" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <FileText className="h-5 w-5 text-green-500" />
                                            Medical Background
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="medicalHistory">Medical History</Label>
                                            <Textarea
                                                id="medicalHistory"
                                                placeholder="Previous medical conditions, surgeries, hospitalizations..."
                                                value={formData.medicalHistory}
                                                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                                                disabled={isLoading}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="allergies" className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                                                Allergies
                                            </Label>
                                            <Textarea
                                                id="allergies"
                                                placeholder="Drug allergies, food allergies, environmental allergies..."
                                                value={formData.allergies}
                                                onChange={(e) => handleInputChange("allergies", e.target.value)}
                                                disabled={isLoading}
                                                rows={2}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="toxicHabits">Toxic Habits</Label>
                                            <Textarea
                                                id="toxicHabits"
                                                placeholder="Smoking, alcohol consumption, drug use..."
                                                value={formData.toxicHabits}
                                                onChange={(e) => handleInputChange("toxicHabits", e.target.value)}
                                                disabled={isLoading}
                                                rows={2}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Results & AI Tab */}
                            <TabsContent value="results" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <TestTube className="h-5 w-5 text-blue-500" />
                                            Test Results
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="laboratoryResults">Laboratory Results</Label>
                                            <Textarea
                                                id="laboratoryResults"
                                                placeholder="Blood work, urine analysis, cultures, etc..."
                                                value={formData.laboratoryResults}
                                                onChange={(e) => handleInputChange("laboratoryResults", e.target.value)}
                                                disabled={isLoading}
                                                rows={3}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="imageResults">Imaging Results</Label>
                                            <Textarea
                                                id="imageResults"
                                                placeholder="X-rays, CT scans, MRI, ultrasound findings..."
                                                value={formData.imageResults}
                                                onChange={(e) => handleInputChange("imageResults", e.target.value)}
                                                disabled={isLoading}
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Bot className="h-5 w-5 text-blue-500" />
                                            AI Analysis
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={generateAIAnalysis}
                                                disabled={isGeneratingAI || isLoading}
                                                className="ml-auto"
                                            >
                                                {isGeneratingAI ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <TrendingUp className="h-4 w-4 mr-2" />
                                                        Generate Analysis
                                                    </>
                                                )}
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <Label htmlFor="aiResponse">AI Clinical Analysis</Label>
                                            <Textarea
                                                id="aiResponse"
                                                placeholder="AI-generated clinical analysis will appear here..."
                                                value={formData.aiResponse}
                                                onChange={(e) => handleInputChange("aiResponse", e.target.value)}
                                                disabled={isLoading}
                                                rows={8}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <div className="flex space-x-4 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving Re-evaluation...
                                    </>
                                ) : (
                                    <>
                                        <Activity className="h-4 w-4 mr-2" />
                                        Save Re-evalutation
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ReevaluationForm;