"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateMortgage } from "@/lib/mortgage-calculator"
import { formatCurrency } from "@/lib/formatters"
import { Bug, Calculator } from "lucide-react"

export function DebugPanel() {
  const [testResults, setTestResults] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  const runTests = () => {
    const testCases = [
      { propertyValue: 500000, downPayment: 20, term: 30 },
      { propertyValue: 300000, downPayment: 30, term: 25 },
      { propertyValue: 800000, downPayment: 40, term: 20 },
      { propertyValue: 1000000, downPayment: 50, term: 15 },
    ]

    const results = testCases.map((testCase, index) => {
      try {
        const calculation = calculateMortgage(testCase.propertyValue, testCase.downPayment, testCase.term)

        return {
          id: index + 1,
          input: testCase,
          output: calculation,
          status: "success",
          error: null,
        }
      } catch (error) {
        return {
          id: index + 1,
          input: testCase,
          output: null,
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    })

    setTestResults(results)
  }

  if (!isVisible) {
    return (
      <Button onClick={() => setIsVisible(true)} variant="outline" size="sm" className="fixed bottom-4 right-4 z-50">
        <Bug className="h-4 w-4 mr-2" />
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto z-50 shadow-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Debug Panel
          </span>
          <Button onClick={() => setIsVisible(false)} variant="ghost" size="sm" className="h-6 w-6 p-0">
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={runTests} size="sm" className="w-full">
          Run Calculation Tests
        </Button>

        {testResults && (
          <div className="space-y-2 text-xs">
            {testResults.map((result: any) => (
              <div
                key={result.id}
                className={`p-2 rounded border ${
                  result.status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="font-semibold">
                  Test {result.id}: {result.status}
                </div>
                <div>
                  Input: R$ {result.input.propertyValue.toLocaleString()},{result.input.downPayment}%,{" "}
                  {result.input.term}y
                </div>
                {result.status === "success" ? (
                  <div>
                    Monthly: {formatCurrency(result.output.monthlyPayment)}
                    <br />
                    Total: {formatCurrency(result.output.totalPayment)}
                  </div>
                ) : (
                  <div className="text-red-600">Error: {result.error}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
