"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyInput } from "@/components/currency-input"
import { formatCurrency, parseCurrency, maskCurrency } from "@/lib/formatters"

export function CurrencyTest() {
  const [testValue, setTestValue] = useState(0)
  const [testResults, setTestResults] = useState<any[]>([])

  const runTests = () => {
    const testCases = [
      { input: "500000", expected: 500000, description: "R$ 500.000" },
      { input: "1000000", expected: 1000000, description: "R$ 1.000.000" },
      { input: "2500000", expected: 2500000, description: "R$ 2.500.000" },
      { input: "10000000", expected: 10000000, description: "R$ 10.000.000" },
      { input: "50000000", expected: 50000000, description: "R$ 50.000.000" },
    ]

    const results = testCases.map((testCase) => {
      const masked = maskCurrency(testCase.input)
      const parsed = parseCurrency(masked)
      const formatted = formatCurrency(parsed)

      return {
        ...testCase,
        masked,
        parsed,
        formatted,
        success: parsed === testCase.expected,
      }
    })

    setTestResults(results)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Teste de Entrada de Valores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Teste o campo de valor:</label>
          <CurrencyInput value={testValue} onChange={setTestValue} />
          <p className="text-sm text-gray-600 mt-1">Valor numérico: {testValue}</p>
          <p className="text-sm text-gray-600">Formatado: {formatCurrency(testValue)}</p>
        </div>

        <Button onClick={runTests} className="w-full">
          Executar Testes Automáticos
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Resultados dos Testes:</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${
                  result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="text-sm">
                  <p>
                    <strong>Descrição:</strong> {result.description}
                  </p>
                  <p>
                    <strong>Input:</strong> {result.input}
                  </p>
                  <p>
                    <strong>Masked:</strong> {result.masked}
                  </p>
                  <p>
                    <strong>Parsed:</strong> {result.parsed}
                  </p>
                  <p>
                    <strong>Formatted:</strong> {result.formatted}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={result.success ? "text-green-600" : "text-red-600"}>
                      {result.success ? "✓ Sucesso" : "✗ Falhou"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
