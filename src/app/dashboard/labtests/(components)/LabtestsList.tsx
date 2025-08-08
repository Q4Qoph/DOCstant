import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import ResultsForm from "./ResultsForm";
import Link from "next/link";


const LabtestsList = ({ labTests, showPatientDetails = true }: any) => {

    const [editTest, setEditTest] = useState<any | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const onEdit = (test: any) => {
        setEditTest(test);
        setFormOpen(true);
    };

    return (
        <div>
            {
                labTests.length === 0 ? (
                    <div className="grid gap-4 px-8">
                        <Card>
                            <CardContent className="text-center p-8">
                                <p className="font-semibold text-lg">No lab tests found.</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid gap-4 px-8">
                        {labTests.map((test: any) => (
                            <Card key={test.id} className="shadow-none">
                                <CardHeader className="border-b">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        onClick={() => onEdit(test)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-blue-300 hover:bg-blue-50"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        Upload Results
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Click to upload and save test results
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 text-sm grid gap-2">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="font-medium">Test Name</p>
                                            <p className="text-gray-700">{test.testName}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Test Date</p>
                                            <p className="text-gray-700">
                                                {new Date(test.testDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Cost</p>
                                            <p className="text-gray-700">Ksh {test.cost}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="font-medium text-xs mb-1">Result:</p>
                                        <p className="text-gray-600 text-xs line-clamp-2">
                                            {test.labTestResult || "Pending / Not Available"}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            {formOpen && (
                <ResultsForm
                    open={formOpen}
                    onOpenChange={(open) => {
                        setFormOpen(open);
                        if (!open) setEditTest(null);
                    }}
                    diagnosisId={editTest?.diagnosisId}
                    labTest={editTest}
                />
            )}
        </div>
    )
}


export default LabtestsList