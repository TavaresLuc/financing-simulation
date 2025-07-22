"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SellerDataFormProps {
  data: {
    timeline: string
    sellerType: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function SellerDataForm({ data, onUpdate, onNext, onBack }: SellerDataFormProps) {
  const handleTimelineChange = (value: string) => {
    onUpdate({ ...data, timeline: value })
  }

  const handleSellerTypeChange = (value: string) => {
    onUpdate({ ...data, sellerType: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Dados do Vendedor</CardTitle>
        <CardDescription>Informe detalhes sobre o vendedor e seu planejamento de compra</CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label className="text-base">
              Em quanto tempo você pretende fechar negócio? <span className="text-gray-500">(opcional)</span>
            </Label>
            <RadioGroup value={data.timeline} onValueChange={handleTimelineChange} className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rapido" id="timeline-1" />
                <Label htmlFor="timeline-1">O mais rápido possível (1 semana)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="breve" id="timeline-2" />
                <Label htmlFor="timeline-2">Em breve (1 mês)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="este_ano" id="timeline-3" />
                <Label htmlFor="timeline-3">Ainda este ano (6 meses)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pesquisando" id="timeline-4" />
                <Label htmlFor="timeline-4">Estou apenas pesquisando</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-base">
              Já sabe de quem você pretende comprar seu veículo? <span className="text-gray-500">(opcional)</span>
            </Label>
            <RadioGroup
              value={data.sellerType}
              onValueChange={handleSellerTypeChange}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concessionaria" id="seller-1" />
                <Label htmlFor="seller-1">Em uma loja concessionária</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="particular" id="seller-2" />
                <Label htmlFor="seller-2">Direto com o Dono(a)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao_sei" id="seller-3" />
                <Label htmlFor="seller-3">Ainda não sei</Label>
              </div>
            </RadioGroup>
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
