import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Stethoscope, Plus } from "lucide-react"
import AddExaminationForm from "./AddExaminations"
import { sortByCreatedAt } from "@/lib/sortItems"

// Technique mapping
const techniqueOptions = [
    "Inspection",         // 0
    "Palpation",          // 1
    "Percussion",         // 2
    "Auscultation",       // 3
];

const Examinations = ({ patient }: any) => {
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    return (
        <div>
            <TabsContent value="examinations" className="mt-0">
                <Card className="shadow-none">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-[#0c9aff]" />
                                Physical Examinations ({patient.examinations.length})
                            </CardTitle>
                            
                            {/* Add Examination Button */}
                            <Sheet open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                                <SheetTrigger asChild>
                                    <Button 
                                        size="sm" 
                                        className="bg-[#0c9aff] hover:bg-blue-500 text-white"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Examination
                                    </Button>
                                </SheetTrigger>
                                <AddExaminationForm
                                    patientId={patient.id}
                                    patientData={patient}
                                    onCancel={() => setIsAddFormOpen(false)}
                                />
                            </Sheet>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {sortByCreatedAt(patient.examinations).length > 0 ? (
                            <div className="space-y-4">
                                {patient.examinations.map((examination: any, index: number) => (
                                    <div key={index} className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-semibold text-lg">Examination #{index + 1}</h4>
                                            <Badge className="bg-blue-100 text-[#0c9aff] border-blue-300">
                                                {techniqueOptions[examination.technique] ?? "Unknown"}
                                            </Badge>
                                        </div>
                                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {examination.physicalExamination}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Stethoscope className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 text-lg mb-4">No examinations recorded</p>
                                
                                {/* Add Examination Button for empty state */}
                                <Sheet open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
                                    <SheetTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            className="border-blue-300 text-[#0c9aff] hover:bg-blue-50"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add First Examination
                                        </Button>
                                    </SheetTrigger>
                                    <AddExaminationForm
                                        patientId={patient.id}
                                        patientData={patient}
                                        onCancel={() => setIsAddFormOpen(false)}
                                    />
                                </Sheet>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
    )
}

export default Examinations