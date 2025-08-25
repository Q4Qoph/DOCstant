"use client"

import LabTestForm from '@/app/dashboard/labtests/(components)/LabTestForm'
import LabtestsList from '@/app/dashboard/labtests/(components)/LabtestsList'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import api from '@/lib/axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TestTube } from 'lucide-react'
import React, { useState } from 'react'

const TestnResults = ({ id }: any) => {
    const [labTestOpen, setLabTestOpen] = useState(false);

    const {
        data: labTests,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["labtests", id],
        queryFn: async () => {
            const response = await api.get(`/api/LabTest/${id}`);
            return response.data;
        },
    });

    return (
        <div>
            <TabsContent value="laboratory" className="mt-0">
                <Card className="border-slate-200 shadow-none">
                    <CardHeader className="flex justify-between border-b border-slate-200">
                        <CardTitle className="flex items-center gap-2">
                            <TestTube className="h-5 w-5 text-blue-600" />
                            Laboratory Results
                        </CardTitle>
                        <Button onClick={() => setLabTestOpen(true)} className="bg-[#0c9aff] hover:bg-blue-500 text-white">
                            Add Test
                        </Button>
                    </CardHeader>
                    <CardContent className='p-0 m-0'>
                        <LabtestsList
                            labTests={labTests}
                            showPatientDetails={false}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
            <LabTestForm
                open={labTestOpen}
                onOpenChange={setLabTestOpen}
                diagnosisId={id}
            />
        </div>
    )
}

export default TestnResults