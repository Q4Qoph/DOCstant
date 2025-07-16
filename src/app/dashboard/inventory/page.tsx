"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import { InventoryForm } from "./(components)/InventoryForm"
import InventoryList from "./(components)/InventoryList"
import api from "@/lib/axios"

export interface InventoryItem {
  id: number
  itemCode: string
  name: string
  genericName: string
  brand: string
  presentation: string
  expiryDate: string
  quantity: number
  price: number
  supplier: string
}

const fetchInventory = async () => {
  const response = await api.get("/api/inventory")
  return response.data

}

export default function InventoryPage() {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  })

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setIsSheetOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsSheetOpen(true)
  }

  const handleSheetClose = () => {
    setIsSheetOpen(false)
    setEditingItem(null)
  }

  const handleFormSuccess = () => {
    handleSheetClose()
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your inventory items efficiently</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2 bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[900px] w-full">
            <SheetHeader>
              <SheetTitle>{editingItem ? "Edit Item" : "Add New Item"}</SheetTitle>
              <SheetDescription>
                {editingItem ? "Update the item details below" : "Fill in the details to add a new inventory item"}
              </SheetDescription>
            </SheetHeader>
            <div className="">
              <InventoryForm item={editingItem} onSuccess={handleFormSuccess} onCancel={handleSheetClose} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Items ({items.length})</CardTitle>
          <CardDescription>View and manage all inventory items</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryList items={items} loading={isLoading} onEdit={handleEdit} />
        </CardContent>
      </Card>
    </div>
  )
}
