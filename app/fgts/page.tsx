"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, FileText, CreditCard, Smartphone, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface FormData {
  nome_completo: string
  cpf: string
  rg: string
  telefone: string
}

interface FormErrors {
  nome_completo?: string
  cpf?: string
  rg?: string
  telefone?: string
}

export default function FGTSPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    nome_completo: "",
    cpf: "",
    rg: "",
    telefone: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Função para formatar CPF
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return value
  }

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
      } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      }
    }
    return value
  }

  // Validação em tempo real
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "nome_completo":
        const nomePartes = value.trim().split(" ")
        if (!value.trim()) {
          newErrors.nome_completo = "Nome completo é obrigatório"
        } else if (nomePartes.length < 2) {
          newErrors.nome_completo = "Digite nome e sobrenome"
        } else if (value.length < 5) {
          newErrors.nome_completo = "Nome deve ter pelo menos 5 caracteres"
        } else {
          delete newErrors.nome_completo
        }
        break

      case "cpf":
        const cpfNumbers = value.replace(/\D/g, "")
        if (!value) {
          newErrors.cpf = "CPF é obrigatório"
        } else if (cpfNumbers.length !== 11) {
          newErrors.cpf = "CPF deve ter 11 dígitos"
        } else {
          delete newErrors.cpf
        }
        break

      case "rg":
        if (!value.trim()) {
          newErrors.rg = "RG é obrigatório"
        } else if (value.trim().length < 5) {
          newErrors.rg = "RG deve ter pelo menos 5 caracteres"
        } else {
          delete newErrors.rg
        }
        break

      case "telefone":
        const telefoneNumbers = value.replace(/\D/g, "")
        if (!value) {
          newErrors.telefone = "Telefone é obrigatório"
        } else if (telefoneNumbers.length < 10 || telefoneNumbers.length > 11) {
          newErrors.telefone = "Telefone deve ter 10 ou 11 dígitos"
        } else {
          delete newErrors.telefone
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Aplicar formatação
    if (name === "cpf") {
      formattedValue = formatCPF(value)
    } else if (name === "telefone") {
      formattedValue = formatTelefone(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    // Validar campo
    validateField(name, formattedValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos os campos
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key as keyof FormData])
    })

    // Verificar se há erros
    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/fgts-simulations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitSuccess(true)
        setFormData({
          nome_completo: "",
          cpf: "",
          rg: "",
          telefone: "",
        })
      } else {
        setSubmitError(result.error || "Erro ao enviar solicitação")
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      setSubmitError("Erro de conexão. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                Solicitação Enviada com Sucesso!
              </CardTitle>
              <CardDescription className="text-lg">
                Sua solicitação de antecipação FGTS foi recebida e será processada em breve.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Próximos passos:</strong>
                  <br />
                  1. Nossa equipe entrará em contato em até 24 horas
                  <br />
                  2. Você receberá instruções detalhadas por WhatsApp
                  <br />
                  3. Siga o guia abaixo para preparar sua documentação
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button onClick={() => setSubmitSuccess(false)} variant="outline" className="flex-1">
                  Nova Solicitação
                </Button>
                <Button onClick={() => router.push("/")} className="flex-1">
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Antecipação FGTS</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Antecipe seu FGTS de forma rápida e segura. Preencha seus dados e receba orientações personalizadas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Seus Dados
              </CardTitle>
              <CardDescription>Preencha suas informações para solicitar a antecipação</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome Completo</Label>
                  <Input
                    id="nome_completo"
                    name="nome_completo"
                    type="text"
                    value={formData.nome_completo}
                    onChange={handleInputChange}
                    placeholder="Digite seu nome completo"
                    className={errors.nome_completo ? "border-red-500" : ""}
                  />
                  {errors.nome_completo && <p className="text-sm text-red-500">{errors.nome_completo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className={errors.cpf ? "border-red-500" : ""}
                  />
                  {errors.cpf && <p className="text-sm text-red-500">{errors.cpf}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    name="rg"
                    type="text"
                    value={formData.rg}
                    onChange={handleInputChange}
                    placeholder="Digite seu RG"
                    className={errors.rg ? "border-red-500" : ""}
                  />
                  {errors.rg && <p className="text-sm text-red-500">{errors.rg}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="text"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className={errors.telefone ? "border-red-500" : ""}
                  />
                  {errors.telefone && <p className="text-sm text-red-500">{errors.telefone}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Solicitar Antecipação"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Guia do Processo */}
          <div className="space-y-6">
            {/* Vantagens */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Vantagens da Antecipação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Dinheiro Rápido</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receba o valor em até 24 horas após aprovação
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Sem Consulta ao SPC/Serasa</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aprovação baseada no seu saldo FGTS</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Taxas Competitivas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Melhores condições do mercado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">100% Digital</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Todo processo pelo celular</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guia do App Caixa */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Guia do App Caixa FGTS
                </CardTitle>
                <CardDescription>Siga estes passos no aplicativo oficial da Caixa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      1
                    </Badge>
                    <div>
                      <p className="font-medium">Baixe o App FGTS</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Disponível na App Store e Google Play</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      2
                    </Badge>
                    <div>
                      <p className="font-medium">Faça seu Login</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Use seu CPF e senha do Gov.br</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      3
                    </Badge>
                    <div>
                      <p className="font-medium">Ative o Saque-Aniversário</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Vá em "Saque-Aniversário" → "Aderir"</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      4
                    </Badge>
                    <div>
                      <p className="font-medium">Autorize a Antecipação</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Selecione "Antecipação do Saque-Aniversário"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      5
                    </Badge>
                    <div>
                      <p className="font-medium">Escolha a Instituição</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Selecione nossa empresa na lista</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Badge
                      variant="outline"
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      6
                    </Badge>
                    <div>
                      <p className="font-medium">Confirme a Operação</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Revise os dados e confirme</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Ao aderir ao saque-aniversário, você não poderá sacar o FGTS em caso de
                    demissão sem justa causa. Apenas a multa de 40% ficará disponível.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
