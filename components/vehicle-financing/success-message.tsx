"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface SuccessMessageProps {
  simulationId: number
  onViewResults?: () => void
  onNewSimulation?: () => void
}

export function SuccessMessage({ simulationId, onViewResults, onNewSimulation }: SuccessMessageProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Simulação Concluída com Sucesso!</CardTitle>
        <CardDescription>
          Sua simulação de financiamento de veículo foi registrada com o número #{simulationId}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
          <p className="text-green-700 dark:text-green-300">
            Recebemos sua solicitação e entraremos em contato em breve para discutir as opções de financiamento
            disponíveis para você.
          </p>
        </div>

        <div className="text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400">
            Um de nossos consultores analisará sua simulação e entrará em contato através do telefone ou email
            informado.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Você também pode visualizar os detalhes da sua simulação a qualquer momento.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
        {onViewResults && (
          <Button onClick={onViewResults} className="w-full sm:w-auto">
            Ver Detalhes da Simulação
          </Button>
        )}

        {onNewSimulation && (
          <Button variant="outline" onClick={onNewSimulation} className="w-full sm:w-auto bg-transparent">
            Fazer Nova Simulação
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
