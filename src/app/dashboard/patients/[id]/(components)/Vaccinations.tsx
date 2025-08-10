import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import React, { Key } from 'react'
import { Activity, Badge } from 'lucide-react'
import AICard from './AICard'

const Vaccinations = ({ patient }: any) => {
    return (
        <TabsContent
            value="vaccinations"
            className="mt-0">
            <Card className="border-slate-200 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Vaccinations ({patient.vaccinations.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {patient.vaccinations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {patient.vaccinations.map((vaccination: any, index: Key) => (
                                <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <Badge className="bg-green-100 text-green-800 border-green-300">
                                        {vaccination.vaccineName}
                                    </Badge>
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
            <AICard patient={patient} index={1} />
        </TabsContent>
    )
}

export default Vaccinations