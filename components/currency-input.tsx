"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { maskCurrency, parseCurrency, formatCurrency } from "@/lib/formatters"
import { forwardRef, useState, useEffect } from "react"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number
  onChange?: (value: number) => void
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(() => {
      if (value && value > 0) {
        return formatCurrency(value)
      }
      return ""
    })

    const [isFocused, setIsFocused] = useState(false)

    // Update display value when prop value changes
    useEffect(() => {
      if (!isFocused) {
        if (value !== undefined && value > 0) {
          setDisplayValue(formatCurrency(value))
        } else {
          setDisplayValue("")
        }
      }
    }, [value, isFocused])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)

      // Format the final value on blur
      if (value && value > 0) {
        setDisplayValue(formatCurrency(value))
      } else {
        setDisplayValue("")
      }

      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // Handle empty input
      if (!inputValue || inputValue === "R$ ") {
        setDisplayValue("")
        onChange?.(0)
        return
      }

      // Apply currency mask
      const maskedValue = maskCurrency(inputValue)
      setDisplayValue(maskedValue)

      // Parse the numeric value
      const numericValue = parseCurrency(maskedValue)

      // Call onChange with the numeric value
      if (isFinite(numericValue) && !isNaN(numericValue)) {
        onChange?.(numericValue)
      } else {
        onChange?.(0)
      }
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="R$ 0,00"
        inputMode="numeric"
      />
    )
  },
)

CurrencyInput.displayName = "CurrencyInput"
