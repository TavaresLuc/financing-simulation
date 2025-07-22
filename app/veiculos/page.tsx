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
import { Button } from "@/components/ui/button"
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
      console.log("Submitting form data:", formData)

      const response = await fetch("/api/vehicle-simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao salvar simulação")
      }

      const result = await response.json()
      console.log("API response:", result)

      if (result.success && result.id) {
        setSimulationId(result.id)
        setCurrentStep(5) // Success step
        window.scrollTo(0, 0)
      } else {
        throw new Error("Resposta inválida da API")
      }
    } catch (error: any) {
      console.error("Error submitting simulation:", error)
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
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financiamento de Veículos</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Simule seu financiamento em poucos passos</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
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
