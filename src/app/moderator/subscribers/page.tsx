"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit, Plus, User, Mail, Phone, MapPin, Loader2, Users, TrendingUp, Clock, Search } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/axios"

// ----------------------
// Zod schema
// ----------------------
const phoneRegex = /^\+?[\d\s\-()]+$/

const userSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phoneNumber: z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 digits")
        .regex(phoneRegex, "Please enter a valid phone number"),
    address: z.string().trim().min(5, "Address must be at least 5 characters"),
})

type UserFormData = z.infer<typeof userSchema>

interface UserData extends UserFormData {
    id: string
    status?: "active" | "trial" | "pending"
    joinedDate?: string
}

// Mock API for demo purposes
// const api = {
//   get: async (url: string) => {
//     await new Promise((resolve) => setTimeout(resolve, 800))
//     return {
//       data: [
//         {
//           id: "1",
//           name: "Sarah Johnson",
//           email: "sarah@example.com",
//           phoneNumber: "+1 (555) 123-4567",
//           address: "123 Main St, New York, NY 10001",
//           status: "active",
//           joinedDate: "2024-01-15",
//         },
//         {
//           id: "2",
//           name: "Michael Chen",
//           email: "michael@example.com",
//           phoneNumber: "+1 (555) 987-6543",
//           address: "456 Oak Ave, San Francisco, CA 94102",
//           status: "trial",
//           joinedDate: "2024-02-20",
//         },
//         {
//           id: "3",
//           name: "Emily Rodriguez",
//           email: "emily@example.com",
//           phoneNumber: "+1 (555) 456-7890",
//           address: "789 Pine St, Austin, TX 73301",
//           status: "pending",
//           joinedDate: "2024-03-10",
//         },
//       ],
//     }
//   },
//   post: async (url: string, data: any) => {
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     return {
//       data: {
//         ...data,
//         id: Date.now().toString(),
//         status: "pending",
//         joinedDate: new Date().toISOString().split("T")[0],
//       },
//     }
//   },
//   put: async (url: string, data: any) => {
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     return { data: { ...data, id: url.split("/").pop() } }
//   },
//   delete: async (url: string) => {
//     await new Promise((resolve) => setTimeout(resolve, 500))
//     return { data: {} }
//   },
// }

export default function CustomerManagement() {
    const [users, setUsers] = useState<UserData[]>([])
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Form state
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    })
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({})

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setIsInitialLoading(true)
            const response = await api.get("/api/Company")
            setUsers(response.data)
        } catch (error) {
            toast.error("Failed to load customers. Please check your connection.")
        } finally {
            setIsInitialLoading(false)
        }
    }

    const validateForm = (data: UserFormData) => {
        const result = userSchema.safeParse(data)
        if (!result.success) {
            const fieldErrors: Partial<Record<keyof UserFormData, string>> = {}
            result.error.errors.forEach((err) => {
                const fieldName = err.path[0] as keyof UserFormData
                fieldErrors[fieldName] = err.message
            })
            setFormErrors(fieldErrors)
            return false
        }
        setFormErrors({})
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm(formData)) return

        setIsLoading(true)
        try {
            if (editingUser) {
                const response = await api.put(`/users/${editingUser.id}`, formData)
                setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? response.data : u)))
                toast.success("Customer updated successfully!")
            } else {
                const response = await api.post("/api/Company", formData)
                toast.success("Customer added successfully!")
            }
            setIsSheetOpen(false)
            resetForm()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message
                toast.error(`Failed to save customer: ${message}`)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (user: UserData) => {
        setEditingUser(user)
        setFormData({
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
        })
        setIsSheetOpen(true)
    }

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this customer?")) return
        setIsLoading(true)
        try {
            await api.delete(`/users/${userId}`)
            setUsers((prev) => prev.filter((u) => u.id !== userId))
            toast.success("Customer removed successfully!")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || error.message
                toast.error(`Failed to remove customer: ${message}`)
            } else {
                toast.error("Failed to remove customer. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleNewUser = () => {
        setEditingUser(null)
        resetForm()
        setIsSheetOpen(true)
    }

    const resetForm = () => {
        setFormData({ name: "", email: "", phoneNumber: "", address: "" })
        setFormErrors({})
    }

    const updateField = (field: keyof UserFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-700 border-emerald-200"
            case "trial":
                return "bg-amber-100 text-amber-700 border-amber-200"
            default:
                return "bg-gray-100 text-gray-700 border-gray-200"
        }
    }

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === "active").length,
        trial: users.filter((u) => u.status === "trial").length,
        pending: users.filter((u) => u.status === "pending").length,
    }

    if (isInitialLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-700 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold font-heading mb-2">
                                Manage Your Subscribers with Confidence
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl">
                                Track, update, and forecast subscription activity in real time. Build lasting relationships with your
                                customer base.
                            </p>
                        </div>
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    onClick={handleNewUser}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium hover-lift"
                                    size="lg"
                                >
                                    <Plus className="w-5 h-5 mr-2" /> Add New Subscriber
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
                                <SheetHeader className="pb-6">
                                    <SheetTitle className="text-2xl font-heading text-slate-700">
                                        {editingUser ? "Update Subscriber" : "Add New Subscriber"}
                                    </SheetTitle>
                                    <SheetDescription className="text-base">
                                        {editingUser
                                            ? "Update subscriber information and preferences"
                                            : "Quickly onboard a new customer and assign their plan"}
                                    </SheetDescription>
                                </SheetHeader>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                                                Full Name
                                            </Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => updateField("name", e.target.value)}
                                                className="h-11"
                                                placeholder="Enter full name"
                                            />
                                            {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => updateField("email", e.target.value)}
                                                className="h-11"
                                                placeholder="Enter email address"
                                            />
                                            {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => updateField("phoneNumber", e.target.value)}
                                            className="h-11"
                                            placeholder="Enter phone number"
                                        />
                                        {formErrors.phoneNumber && <p className="text-sm text-red-600">{formErrors.phoneNumber}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                                            Address
                                        </Label>
                                        <Textarea
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => updateField("address", e.target.value)}
                                            className="min-h-[100px]"
                                            placeholder="Enter full address"
                                        />
                                        {formErrors.address && <p className="text-sm text-red-600">{formErrors.address}</p>}
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            {editingUser ? "Update Subscriber" : "Add Subscriber"}
                                        </Button>
                                    </div>
                                </form>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="hover-lift">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                                    <p className="text-3xl font-bold text-slate-700">{stats.total}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                                    <p className="text-3xl font-bold text-emerald-600">{stats.active}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-emerald-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover-lift">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Trial Users</p>
                                    <p className="text-3xl font-bold text-amber-600">{stats.trial}</p>
                                </div>
                                <Clock className="w-8 h-8 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search subscribers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>
                </div>

                {/* Subscribers List */}
                <div className="space-y-4">
                    {filteredUsers.length === 0 ? (
                        <Card>
                            <CardContent className="text-center py-16">
                                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2 font-heading">
                                    {searchQuery ? "No subscribers found" : "No subscribers yet"}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchQuery ? "Try adjusting your search terms" : "Start building your subscriber base today"}
                                </p>
                                {!searchQuery && (
                                    <Button onClick={handleNewUser} className="bg-blue-600 hover:bg-blue-700 text-white hover-lift">
                                        <Plus className="w-4 h-4 mr-2" /> Add Your First Subscriber
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        filteredUsers.map((user: any) => (
                            <Card key={user.id} className="hover-lift transition-all duration-200 hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <h3 className="text-lg font-semibold text-slate-700 font-heading">{user.name}</h3>
                                                <Badge className={`text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                    {user.active? "active": "unknown"}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                    <span>{user.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                    <span>{user.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2 md:col-span-2">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    <span>{user.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(user)}
                                                disabled={isLoading}
                                                className="hover:bg-blue-50 hover:border-blue-200"
                                            >
                                                <Edit className="w-4 h-4 mr-1" /> Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(user.id)}
                                                disabled={isLoading}
                                                className="hover:bg-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" /> Remove
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
