"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import api from "@/lib/axios"

export interface InventoryItem {
    id: number
    itemCode: string
    name: string
    quantity: number
    price: number
    supplier: string
}

interface InventoryFormProps {
    item?: InventoryItem | null
    onSuccess: () => void
    onCancel?: () => void
}

const createItem = async (item: Omit<InventoryItem, "id">) => {
    const response = await api.post("/api/inventory", item)
}

const updateItem = async (item: InventoryItem) => {
    const response = await api.put(`/api/inventory/${item.id}`, item)
}

export function InventoryForm({ item, onSuccess, onCancel }: InventoryFormProps) {
    const queryClient = useQueryClient()

    const [formData, setFormData] = useState({
        itemCode: "",
        name: "",
        quantity: 0,
        price: 0,
        supplier: "",
    })

    const createMutation = useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] })
            toast.success("Item created successfully")

            onSuccess()
            setFormData({
                itemCode: "",
                name: "",
                quantity: 0,
                price: 0,
                supplier: "",
            })
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    const updateMutation = useMutation({
        mutationFn: updateItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory"] })
            toast.success("Item updated successfully")
            onSuccess()
        },
        onError: (error: Error) => {
            toast.error(error.message)
        },
    })

    useEffect(() => {
        if (item) {
            setFormData({
                itemCode: item.itemCode,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                supplier: item.supplier,
            })
        } else {
            setFormData({
                itemCode: "",
                name: "",
                quantity: 0,
                price: 0,
                supplier: "",
            })
        }
    }, [item])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (item) {
            updateMutation.mutate({ ...formData, id: item.id })
        } else {
            createMutation.mutate(formData)
        }
    }

    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const isLoading = createMutation.isPending || updateMutation.isPending

    return (
        <form onSubmit={handleSubmit} className="space-y-4 px-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="itemCode">Item Code</Label>
                    <Input
                        id="itemCode"
                        value={formData.itemCode}
                        onChange={(e) => handleInputChange("itemCode", e.target.value)}
                        placeholder="Enter item code"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter item name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", Number.parseInt(e.target.value) || 0)}
                        placeholder="Enter quantity"
                        min="0"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter price"
                        min="0"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                        id="supplier"
                        value={formData.supplier}
                        onChange={(e) => handleInputChange("supplier", e.target.value)}
                        placeholder="Enter supplier name"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-4 justify-end">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
                    {isLoading ? "Saving..." : item ? "Update Item" : "Add Item"}
                </Button>
            </div>
        </form>
    )
}
