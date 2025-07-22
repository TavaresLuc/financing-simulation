"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StepIndicator } from "@/components/vehicle-financing/step-indicator"
import { PersonalDataForm } from "@/components/vehicle-financing/personal-data-form"
import { VehicleDataForm } from "@/components/vehicle-financing/vehicle-data-form"
import { SellerDataForm } from "@/components/vehicle-financing/seller-data-form"
import { FinancingOptionsForm } from "@/components/vehicle-financing/financing-options-form"
import { SuccessMessage } from "@/components/vehicle-financing/success-message"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VehicleFinancingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [simulationId, setSimulationId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    personalData: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
    },
    vehicleData: {
      vehicleType: "carro",
      knowsModel: false,
      cep: "",
      year: "",
      brand: "",
      model: "",
      vehicleValue: "",
    },
    sellerData: {
      timeline: "",
      sellerType: "",
    },
    financingData: {
      downPaymentPercentage: 20,
      loanTermMonths: 24,
    },
  })

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
    window.scrollTo(0, 0)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      console.log("=== Submitting Vehicle Financing Form ===")
      console.log("Form data:", JSON.stringify(formData, null, 2))

      const response = await fetch("/api/vehicle-simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", Object.fromEntries(response.headers.entries()))

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON response received:", textResponse)
        throw new Error("Servidor retornou resposta inválida. Tente novamente.")
      }

      let result
      try {
        result = await response.json()
        console.log("Parsed JSON response:", result)
      } catch (jsonError) {
        console.error("JSON parsing failed:", jsonError)
        throw new Error("Erro ao processar resposta do servidor")
      }

      if (!response.ok) {
        throw new Error(result.error || `Erro HTTP ${response.status}`)
      }

      if (result.success && result.id) {
        console.log("Simulation created successfully with ID:", result.id)
        setSimulationId(result.id)
        setCurrentStep(5) // Success step
        window.scrollTo(0, 0)
      } else {
        console.error("Invalid API response:", result)
        throw new Error("Resposta inválida da API")
      }
    } catch (error: any) {
      console.error("=== Error submitting simulation ===")
      console.error("Error:", error)
      alert(`Erro ao finalizar simulação: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewResults = () => {
    if (simulationId) {
      router.push(`/veiculos/resultados/${simulationId}`)
    }
  }

  const handleNewSimulation = () => {
    setCurrentStep(1)
    setSimulationId(null)
    setFormData({
      personalData: {
        name: "",
        email: "",
        phone: "",
        cpf: "",
      },
      vehicleData: {
        vehicleType: "carro",
        knowsModel: false,
        cep: "",
        year: "",
        brand: "",
        model: "",
        vehicleValue: "",
      },
      sellerData: {
        timeline: "",
        sellerType: "",
      },
      financingData: {
        downPaymentPercentage: 20,
        loanTermMonths: 24,
      },
    })
    window.scrollTo(0, 0)
  }

  const stepLabels = ["Dados Pessoais", "Dados do Veículo", "Dados do Vendedor", "Financiamento"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed Header - removed sticky positioning to prevent overlap */}
      <header className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-4">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Voltar</span>
            </Link>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kiwify Crédito
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content with proper top padding */}
      <main className="container mx-auto px-4 py-8">
        {currentStep <= 4 && <StepIndicator currentStep={currentStep} totalSteps={4} labels={stepLabels} />}

        <div className="mt-8">
          {currentStep === 1 && (
            <PersonalDataForm
              data={formData.personalData}
              onUpdate={(data) => updateFormData("personalData", data)}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <VehicleDataForm
              data={formData.vehicleData}
              onUpdate={(data) => updateFormData("vehicleData", data)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <SellerDataForm
              data={formData.sellerData}
              onUpdate={(data) => updateFormData("sellerData", data)}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <FinancingOptionsForm
              vehicleValue={formData.vehicleData.vehicleValue}
              data={formData.financingData}
              onUpdate={(data) => updateFormData("financingData", data)}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 5 && simulationId && (
            <SuccessMessage
              simulationId={simulationId}
              onViewResults={handleViewResults}
              onNewSimulation={handleNewSimulation}
            />
          )}
        </div>
      </main>
    </div>
  )
}
