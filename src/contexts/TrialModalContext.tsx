"use client"

import { setTrialExpiredModalTrigger } from "@/lib/axios"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface TrialModalContextType {
    isModalOpen: boolean
    openModal: () => void
    closeModal: () => void
}

const TrialModalContext = createContext<TrialModalContextType | undefined>(undefined)

export function TrialModalProvider({ children }: { children: React.ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    // Register the modal trigger with the API interceptor
    useEffect(() => {
        setTrialExpiredModalTrigger(openModal)

        const handleShowPaymentModal = () => {
            openModal()
        }

        window.addEventListener("show-payment-modal", handleShowPaymentModal)

        return () => {
            window.removeEventListener("show-payment-modal", handleShowPaymentModal)
        }
    }, [])

    return (
        <TrialModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>{children}</TrialModalContext.Provider>
    )
}

export function useTrialModal() {
    const context = useContext(TrialModalContext)
    if (context === undefined) {
        throw new Error("useTrialModal must be used within a TrialModalProvider")
    }
    return context
}
