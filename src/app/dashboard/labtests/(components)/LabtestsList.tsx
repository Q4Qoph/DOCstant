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
                                        {showPatientDetails &&
                                            <div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link
                                                                className="group flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                                                                href={`/dashboard/patients/${test.diagnosisId}`}
                                                            >
                                                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                                                                    {test.diagnosis?.name || "Unnamed Patient"}
                                                                </h3>
                                                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                </svg>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>View patient details</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <p className="text-sm text-gray-600">Age: {test.diagnosis?.age}</p>
                                            </div>
                                        }
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