import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Activity } from "lucide-react";
import AICard from "../AICard";
import { Button } from "@/components/ui/button";
import VaccinationForm from "./AddVaccination";

const Vaccinations = ({ patient }: any) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleSuccess = () => {
        setIsSheetOpen(false);
    };

    return (
        <TabsContent value="vaccinations" className="mt-0">
            <Card className="border-slate-200 shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-600" />
                            Vaccinations ({patient.vaccinations.length})
                        </CardTitle>
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Add Vaccination
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="sm:max-w-[700px] w-full overflow-y-auto px-8 py-4">
                                <SheetHeader>
                                    <SheetTitle>Manage Vaccinations</SheetTitle>
                                </SheetHeader>
                                <div className="mt-6">
                                    <VaccinationForm
                                        patientId={patient.id}
                                        patientData={patient}
                                        onSuccess={handleSuccess}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </CardHeader>
                <CardContent>
                    {patient.vaccinations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {patient.vaccinations.map((vaccination: any, index: number) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-lg mb-2">
                                        Vaccination #{index + 1}
                                    </h4>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        {vaccination.vaccineName}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Activity className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No vaccinations recorded</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AICard patient={patient} step="1" />
        </TabsContent>
    );
};

export default Vaccinations;