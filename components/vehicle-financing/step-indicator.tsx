import { CheckCircle } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center relative">
              {/* Linha conectora */}
              {stepNumber < totalSteps && (
                <div
                  className={`absolute top-4 w-full h-0.5 left-1/2 ${
                    isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              )}

              {/* Círculo do passo */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center z-10
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
