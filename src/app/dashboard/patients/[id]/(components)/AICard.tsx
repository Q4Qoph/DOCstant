import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bot, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import api from "@/lib/axios"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

interface AIResponseCardProps {
    patient: any
    step: string
}

export default function AICard({ patient, step }: AIResponseCardProps) {
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    const handleGenerateAnalysis = async () => {
        try {
            setLoading(true)
            await api.post("/api/ai", null, { params: { id: patient.id } })
            toast.success("Analysis complete!")
            await queryClient.invalidateQueries({ queryKey: ["patient", patient.id] })
        } catch {
            toast.error("Failed to generate AI diagnosis. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const aiEntry = Array.isArray(patient.aiResponse)
        ? patient.aiResponse.find((item: any) => item.step === step)
        : undefined;

    return (
        <Card className="border-slate-200 shadow-none mt-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-blue-600" />
                    AI Analysis
                </CardTitle>
            </CardHeader>
            <CardContent>
                {aiEntry?.response ? (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                            {aiEntry.response}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        <Bot className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p>No AI analysis available</p>
                        <button
                            className={cn(
                                "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-3 flex items-center justify-center mx-auto",
                                loading && "opacity-70 cursor-not-allowed"
                            )}
                            onClick={handleGenerateAnalysis}
                            disabled={loading}
                        >
                            <Sparkles className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                            {loading ? "Analyzing..." : "Analyze With AI"}
                        </button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
