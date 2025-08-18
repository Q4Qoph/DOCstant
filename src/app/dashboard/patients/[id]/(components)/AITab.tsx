import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Pill, Sparkles } from "lucide-react"
import api from "@/lib/axios"
import { Patient } from "@/types"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { toast } from "sonner"
import PrescriptionSheet from "@/app/dashboard/prescriptions/(components)/PrescriptionSheet"

const AITab = ({ patient }: { patient: Patient }) => {
    const [prescOpen, setPrescOpen] = useState(false);

    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)

    const handleGenerateAnalysis = async () => {
        try {
            setLoading(true)
            await api.post("/api/ai", null, { params: { id: patient.id, steps: 2 } })
            toast.success("Analysis complete!")
            await queryClient.invalidateQueries({ queryKey: ["patient", patient.id] })
        } catch (error) {
            // toast.error("Failed to generate AI diagnosis. Please try again.");
        } finally {
            setLoading(false)
        }
    }
    
    const analyzePrescribe = patient.aiResponse?.find(
        item => item.step == "2"
    );

    return (
        <TabsContent value="ai-analysis" className="mt-0">
            {analyzePrescribe ? (
                <Card className="shadow-none">
                    <CardHeader className="flex justify-between border-b border-slate-200">
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-blue-600" />
                            AI Analysis & Response
                        </CardTitle>
                        {/* <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={handleGenerateAnalysis}
                            disabled={loading}
                        >
                            <Sparkles className={cn(
                                "h-4 w-4 mr-2",
                                loading && "animate-spin"
                            )} />
                            {loading ? "Regenerating..." : "Regenerate Diagnosis"}
                        </Button> */}
                        <Button onClick={() => setPrescOpen(true)} className="bg-blue-500 hover:bg-blue-600 mt-4">
                            <Pill className="h-4 w-4 mr-2" />
                            Prescribe Medication
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className={cn("bg-gray-50 p-4 rounded-lg border border-gray-200", loading && "opacity-20 animate-pulse")}>
                            <div className="prose prose-sm text-gray-700 max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                >
                                    {analyzePrescribe.response}
                                </ReactMarkdown>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="shadow-none">
                    <CardContent className="p-6">
                        <div className="text-center py-8 text-gray-500">
                            <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No AI analysis available</p>
                            <Button
                                className="bg-blue-500 hover:bg-blue-600 mt-3"
                                onClick={handleGenerateAnalysis}
                                disabled={loading}
                            >
                                <Sparkles className={cn(
                                    "h-4 w-4 mr-2",
                                    loading && "animate-spin"
                                )} />
                                {loading ? "Analyzing..." : "Analyze With AI"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}


            <PrescriptionSheet
                diagnosisId={patient.id}
                open={prescOpen}
                onOpenChange={setPrescOpen}
            />
        </TabsContent>
    )
}

export default AITab
