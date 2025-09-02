"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Phone,
    MapPin,
    Syringe,
    Stethoscope,
    Search,
    Users,
    Activity,
    TrendingUp,
    Filter,
    SortDesc,
    Check,
    ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import PatientForm from "./PatientForm";
import PatientCard from "./PatientCard";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// --- Types ---
interface Examination {
    id: string;
    [key: string]: any;
}

interface Vaccination {
    id: string;
    [key: string]: any;
}

interface Patient {
    id: string;
    name?: string;
    phoneNumber?: string;
    address?: string;
    examinations?: Examination[];
    vaccinations?: Vaccination[];
}

type SortField = "name" | "phone" | "address" | "examinations" | "vaccinations";
type SortOrder = "asc" | "desc";

interface Filters {
    hasExaminations: boolean;
    hasVaccinations: boolean;
    noExaminations: boolean;
    noVaccinations: boolean;
}

// --- Component ---
export default function Records() {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortField>("name");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [filters, setFilters] = useState<Filters>({
        hasExaminations: false,
        hasVaccinations: false,
        noExaminations: false,
        noVaccinations: false,
    });

    const { user } = useAuth();
    const router = useRouter();

    const { data: patients, isLoading } = useQuery<Patient[]>({
        queryKey: ["patients", user?.companyId],
        queryFn: async () => {
            const response = await api.get<Patient[]>("/api/diagnosisrecord", {
                params: { companyId: user?.companyId },
            });
            return response.data;
        },
        enabled: !!user?.companyId, // ensures it only runs when companyId exists
    });

    const onAdd = () => setIsSheetOpen(true);

    const onView = (id: string) => {
        router.push(`/dashboard/patients/${id}`);
    };

    const patientsArray: any[] = Array.isArray(patients) ? patients : [];

    // Filter and sort patients
    const filteredPatients = useMemo(() => {
        let filtered = patientsArray.filter((patient) => {
            // Search filter
            const matchesSearch =
                !searchQuery ||
                patient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.phoneNumber?.includes(searchQuery) ||
                patient.address?.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Status filters
            const hasExams = (patient.examinations?.length ?? 0) > 0;
            const hasVaccinations = (patient.vaccinations?.length ?? 0) > 0;

            const hasActiveFilters = Object.values(filters).some(Boolean);
            if (!hasActiveFilters) return true;

            if (filters.hasExaminations && !hasExams) return false;
            if (filters.noExaminations && hasExams) return false;
            if (filters.hasVaccinations && !hasVaccinations) return false;
            if (filters.noVaccinations && hasVaccinations) return false;

            return true;
        });

        // Sorting
        filtered.sort((a, b) => {
            let aValue: string | number = "";
            let bValue: string | number = "";

            switch (sortBy) {
                case "name":
                    aValue = a.name?.toLowerCase() || "";
                    bValue = b.name?.toLowerCase() || "";
                    break;
                case "phone":
                    aValue = a.phoneNumber || "";
                    bValue = b.phoneNumber || "";
                    break;
                case "address":
                    aValue = a.address?.toLowerCase() || "";
                    bValue = b.address?.toLowerCase() || "";
                    break;
                case "examinations":
                    aValue = a.examinations?.length || 0;
                    bValue = b.examinations?.length || 0;
                    break;
                case "vaccinations":
                    aValue = a.vaccinations?.length || 0;
                    bValue = b.vaccinations?.length || 0;
                    break;
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortOrder === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });

        return filtered;
    }, [patientsArray, searchQuery, filters, sortBy, sortOrder]);

    const toggleFilter = (filterKey: keyof Filters) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: !prev[filterKey],
        }));
    };

    const clearAllFilters = () =>
        setFilters({
            hasExaminations: false,
            hasVaccinations: false,
            noExaminations: false,
            noVaccinations: false,
        });

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const getSortLabel = () => {
        const fieldNames: Record<SortField, string> = {
            name: "Name",
            phone: "Phone",
            address: "Address",
            examinations: "Examinations",
            vaccinations: "Vaccinations",
        };
        return `${fieldNames[sortBy]} (${sortOrder === "asc" ? "A-Z" : "Z-A"})`;
    };

    const getActiveFiltersCount = () =>
        Object.values(filters).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Enhanced Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-gray-900">Patient Records</h1>
                            <p className="text-gray-600">
                                Manage and review patient diagnosis records
                            </p>
                        </div>

                        {/* Header Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1 sm:min-w-[320px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search patients by name, phone, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="default" className="border-gray-300 relative">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filter
                                            {getActiveFiltersCount() > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600 text-white"
                                                >
                                                    {getActiveFiltersCount()}
                                                </Badge>
                                            )}
                                            <ChevronDown className="h-4 w-4 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                                            Filter by Status
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem
                                            checked={filters.hasExaminations}
                                            onCheckedChange={() => toggleFilter('hasExaminations')}
                                        >
                                            <Stethoscope className="h-4 w-4 mr-2" />
                                            Has Examinations
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={filters.noExaminations}
                                            onCheckedChange={() => toggleFilter('noExaminations')}
                                        >
                                            <Stethoscope className="h-4 w-4 mr-2 opacity-50" />
                                            No Examinations
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem
                                            checked={filters.hasVaccinations}
                                            onCheckedChange={() => toggleFilter('hasVaccinations')}
                                        >
                                            <Syringe className="h-4 w-4 mr-2" />
                                            Has Vaccinations
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem
                                            checked={filters.noVaccinations}
                                            onCheckedChange={() => toggleFilter('noVaccinations')}
                                        >
                                            <Syringe className="h-4 w-4 mr-2 opacity-50" />
                                            No Vaccinations
                                        </DropdownMenuCheckboxItem>
                                        {getActiveFiltersCount() > 0 && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={clearAllFilters}>
                                                    Clear All Filters
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="default" className="border-gray-300">
                                            <SortDesc className="h-4 w-4 mr-2" />
                                            Sort
                                            <ChevronDown className="h-4 w-4 ml-1" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <div className="px-3 py-2 text-sm font-semibold text-gray-700">
                                            Sort by: {getSortLabel()}
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleSort('name')}>
                                            <Users className="h-4 w-4 mr-2" />
                                            Name
                                            {sortBy === 'name' && (
                                                <Check className="h-4 w-4 ml-auto" />
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSort('phone')}>
                                            <Phone className="h-4 w-4 mr-2" />
                                            Phone Number
                                            {sortBy === 'phone' && (
                                                <Check className="h-4 w-4 ml-auto" />
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSort('address')}>
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Address
                                            {sortBy === 'address' && (
                                                <Check className="h-4 w-4 ml-auto" />
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSort('examinations')}>
                                            <Stethoscope className="h-4 w-4 mr-2" />
                                            Examinations Count
                                            {sortBy === 'examinations' && (
                                                <Check className="h-4 w-4 ml-auto" />
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleSort('vaccinations')}>
                                            <Syringe className="h-4 w-4 mr-2" />
                                            Vaccinations Count
                                            {sortBy === 'vaccinations' && (
                                                <Check className="h-4 w-4 ml-auto" />
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    onClick={onAdd}
                                    className="bg-[#0c9aff] hover:bg-blue-500 text-white shadow-sm"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Patient
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards - Only show when there are patients */}
                {patientsArray && patientsArray.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Patients</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {patientsArray.length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-blue-100">
                                        <Users className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Cases</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {patientsArray.filter((p) => p.examinations!?.length > 0).length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-green-100">
                                        <Activity className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white shadow-sm border border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Vaccinated</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">
                                            {patientsArray.filter((p) => p.vaccinations!?.length > 0).length}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-full bg-amber-100">
                                        <TrendingUp className="h-6 w-6 text-amber-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Results Section */}
                <Card className="bg-white shadow-sm border border-gray-200 p-0">
                    <CardHeader className="border-b border-gray-200 bg-gray-50/50 pt-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                {searchQuery ? `Search Results (${filteredPatients.length})` : 'All Patients'}
                            </CardTitle>
                            {filteredPatients.length > 0 && (
                                <p className="text-sm text-gray-500">
                                    Showing {filteredPatients.length} of {patientsArray.length} patients
                                </p>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="px-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0c9aff]"></div>
                                <span className="ml-3 text-gray-600">Loading patients...</span>
                            </div>
                        ) : !patientsArray || patientsArray.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto">
                                        <Users className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        No patients found
                                    </h3>
                                    <p className="text-gray-500">
                                        Get started by adding your first patient record
                                    </p>
                                    <Button onClick={onAdd} className="bg-[#0c9aff] hover:bg-blue-500 text-white">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add First Patient
                                    </Button>
                                </div>
                            </div>
                        ) : filteredPatients.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="p-4 rounded-full bg-gray-100 w-fit mx-auto">
                                        <Search className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        No results found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try adjusting your search terms or clear the search to see all patients
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchQuery("")}
                                        className="border-gray-300"
                                    >
                                        Clear Search
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredPatients.map((patient, index) => (
                                    <PatientCard
                                        key={patient.id || index}
                                        patient={patient}
                                        onView={onView}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <div style={{ display: 'none' }}></div>
                    </SheetTrigger>
                    <PatientForm setIsSheetOpen={setIsSheetOpen} onCancel={() => setIsSheetOpen(false)} />
                </Sheet>
            </div>
        </div>
    );
}