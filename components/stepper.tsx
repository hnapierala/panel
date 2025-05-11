"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  name: string
  description: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress" className="mx-auto w-full max-w-4xl">
      <ol role="list" className="flex items-center justify-between min-w-[280px] sm:min-w-[600px] px-1 sm:px-2">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className="relative flex-1 px-1"
            onClick={() => {
              if (onStepClick && stepIdx <= currentStep) {
                onStepClick(stepIdx)
              }
            }}
          >
            <div className={cn("flex flex-col items-center cursor-pointer", stepIdx <= currentStep ? "group" : "")}>
              <div className="flex items-center justify-center">
                {stepIdx < currentStep ? (
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#1E8A3C]">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" aria-hidden="true" />
                  </div>
                ) : stepIdx === currentStep ? (
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#1E8A3C]">
                    <span className="text-[#1E8A3C] text-xs sm:text-sm font-medium">{stepIdx + 1}</span>
                  </div>
                ) : (
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                    <span className="text-gray-500 text-xs sm:text-sm">{stepIdx + 1}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 sm:mt-3 flex flex-col items-center text-center">
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium",
                    stepIdx <= currentStep ? "text-[#1E8A3C]" : "text-gray-500",
                  )}
                >
                  {step.name}
                </span>
                <span
                  className={cn("text-xs hidden xs:block", stepIdx <= currentStep ? "text-gray-500" : "text-gray-400")}
                >
                  {step.description}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
