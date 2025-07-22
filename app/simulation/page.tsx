"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateMortgage } from "@/lib/mortgage-calculator"
import { formatCurrency, formatCPF, formatPhone } from "@/lib/formatters"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SimulationPage() {
  const router = useRouter()
  const [propertyValue, setPropertyValue] = useState(500000)
  const [downPaymentPercentage, setDownPaymentPercentage] = useState(20)
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [interestRate, setInterestRate] = useState(12)
  const [calculation, setCalculation] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    downPaymentAmount: 0,
    loanAmount: 0,
  })
  const [propertyValueInput, setPropertyValueInput] = useState(formatCurrency(propertyValue))
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientCPF, setClientCPF] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    try {
      const result = calculateMortgage(propertyValue, downPaymentPercentage, loanTermYears, interestRate)
      setCalculation(result)
    } catch (error: any) {
      console.error("Calculation error:", error.message)
    }
  }, [propertyValue, downPaymentPercentage, loanTermYears, interestRate])

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "")

    // Convert to number (in cents)
    const valueInCents = Number.parseInt(numericValue)

    if (!isNaN(valueInCents)) {
      // Convert cents to real value
      const realValue = valueInCents / 100

      // Update the formatted display value
      setPropertyValueInput(formatCurrency(realValue))

      // Update the actual numeric value
      setPropertyValue(realValue)
    } else {
      setPropertyValueInput("")
      setPropertyValue(0)
    }
  }

  const handleDownPaymentChange = (value: number[]) => {
    setDownPaymentPercentage(value[0])
  }

  const handleLoanTermChange = (value: number[]) => {
    setLoanTermYears(value[0])
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setClientCPF(formatted)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setClientPhone(formatted)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!clientName.trim()) {
      newErrors.clientName = "Nome é obrigatório"
    }

    if (!clientEmail.trim()) {
      newErrors.clientEmail = "Email é obrigatório"
    } else if (!/^\S+@\S+\.\S+$/.test(clientEmail)) {
      newErrors.clientEmail = "Email inválido"
    }

    if (!clientPhone.trim()) {
      newErrors.clientPhone = "Telefone é obrigatório"
    }

    if (!clientCPF.trim()) {
      newErrors.clientCPF = "CPF é obrigatório"
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(clientCPF)) {
      newErrors.clientCPF = "CPF deve estar no formato 000.000.000-00"
    }

    if (propertyValue <= 0) {
      newErrors.propertyValue = "Valor do imóvel deve ser maior que zero"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property_value: propertyValue,
          down_payment_percentage: downPaymentPercentage,
          down_payment_amount: calculation.downPaymentAmount,
          loan_amount: calculation.loanAmount,
          loan_term_years: loanTermYears,
          interest_rate: interestRate,
          monthly_payment: calculation.monthlyPayment,
          total_payment: calculation.totalPayment,
          total_interest: calculation.totalInterest,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          client_cpf: clientCPF,
        }),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/results/${result.id}`)
      } else {
        alert(`Erro: ${result.message}`)
        setIsSubmitting(false)
      }
    } catch (error: any) {
      console.error("Error submitting form:", error)
      alert(`Erro ao enviar formulário: ${error.message}`)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
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

      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Simulação de Financiamento Imobiliário</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Simulação</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="propertyValue">Valor do Imóvel</Label>
                      <Input
                        id="propertyValue"
                        value={propertyValueInput}
                        onChange={handlePropertyValueChange}
                        className={errors.propertyValue ? "border-red-500" : ""}
                      />
                      {errors.propertyValue && <p className="text-red-500 text-sm mt-1">{errors.propertyValue}</p>}
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <Label>Entrada ({downPaymentPercentage}%)</Label>
                        <span className="text-sm font-medium">{formatCurrency(calculation.downPaymentAmount)}</span>
                      </div>
                      <Slider
                        value={[downPaymentPercentage]}
                        min={10}
                        max={90}
                        step={5}
                        onValueChange={handleDownPaymentChange}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>10%</span>
                        <span>90%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <Label>Prazo ({loanTermYears} anos)</Label>
                        <span className="text-sm font-medium">{loanTermYears * 12} meses</span>
                      </div>
                      <Slider
                        value={[loanTermYears]}
                        min={5}
                        max={35}
                        step={5}
                        onValueChange={handleLoanTermChange}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>5 anos</span>
                        <span>35 anos</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4">Dados Pessoais</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Nome Completo</Label>
                        <Input
                          id="clientName"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className={errors.clientName ? "border-red-500" : ""}
                        />
                        {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                      </div>

                      <div>
                        <Label htmlFor="clientEmail">Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className={errors.clientEmail ? "border-red-500" : ""}
                        />
                        {errors.clientEmail && <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="clientPhone">Telefone</Label>
                          <Input
                            id="clientPhone"
                            value={clientPhone}
                            onChange={handlePhoneChange}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            className={errors.clientPhone ? "border-red-500" : ""}
                            inputMode="numeric"
                          />
                          {errors.clientPhone && <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>}
                        </div>

                        <div>
                          <Label htmlFor="clientCPF">CPF</Label>
                          <Input
                            id="clientCPF"
                            value={clientCPF}
                            onChange={handleCPFChange}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            className={errors.clientCPF ? "border-red-500" : ""}
                            inputMode="numeric"
                          />
                          {errors.clientCPF && <p className="text-red-500 text-sm mt-1">{errors.clientCPF}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                      {isSubmitting ? "Processando..." : "Simular Financiamento"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Simulação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor do Imóvel</p>
                    <p className="text-lg font-semibold">{formatCurrency(propertyValue)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor da Entrada</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculation.downPaymentAmount)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Valor Financiado</p>
                    <p className="text-lg font-semibold">{formatCurrency(calculation.loanAmount)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Prazo</p>
                    <p className="text-lg font-semibold">
                      {loanTermYears} anos ({loanTermYears * 12} meses)
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Juros</p>
                    <p className="text-lg font-semibold">{interestRate}% ao ano</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Parcela Mensal</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(calculation.monthlyPayment)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total de Juros</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(calculation.totalInterest)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total a Pagar</p>
                      <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                        {formatCurrency(calculation.totalPayment)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
