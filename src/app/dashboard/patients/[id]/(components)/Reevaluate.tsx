import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, Bot, Clock, Plus } from "lucide-react";
import { useState } from "react";
import ReevaluationForm from "../../(components)/ReevaluationForm";

const createReevaluation = (data: any) => api.post('/api/Reevaluation', data);
const getReevaluations = (diagnosisId: string) => api.get(`/api/Reevaluation/${diagnosisId}`);


const Reevaluate = ({ id, patient }: { id: any, patient: any }) => {
    const [reevaluationOpen, setReevaluationOpen] = useState(false);
    const {
        data: reevaluations,
        isLoading: reevaluationsLoading,
    } = useQuery({
        queryKey: ["reevaluations", id],
        queryFn: () => getReevaluations(id as string).then((res) => res.data),
        enabled: !!id,
    });
    const queryClient = useQueryClient();
    //Add create reevaluation function
    const createReevaluationMutation = useMutation({
        mutationFn: createReevaluation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reevaluations", id] });
            setReevaluationOpen(false);
        },
    });
    return (
        <TabsContent value="reevaluations" className="mt-0">
            <Card className="shadow-none">
                <CardHeader className="flex justify-between border-b border-slate-200">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Patient Reevaluations
                    </CardTitle>
                    <Button onClick={() => setReevaluationOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Reevaluation
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    {reevaluationsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : reevaluations && reevaluations.length > 0 ? (
                        <div className="space-y-6">
                            {reevaluations.map((reevaluation: any, index: number) => (
                                <div key={reevaluation.id} className="">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-lg">
                                                Reevaluation #{index + 1}
                                            </h4>
                                            <p className="text-sm">
                                                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className="bg-blue-100 border-blue-300">Follow-up</Badge>
                                            {reevaluation.isPregnant && (
                                                <Badge className="bg-pink-100 text-pink-800 border-pink-300">Pregnant</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-white p-3 rounded-lg border border-purple-100">
                                            <h5 className="font-semibold  mb-2">Chief Complaint</h5>
                                            <p className="text-sm text-gray-700">{reevaluation.chiefComplaint}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-purple-100">
                                            <h5 className="font-semibold  mb-2">Current Symptoms</h5>
                                            <p className="text-sm text-gray-700">{reevaluation.symptoms}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-purple-100">
                                            <h5 className="font-semibold mb-2">Vital Signs</h5>
                                            <div className="text-sm text-gray-700 space-y-1">
                                                <div>BP: {reevaluation.bloodPresure}</div>
                                                <div>Temp: {reevaluation.temperature}</div>
                                                <div>HR: {reevaluation.heartRate}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {reevaluation.laboratoryResults && (
                                        <div className="bg-white p-3 rounded-lg border border-purple-100 mb-4">
                                            <h5 className="font-semibold mb-2">Latest Lab Results</h5>
                                            <p className="text-sm text-gray-700">{reevaluation.laboratoryResults}</p>
                                        </div>
                                    )}
                                    {reevaluation.aiResponse && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                                                <Bot className="h-4 w-4" />
                                                AI Assessment
                                            </h5>
                                            <p className="text-sm text-gray-700">{reevaluation.aiResponse}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                                <Activity className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reevaluations Yet</h3>
                            <p className="text-gray-500 mb-4">Track patient progress with follow-up evaluations</p>
                            <Button onClick={() => setReevaluationOpen(true)} className="bg-blue-500 hover:bg-blue-600">
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule First Reevaluation
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ReevaluationForm
                open={reevaluationOpen}
                onOpenChange={setReevaluationOpen}
                diagnosisId={id as string}
                patientData={patient}
                onSubmit={(data) => createReevaluationMutation.mutate(data)}
                isLoading={createReevaluationMutation.isPending}
            />
        </TabsContent>
    )
}

export default Reevaluate