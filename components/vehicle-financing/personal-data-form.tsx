"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface PersonalDataFormProps {
  data: {
    name: string
    email: string
    phone: string
    cpf: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
}

export function PersonalDataForm({ data, onUpdate, onNext }: PersonalDataFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Formatação para CPF: 000.000.000-00
    if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1")
    }

    // Formatação para telefone: (00) 00000-0000
    if (name === "phone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1")
    }

    const updatedData = { ...data, [name]: formattedValue }
    onUpdate(updatedData)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.name) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!data.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email inválido"
    }

    if (!data.phone) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (data.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Telefone inválido"
    }

    if (!data.cpf) {
      newErrors.cpf = "CPF é obrigatório"
    } else if (data.cpf.replace(/\D/g, "").length !== 11) {
      newErrors.cpf = "CPF inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onNext()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dados Pessoais</CardTitle>
        <CardDescription>Preencha seus dados pessoais para iniciar a simulação de financiamento</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Telefone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
              className={errors.phone ? "border-red-500" : ""}
              inputMode="numeric"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">
              CPF <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cpf"
              name="cpf"
              value={data.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className={errors.cpf ? "border-red-500" : ""}
              maxLength={14}
              inputMode="numeric"
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.cpf}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit">Próximo</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
