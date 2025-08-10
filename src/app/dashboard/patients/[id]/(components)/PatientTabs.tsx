"use client"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, FileText, Activity, Stethoscope, Target, TestTube, Bot, Clock, DollarSign } from "lucide-react"

export default function PatientTabs() {
  const tabs = [
    { value: "basic-info", icon: User, label: "Basic Info", shortLabel: "Info" },
    { value: "medical-history", icon: FileText, label: "Medical History", shortLabel: "Medical" },
    { value: "examinations", icon: Stethoscope, label: "Examinations", shortLabel: "Exams" },
    { value: "vaccinations", icon: Activity, label: "Vaccinations", shortLabel: "Vaccines" },
    { value: "laboratory", icon: TestTube, label: "Laboratory", shortLabel: "Lab" },
    { value: "ai-analysis", icon: Bot, label: "AI Analysis", shortLabel: "AI" },
    { value: "treatments", icon: Target, label: "Treatments", shortLabel: "Treatment" },
    { value: "expenses", icon: DollarSign, label: "Expenses & Payments", shortLabel: "Expenses" },
    { value: "reevaluations", icon: Clock, label: "Re-evaluations", shortLabel: "Re-eval" },
  ]

  return (
    <div>
      {/* Desktop/Tablet View */}
      <TabsList className="hidden md:grid w-full grid-cols-5 lg:grid-cols-9 h-auto p-2 bg-gray-50 border border-gray-100 rounded-t-xl">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="group flex flex-col items-center gap-2 py-4 px-3 text-xs font-medium rounded-lg transition-all duration-200
                         data-[state=active]:bg-transparent data-[state=active]:shadow-none
                         hover:bg-transparent text-slate-600 hover:text-slate-800"
            >
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 group-data-[state=active]:bg-blue-500 group-data-[state=active]:text-white transition-colors duration-200">
                <IconComponent className="h-5 w-5" />
              </div>
              <span className="hidden lg:inline text-center leading-tight text-blue-500 group-data-[state=active]:text-blue-500">{tab.label}</span>
              <span className="lg:hidden text-center leading-tight group-data-[state=active]:text-blue-500">{tab.shortLabel}</span>
            </TabsTrigger>
          )
        })}
      </TabsList>

      {/* Mobile View - Horizontal Scroll */}
      <div className="md:hidden">
        <TabsList className="flex w-full h-auto p-2 bg-gradient-to-r from-gray-50 to-indigo-50 border border-blue-100 rounded-xl overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max px-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex bg-transparent flex-col items-center gap-2 py-3 px-4 text-xs font-medium rounded-lg transition-all duration-200
                              data-[state=active]:text-blue-700 data-[state=active]:border data-[state=active]:border-blue-200
                             hover:bg-white/50 text-slate-600 hover:text-slate-800 whitespace-nowrap min-w-[80px]"
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-full text-slate-500 group-data-[state=active]:bg-blue-100 group-data-[state=active]:text-blue-700 transition-colors duration-200">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <span className="text-center leading-tight">{tab.shortLabel}</span>
                </TabsTrigger>
              )
            })}
          </div>
        </TabsList>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
