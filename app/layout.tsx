import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSystemDetector } from "@/components/theme-system-detector"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Simulador de Financiamento Imobiliário",
  description: "Simule seu financiamento imobiliário com facilidade e precisão",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="real-estate-theme"
        >
          <ThemeSystemDetector />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
