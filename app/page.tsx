"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/currency-input"
import { ThemeToggle } from "@/components/theme-toggle"
import { calculateMortgage } from "@/lib/mortgage-calculator"
import { maskCPF, maskPhone, validateCPF, validateEmail, formatCurrency } from "@/lib/formatters"
import { Calculator, Home, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
// Add this import for testing
import { CurrencyTest } from "@/components/currency-test"
import { DebugPanel } from "@/components/debug-panel"

interface FormData {
  propertyValue: number
  downPaymentPercentage: number
  loanTermYears: number
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCPF: string
}

interface FormErrors {
  [key: string]: string
}

export default function HomePage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    propertyValue: 0,
    downPaymentPercentage: 20,
    loanTermYears: 30,
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientCPF: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showTest, setShowTest] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (formData.propertyValue <= 0) {
      newErrors.propertyValue = "Valor do imóvel é obrigatório e deve ser maior que zero"
    }

    if (formData.propertyValue > 100000000) {
      newErrors.propertyValue = "Valor do imóvel não pode exceder R$ 100.000.000"
    }

    if (formData.downPaymentPercentage < 20) {
      newErrors.downPaymentPercentage = "Entrada mínima de 20%"
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Nome é obrigatório"
    }

    if (!validateEmail(formData.clientEmail)) {
      newErrors.clientEmail = "Email inválido"
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = "Telefone é obrigatório"
    }

    if (!validateCPF(formData.clientCPF)) {
      newErrors.clientCPF = "CPF inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Validate numeric inputs before calculation
      if (!formData.propertyValue || formData.propertyValue <= 0) {
        throw new Error("Valor do imóvel deve ser maior que zero")
      }

      if (!formData.downPaymentPercentage || formData.downPaymentPercentage < 20) {
        throw new Error("Entrada deve ser no mínimo 20%")
      }

      if (!formData.loanTermYears || formData.loanTermYears <= 0) {
        throw new Error("Prazo deve ser maior que zero")
      }

      console.log("Calculating mortgage with:", {
        propertyValue: formData.propertyValue,
        downPaymentPercentage: formData.downPaymentPercentage,
        loanTermYears: formData.loanTermYears,
      })

      const calculation = calculateMortgage(
        formData.propertyValue,
        formData.downPaymentPercentage,
        formData.loanTermYears,
      )

      console.log("Calculation result:", calculation)

      // Validate calculation results
      if (!calculation.monthlyPayment || isNaN(calculation.monthlyPayment)) {
        throw new Error("Erro no cálculo da parcela mensal")
      }

      if (!calculation.totalPayment || isNaN(calculation.totalPayment)) {
        throw new Error("Erro no cálculo do valor total")
      }

      const simulationData = {
        propertyValue: formData.propertyValue,
        downPaymentPercentage: formData.downPaymentPercentage,
        downPaymentAmount: calculation.downPaymentAmount,
        loanAmount: calculation.loanAmount,
        loanTermYears: formData.loanTermYears,
        interest_rate: 12,
        monthlyPayment: calculation.monthlyPayment,
        totalPayment: calculation.totalPayment,
        totalInterest: calculation.totalInterest,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientCPF: formData.clientCPF,
      }

      console.log("Sending simulation data:", simulationData)

      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(simulationData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/results/${result.id}`)
      } else {
        const errorData = await response.text()
        console.error("Server error:", errorData)
        throw new Error("Erro ao salvar simulação")
      }
    } catch (error) {
      console.error("Erro:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar simulação. Tente novamente."
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate preview values for display
  const downPaymentAmount = (formData.propertyValue * formData.downPaymentPercentage) / 100
  const loanAmount = formData.propertyValue - downPaymentAmount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-500 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl shadow-lg transition-colors">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Simulador de Financiamento
              </h1>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">Simule seu financiamento imobiliário</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Test Component - Only in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6">
            <Button onClick={() => setShowTest(!showTest)} variant="outline" size="sm" className="mb-4">
              {showTest ? "Ocultar" : "Mostrar"} Teste de Valores
            </Button>
            {showTest && <CurrencyTest />}
          </div>
        )}

        {/* Main Form */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg transition-all duration-300">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full w-fit mb-4 transition-colors">
              <Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Simulação de Financiamento</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Preencha os dados abaixo para calcular suas parcelas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Value */}
              <div className="space-y-2">
                <Label htmlFor="propertyValue">Valor do Imóvel *</Label>
                <CurrencyInput
                  id="propertyValue"
                  value={formData.propertyValue}
                  onChange={(value) => setFormData((prev) => ({ ...prev, propertyValue: value }))}
                  className={errors.propertyValue ? "border-red-500" : ""}
                />
                {errors.propertyValue && <p className="text-sm text-red-500">{errors.propertyValue}</p>}
                {formData.propertyValue > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor informado: {formatCurrency(formData.propertyValue)}
                  </p>
                )}
              </div>

              {/* Down Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downPayment">Entrada (%)</Label>
                  <Select
                    value={formData.downPaymentPercentage.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        downPaymentPercentage: Number.parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className={errors.downPaymentPercentage ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20% (Mínimo)</SelectItem>
                      <SelectItem value="30">30%</SelectItem>
                      <SelectItem value="40">40%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.downPaymentPercentage && (
                    <p className="text-sm text-red-500">{errors.downPaymentPercentage}</p>
                  )}
                  {formData.propertyValue > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Entrada: {formatCurrency(downPaymentAmount)}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Prazo (anos)</Label>
                  <Select
                    value={formData.loanTermYears.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        loanTermYears: Number.parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 anos</SelectItem>
                      <SelectItem value="20">20 anos</SelectItem>
                      <SelectItem value="25">25 anos</SelectItem>
                      <SelectItem value="30">30 anos</SelectItem>
                      <SelectItem value="35">35 anos</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.propertyValue > 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">Financiado: {formatCurrency(loanAmount)}</p>
                  )}
                </div>
              </div>

              {/* Client Information */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nome Completo *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, clientName: e.target.value }))}
                      className={errors.clientName ? "border-red-500" : ""}
                      placeholder="Digite seu nome completo"
                    />
                    {errors.clientName && <p className="text-sm text-red-500">{errors.clientName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData((prev) => ({ ...prev, clientEmail: e.target.value }))}
                        className={errors.clientEmail ? "border-red-500" : ""}
                        placeholder="seu@email.com"
                      />
                      {errors.clientEmail && <p className="text-sm text-red-500">{errors.clientEmail}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Telefone *</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            clientPhone: maskPhone(e.target.value),
                          }))
                        }
                        className={errors.clientPhone ? "border-red-500" : ""}
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                      />
                      {errors.clientPhone && <p className="text-sm text-red-500">{errors.clientPhone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientCPF">CPF *</Label>
                    <Input
                      id="clientCPF"
                      value={formData.clientCPF}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientCPF: maskCPF(e.target.value),
                        }))
                      }
                      className={errors.clientCPF ? "border-red-500" : ""}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                    {errors.clientCPF && <p className="text-sm text-red-500">{errors.clientCPF}</p>}
                  </div>
                </div>
              </div>

              {/* Interest Rate Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Taxa de Juros:</strong> 12% ao ano (1% ao mês)
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Calculando..." : "Simular Financiamento"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Add debug panel in development */}
      {process.env.NODE_ENV === "development" && <DebugPanel />}
    </div>
  )
}
