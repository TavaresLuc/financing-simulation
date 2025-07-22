"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle } from "lucide-react"

interface VehicleDataFormProps {
  data: {
    vehicleType: string
    knowsModel: boolean
    cep: string
    year: string
    brand: string
    model: string
    vehicleValue: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function VehicleDataForm({ data, onUpdate, onNext, onBack }: VehicleDataFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Formatação para CEP: 00000-000
    if (name === "cep") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1")
    }

    // Formatação para valor do veículo: R$ 00.000,00
    if (name === "vehicleValue") {
      formattedValue = formatCurrency(value)
    }

    onUpdate({ ...data, [name]: formattedValue })
  }

  const formatCurrency = (value: string): string => {
    value = value.replace(/\D/g, "")

    if (value === "") return ""

    const valueAsNumber = Number.parseInt(value) / 100
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valueAsNumber)
  }

  const handleRadioChange = (name: string, value: string) => {
    if (name === "vehicleType") {
      onUpdate({ ...data, vehicleType: value })
    } else if (name === "knowsModel") {
      onUpdate({ ...data, knowsModel: value === "true" })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.vehicleType) {
      newErrors.vehicleType = "Selecione o tipo de veículo"
    }

    if (data.cep && data.cep.replace(/\D/g, "").length !== 8) {
      newErrors.cep = "CEP inválido"
    }

    if (data.knowsModel) {
      if (!data.year) {
        newErrors.year = "Ano é obrigatório"
      } else if (!/^\d{4}$/.test(data.year)) {
        newErrors.year = "Ano inválido"
      }

      if (!data.brand) {
        newErrors.brand = "Marca é obrigatória"
      }

      if (!data.model) {
        newErrors.model = "Modelo é obrigatório"
      }
    } else {
      if (!data.year) {
        newErrors.year = "Ano é obrigatório"
      } else if (!/^\d{4}$/.test(data.year)) {
        newErrors.year = "Ano inválido"
      }
    }

    if (!data.vehicleValue) {
      newErrors.vehicleValue = "Valor do veículo é obrigatório"
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
        <CardTitle>Dados do Veículo</CardTitle>
        <CardDescription>Informe os detalhes do veículo que você deseja financiar</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>
              Qual é o tipo de veículo que será financiado? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={data.vehicleType}
              onValueChange={(value) => handleRadioChange("vehicleType", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="carro" id="carro" />
                <Label htmlFor="carro">Carro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moto" id="moto" />
                <Label htmlFor="moto">Moto</Label>
              </div>
            </RadioGroup>
            {errors.vehicleType && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.vehicleType}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label>
              Já sabe qual o modelo do veículo que você quer financiar? <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={data.knowsModel ? "true" : "false"}
              onValueChange={(value) => handleRadioChange("knowsModel", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="knows-yes" />
                <Label htmlFor="knows-yes">Sim, já sei o modelo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="knows-no" />
                <Label htmlFor="knows-no">Ainda não sei</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              name="cep"
              value={data.cep}
              onChange={handleChange}
              placeholder="00000-000"
              className={errors.cep ? "border-red-500" : ""}
              maxLength={9}
              inputMode="numeric"
            />
            {errors.cep && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.cep}
              </p>
            )}
          </div>

          {data.knowsModel ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">
                    Ano do modelo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="year"
                    name="year"
                    value={data.year}
                    onChange={handleChange}
                    placeholder="2023"
                    className={errors.year ? "border-red-500" : ""}
                    maxLength={4}
                  />
                  {errors.year && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.year}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">
                    Marca <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={data.brand}
                    onChange={handleChange}
                    placeholder="Ex: Toyota"
                    className={errors.brand ? "border-red-500" : ""}
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.brand}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">
                  Modelo <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="model"
                  name="model"
                  value={data.model}
                  onChange={handleChange}
                  placeholder="Ex: Corolla"
                  className={errors.model ? "border-red-500" : ""}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.model}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="year">
                Ano do modelo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="year"
                name="year"
                value={data.year}
                onChange={handleChange}
                placeholder="2023"
                className={errors.year ? "border-red-500" : ""}
                maxLength={4}
              />
              {errors.year && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.year}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="vehicleValue">
              Valor do veículo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vehicleValue"
              name="vehicleValue"
              value={data.vehicleValue}
              onChange={handleChange}
              placeholder="R$ 0,00"
              className={errors.vehicleValue ? "border-red-500" : ""}
            />
            {errors.vehicleValue && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.vehicleValue}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">Próximo</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
