"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Heart, Syringe, Stethoscope, Calendar } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface PatientCardProps {
    patient: {
        id: string
        name: string
        age: number
        phoneNumber: string
        address: string
        isPregnant: boolean
        vaccinations: any[]
        examinations: any[]
        medicalHistory: string
        createdAt?: string
    }
    onView: (id: string) => void
}

export default function PatientCard({ patient, onView }: PatientCardProps) {
    const formattedCreatedAt = patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : "N/A"

    return (
        <Card
            key={patient.id}
            className="cursor-pointer shadow-none"
            onClick={() => onView(patient.id)}
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        className="group flex items-center gap-2 hover:text-blue-600 transition-colors duration-200"
                                        href={`/dashboard/patients/${patient.id}`}
                                    >
                                        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 hover:underline">
                                            {patient.name}
                                        </CardTitle>
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

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>Age {patient.age}</span>
                            {patient.createdAt && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span>Registered: {formattedCreatedAt}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{patient.phoneNumber}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-500" />
                        <p className="flex-1 line-clamp-2">{patient.address}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {patient.isPregnant && (
                        <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-300">
                            <Heart className="h-3 w-3 mr-1 fill-pink-500 text-pink-500" />
                            Pregnant
                        </Badge>
                    )}
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                        <Syringe className="h-3 w-3 mr-1 text-blue-500" />
                        {patient.vaccinations?.length || 0} Vaccination{patient.vaccinations?.length !== 1 ? "s" : ""}
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                        <Stethoscope className="h-3 w-3 mr-1 text-green-500" />
                        {patient.examinations?.length || 0} Examination{patient.examinations?.length !== 1 ? "s" : ""}
                    </Badge>
                </div>
                <div className="pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Medical History</h4>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {patient.medicalHistory || "No medical history recorded."}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
