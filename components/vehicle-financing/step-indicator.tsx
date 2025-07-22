import { CheckCircle } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center relative">
        {/* Linha de fundo (conecta todos os passos) */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-700" style={{ 
          marginLeft: '1rem', 
          marginRight: '1rem' 
        }} />
        
        {/* Linha de progresso (verde para passos completados) */}
        <div 
          className="absolute top-4 h-0.5 bg-green-500 transition-all duration-300 ease-in-out" 
          style={{ 
            left: '1rem',
            width: currentStep > 1 ? `${((currentStep - 1) / (totalSteps - 1)) * (100 - (2 * 16 / totalSteps))}%` : '0%'
          }} 
        />

        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center relative z-10">
              {/* Círculo do passo */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }
                `}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <span>{stepNumber}</span>}
              </div>

              {/* Rótulo do passo */}
              {labels && (
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : isCompleted
                          ? "text-green-500"
                          : "text-gray-500 dark:text-gray-400"
                    }
                  `}
                >
                  {labels[index]}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Exemplo de uso
export default function App() {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">Step Indicator - Exemplo</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Passo 2 de 4</h3>
          <StepIndicator 
            currentStep={2} 
            totalSteps={4} 
            labels={['Início', 'Dados', 'Revisão', 'Finalizar']} 
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Passo 3 de 5</h3>
          <StepIndicator 
            currentStep={3} 
            totalSteps={5} 
            labels={['Setup', 'Config', 'Deploy', 'Test', 'Done']} 
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Passo 1 de 3</h3>
          <StepIndicator 
            currentStep={1} 
            totalSteps={3} 
            labels={['Start', 'Process', 'Finish']} 
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Sem labels</h3>
          <StepIndicator 
            currentStep={2} 
            totalSteps={4} 
          />
        </div>
      </div>
    </div>
  )
}