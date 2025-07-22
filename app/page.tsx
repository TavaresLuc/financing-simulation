"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Home,
  Car,
  Banknote,
  ArrowRight,
  Shield,
  Clock,
  Calculator,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const creditOptions = [
    {
      id: "real-estate",
      title: "Financiamento Imobiliário",
      description: "Realize o sonho da casa própria com as melhores condições do mercado",
      icon: Home,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      href: "/simulation",
      available: true,
      features: ["Até 35 anos para pagar", "Taxa a partir de 8,99% a.a.", "Financie até 90% do imóvel"],
    },
    {
      id: "vehicle",
      title: "Financiamento de Veículos",
      description: "Conquiste seu veículo novo ou usado com facilidade e agilidade",
      icon: Car,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300",
      href: "/veiculos",
      available: true,
      features: ["Carros, motos e caminhões", "Aprovação em até 24h", "Taxa a partir de 1,29% a.m."],
    },
    {
      id: "fgts",
      title: "Antecipação Rápida de FGTS",
      description: "Antecipe seu FGTS e tenha dinheiro na conta rapidamente",
      icon: Banknote,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-700 dark:text-orange-300",
      href: "/fgts",
      available: true,
      features: ["Processo 100% digital", "Dinheiro em até 5 dias", "Sem consulta ao SPC/Serasa"],
    },
  ]
// Stats
  const stats = [
    { label: "Clientes Atendidos", value: "50.000+", icon: Users },
    { label: "Crédito Liberado", value: "R$ 2,5 bi", icon: TrendingUp },
    { label: "Taxa de Aprovação", value: "94%", icon: CheckCircle },
    { label: "Avaliação Média", value: "4.8/5", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kiwify Crédito</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Soluções financeiras para empreendedores</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                  Admin
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Crédito Inteligente para
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {" "}
                Empreendedores
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Plataforma completa de soluções de crédito pensada especialmente para empreendedores digitais que buscam
              crescimento e oportunidades.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg mb-2">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credit Options */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nossas Soluções de Crédito</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Escolha a modalidade de crédito que melhor se adapta às suas necessidades e objetivos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {creditOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <Card
                  key={option.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${option.borderColor} ${
                    hoveredCard === option.id ? "scale-105" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(option.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5`} />

                  <CardHeader className="relative">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 ${option.bgColor} rounded-2xl mb-4`}
                    >
                      <IconComponent className={`h-8 w-8 ${option.textColor}`} />
                    </div>

                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-900 dark:text-white">{option.title}</CardTitle>
                      {option.available && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        >
                          Disponível
                        </Badge>
                      )}
                    </div>

                    <CardDescription className="text-gray-600 dark:text-gray-300">{option.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="relative space-y-4">
                    <div className="space-y-2">
                      {option.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href={option.href} className="block">
                      <Button
                        className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 transition-opacity`}
                        size="lg"
                      >
                        {option.id === "fgts" ? "Simular Agora" : "Simular Agora"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Por que escolher a Kiwify Crédito?
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">100% Seguro</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Plataforma com certificação de segurança e proteção total dos seus dados.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Aprovação Rápida</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Análise automatizada e resposta em até 24 horas para sua solicitação.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl mb-4">
                <Calculator className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Simulação Gratuita</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Simule quantas vezes quiser sem compromisso e encontre a melhor opção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold">Kiwify Crédito</h4>
                <p className="text-sm text-gray-400">Soluções financeiras inteligentes</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">Transformando a forma como empreendedores acessam crédito no Brasil.</p>
            <p className="text-sm text-gray-500">© 2024 Kiwify Crédito. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
