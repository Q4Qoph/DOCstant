import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { AlertCircle, FileText } from 'lucide-react'
import React from 'react'
import AICard from './AICard'

const MedicalHistory = ({ patient }: any) => {
    return (
        <TabsContent value="medical-history" className="mt-0">
            <div className="space-y-6">
                <Card className="border-slate-200 shadow-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Medical History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {patient.medicalHistory}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-red-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                <AlertCircle className="h-5 w-5" />
                                Allergies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {patient.allergies}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-orange-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-700">
                                <AlertCircle className="h-5 w-5" />
                                Toxic Habits
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                                    {patient.toxicHabits}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* AI */}
            <AICard patient={patient} index={0} />
        </TabsContent>
    )
}

export default MedicalHistory