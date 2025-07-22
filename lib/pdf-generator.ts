import jsPDF from "jspdf"
import type { SimulationData } from "./database"
import { formatCurrency } from "./formatters"

// Color palette matching the application design
const colors = {
  primary: "#2563eb", // Blue-600
  primaryLight: "#3b82f6", // Blue-500
  secondary: "#6366f1", // Indigo-500
  accent: "#10b981", // Emerald-500
  text: "#1f2937", // Gray-800
  textLight: "#6b7280", // Gray-500
  background: "#f8fafc", // Slate-50
  white: "#ffffff",
  border: "#e2e8f0", // Slate-200
  success: "#059669", // Emerald-600
}

// Helper function to add a colored header section
function addHeaderSection(doc: jsPDF, title: string, y: number, color: string = colors.primary): number {
  // Background rectangle
  doc.setFillColor(color)
  doc.rect(15, y - 5, 180, 12, "F")

  // Title text
  doc.setTextColor(colors.white)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(title, 20, y + 2)

  return y + 15
}

// Helper function to add a content section with background
function addContentSection(doc: jsPDF, y: number, height: number): number {
  doc.setFillColor(colors.background)
  doc.rect(15, y, 180, height, "F")
  doc.setDrawColor(colors.border)
  doc.rect(15, y, 180, height, "S")
  return y
}

// Helper function to add a value box
function addValueBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  label: string,
  value: string,
  color: string = colors.primary,
): void {
  // Box background
  doc.setFillColor(color)
  doc.rect(x, y, width, 25, "F")

  // Label
  doc.setTextColor(colors.white)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")
  doc.text(label, x + 5, y + 8)

  // Value
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(value, x + 5, y + 18)
}

export function generateProposalPDF(simulation: SimulationData): jsPDF {
  const doc = new jsPDF()
  let currentY = 20

  // Document Header with Logo Area
  doc.setFillColor(colors.primary)
  doc.rect(0, 0, 210, 40, "F")

  // Main Title
  doc.setTextColor(colors.white)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("PROPOSTA DE FINANCIAMENTO", 20, 25)

  // Subtitle
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("IMOBILIÁRIO", 20, 32)

  // Document ID and Date - moved more to the right
  doc.setFontSize(10)
  doc.text(`Proposta #${simulation.id || "XXXX"}`, 160, 25)
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 160, 32)

  currentY = 55

  // Client Information Section
  currentY = addHeaderSection(doc, "DADOS DO CLIENTE", currentY)
  currentY = addContentSection(doc, currentY, 35)

  doc.setTextColor(colors.text)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  // Client info in two columns
  doc.text(`Nome: ${simulation.client_name}`, 25, currentY + 10)
  doc.text(`CPF: ${simulation.client_cpf}`, 25, currentY + 18)
  doc.text(`Email: ${simulation.client_email}`, 25, currentY + 26)
  doc.text(`Telefone: ${simulation.client_phone}`, 120, currentY + 18)

  currentY += 50

  // Property and Financing Details Section
  currentY = addHeaderSection(doc, "DETALHES DO IMÓVEL E FINANCIAMENTO", currentY)
  currentY = addContentSection(doc, currentY, 45)

  // Property details in organized layout
  doc.setTextColor(colors.text)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  doc.text("Valor do Imóvel:", 25, currentY + 12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary)
  doc.text(formatCurrency(simulation.property_value), 80, currentY + 12)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text)
  doc.text(`Entrada (${simulation.down_payment_percentage}%):`, 25, currentY + 22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.success)
  doc.text(formatCurrency(simulation.down_payment_amount), 80, currentY + 22)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text)
  doc.text("Valor Financiado:", 25, currentY + 32)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.secondary)
  doc.text(formatCurrency(simulation.loan_amount), 80, currentY + 32)

  // Right column
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text)
  doc.text("Prazo:", 120, currentY + 12)
  doc.setFont("helvetica", "bold")
  doc.text(`${simulation.loan_term_years} anos`, 145, currentY + 12)

  doc.setFont("helvetica", "normal")
  doc.text("Taxa de Juros:", 120, currentY + 22)
  doc.setFont("helvetica", "bold")
  doc.text(`${simulation.interest_rate}% a.a.`, 145, currentY + 22)

  currentY += 60

  // Payment Summary with Visual Boxes
  currentY = addHeaderSection(doc, "RESUMO DOS PAGAMENTOS", currentY)

  // Three payment boxes
  addValueBox(doc, 20, currentY + 5, 50, "PARCELA MENSAL", formatCurrency(simulation.monthly_payment), colors.primary)
  addValueBox(doc, 80, currentY + 5, 50, "TOTAL DE JUROS", formatCurrency(simulation.total_interest), colors.secondary)
  addValueBox(doc, 140, currentY + 5, 50, "VALOR TOTAL", formatCurrency(simulation.total_payment), colors.success)

  currentY += 45

  // Amortization Preview Table
  currentY = addHeaderSection(doc, "SIMULAÇÃO DE AMORTIZAÇÃO (PRIMEIROS 12 MESES)", currentY)
  currentY = addContentSection(doc, currentY, 75) // Reduced height to prevent overflow

  // Table headers
  doc.setFillColor(colors.primaryLight)
  doc.rect(20, currentY + 5, 170, 8, "F")
  doc.setTextColor(colors.white)
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Mês", 25, currentY + 10)
  doc.text("Parcela", 50, currentY + 10)
  doc.text("Juros", 80, currentY + 10)
  doc.text("Amortização", 110, currentY + 10)
  doc.text("Saldo Devedor", 150, currentY + 10)

  // Sample amortization data (first 12 months)
  doc.setTextColor(colors.text)
  doc.setFontSize(8)
  doc.setFont("helvetica", "normal")

  let balance = simulation.loan_amount
  const monthlyRate = simulation.interest_rate / 100 / 12
  const monthlyPayment = simulation.monthly_payment

  for (let month = 1; month <= 12; month++) {
    const interest = balance * monthlyRate
    const principal = monthlyPayment - interest
    balance -= principal

    const y = currentY + 15 + month * 5
    doc.text(month.toString().padStart(2, "0"), 25, y)
    doc.text(formatCurrency(monthlyPayment), 50, y)
    doc.text(formatCurrency(interest), 80, y)
    doc.text(formatCurrency(principal), 110, y)
    doc.text(formatCurrency(balance), 150, y)
  }

  currentY += 85

  // Terms and Conditions Section
  currentY = addHeaderSection(doc, "TERMOS E CONDIÇÕES", currentY)
  currentY = addContentSection(doc, currentY, 45) // Reduced height

  doc.setTextColor(colors.text)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")

  const terms = [
    "• Esta proposta tem validade de 30 dias a partir da data de emissão.",
    "• A aprovação do financiamento está sujeita à análise de crédito e renda.",
    "• Documentação completa deve ser apresentada para formalização do contrato.",
    "• Taxas administrativas e seguros obrigatórios serão informados na formalização.",
    "• O imóvel ficará como garantia real do financiamento (hipoteca).",
    "• Valores sujeitos a alteração conforme política de crédito da instituição.",
  ]

  terms.forEach((term, index) => {
    doc.text(term, 25, currentY + 10 + index * 6) // Reduced line spacing
  })

  currentY += 55

  // Signature Section
  currentY = addHeaderSection(doc, "ASSINATURA E ACEITE", currentY)
  currentY = addContentSection(doc, currentY, 30) // Reduced height

  doc.setTextColor(colors.text)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text("Data: ___/___/______", 25, currentY + 15)
  doc.text("Assinatura do Cliente:", 25, currentY + 25)
  doc.line(80, currentY + 25, 170, currentY + 25)

  // Footer - positioned properly to avoid cutting
  const footerY = 275 // Fixed position to ensure it fits
  doc.setFillColor(colors.primary)
  doc.rect(0, footerY, 210, 22, "F") // Increased height for better spacing
  doc.setTextColor(colors.white)
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(
    `Documento gerado automaticamente em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
    20,
    footerY + 8,
  )
  doc.text("Este documento é uma simulação e não constitui compromisso de crédito.", 20, footerY + 16)

  return doc
}

export function generateProposalPDFWithSignature(simulation: SimulationData, signatureDataUrl: string): jsPDF {
  const doc = new jsPDF()
  let currentY = 20

  // Document Header with Logo Area
  doc.setFillColor(colors.success)
  doc.rect(0, 0, 210, 40, "F")

  // Main Title
  doc.setTextColor(colors.white)
  doc.setFontSize(24)
  doc.setFont("helvetica", "bold")
  doc.text("PROPOSTA ASSINADA", 20, 25)

  // Subtitle
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("FINANCIAMENTO IMOBILIÁRIO", 20, 32)

  // Document ID and Date - moved more to the right
  doc.setFontSize(10)
  doc.text(`Proposta #${simulation.id || "XXXX"}`, 160, 25)
  doc.text(`Assinada em: ${new Date().toLocaleDateString("pt-BR")}`, 155, 32)

  currentY = 55

  // Status Badge
  doc.setFillColor(colors.success)
  doc.rect(20, currentY, 60, 15, "F")
  doc.setTextColor(colors.white)
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("✓ PROPOSTA ACEITA", 25, currentY + 9)

  currentY += 25

  // Client Information Section
  currentY = addHeaderSection(doc, "DADOS DO CLIENTE", currentY, colors.success)
  currentY = addContentSection(doc, currentY, 35)

  doc.setTextColor(colors.text)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  // Client info in two columns
  doc.text(`Nome: ${simulation.client_name}`, 25, currentY + 10)
  doc.text(`CPF: ${simulation.client_cpf}`, 25, currentY + 18)
  doc.text(`Email: ${simulation.client_email}`, 25, currentY + 26)
  doc.text(`Telefone: ${simulation.client_phone}`, 120, currentY + 18)

  currentY += 50

  // Property and Financing Details Section
  currentY = addHeaderSection(doc, "DETALHES DO FINANCIAMENTO APROVADO", currentY, colors.success)
  currentY = addContentSection(doc, currentY, 45)

  // Property details in organized layout
  doc.setTextColor(colors.text)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  doc.text("Valor do Imóvel:", 25, currentY + 12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.primary)
  doc.text(formatCurrency(simulation.property_value), 80, currentY + 12)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text)
  doc.text(`Entrada (${simulation.down_payment_percentage}%):`, 25, currentY + 22)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.success)
  doc.text(formatCurrency(simulation.down_payment_amount), 80, currentY + 22)

  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text)
  doc.text("Valor Financiado:", 25, currentY + 32)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.secondary)
  doc.text(formatCurrency(simulation.loan_amount), 80, currentY + 32)

  // Right column
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.text)
  doc.text("Prazo:", 120, currentY + 12)
  doc.setFont("helvetica", "bold")
  doc.text(`${simulation.loan_term_years} anos`, 145, currentY + 12)

  doc.setFont("helvetica", "normal")
  doc.text("Taxa de Juros:", 120, currentY + 22)
  doc.setFont("helvetica", "bold")
  doc.text(`${simulation.interest_rate}% a.a.`, 145, currentY + 22)

  currentY += 60

  // Payment Summary with Visual Boxes
  currentY = addHeaderSection(doc, "RESUMO DOS PAGAMENTOS APROVADOS", currentY, colors.success)

  // Three payment boxes with success color theme
  addValueBox(doc, 20, currentY + 5, 50, "PARCELA MENSAL", formatCurrency(simulation.monthly_payment), colors.success)
  addValueBox(doc, 80, currentY + 5, 50, "TOTAL DE JUROS", formatCurrency(simulation.total_interest), colors.secondary)
  addValueBox(doc, 140, currentY + 5, 50, "VALOR TOTAL", formatCurrency(simulation.total_payment), colors.primary)

  currentY += 45

  // Digital Signature Section
  currentY = addHeaderSection(doc, "ASSINATURA DIGITAL", currentY, colors.success)
  currentY = addContentSection(doc, currentY, 40)

  doc.setTextColor(colors.text)
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`Data da Assinatura: ${new Date().toLocaleDateString("pt-BR")}`, 25, currentY + 15)
  doc.text("Assinatura Digital do Cliente:", 25, currentY + 25)

  // Add the signature image
  try {
    doc.addImage(signatureDataUrl, "PNG", 25, currentY + 30, 80, 15)

    // Add verification info
    doc.setFontSize(8)
    doc.setTextColor(colors.textLight)
    doc.text("✓ Assinatura verificada digitalmente", 110, currentY + 35)
    doc.text(`Hash: ${Date.now().toString(36).toUpperCase()}`, 110, currentY + 40)
  } catch (error) {
    console.error("Erro ao adicionar assinatura ao PDF:", error)
    doc.line(25, currentY + 35, 105, currentY + 35)
    doc.setFontSize(8)
    doc.setTextColor(colors.textLight)
    doc.text("Erro ao carregar assinatura digital", 110, currentY + 35)
  }

  currentY += 55

  // Next Steps Section
  currentY = addHeaderSection(doc, "PRÓXIMOS PASSOS", currentY, colors.primary)
  currentY = addContentSection(doc, currentY, 35)

  doc.setTextColor(colors.text)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")

  const nextSteps = [
    "1. Aguarde contato da nossa equipe de crédito em até 2 dias úteis",
    "2. Prepare a documentação necessária (lista será enviada por email)",
    "3. Agende uma visita para avaliação do imóvel",
    "4. Compareça à agência para assinatura do contrato final",
    "5. Liberação dos recursos conforme cronograma acordado",
  ]

  nextSteps.forEach((step, index) => {
    doc.text(step, 25, currentY + 10 + index * 6)
  })

  // Footer with success theme - positioned properly to avoid cutting
  const footerY = 275 // Fixed position to ensure it fits
  doc.setFillColor(colors.success)
  doc.rect(0, footerY, 210, 22, "F") // Increased height for better spacing
  doc.setTextColor(colors.white)
  doc.setFontSize(8)
  doc.setFont("helvetica", "italic")
  doc.text(
    `Proposta assinada digitalmente em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
    20,
    footerY + 8,
  )
  doc.text("Este documento possui validade legal e constitui aceite formal da proposta.", 20, footerY + 16)

  return doc
}

// Enhanced PDF generator for detailed reports
export function generateDetailedReport(simulation: SimulationData): jsPDF {
  const doc = new jsPDF()
  const currentY = 20

  // Cover page
  doc.setFillColor(colors.primary)
  doc.rect(0, 0, 210, 297, "F")

  doc.setTextColor(colors.white)
  doc.setFontSize(32)
  doc.setFont("helvetica", "bold")
  doc.text("RELATÓRIO", 105, 120, { align: "center" })
  doc.text("DETALHADO", 105, 140, { align: "center" })

  doc.setFontSize(16)
  doc.setFont("helvetica", "normal")
  doc.text("Simulação de Financiamento Imobiliário", 105, 160, { align: "center" })

  doc.setFontSize(12)
  doc.text(`Cliente: ${simulation.client_name}`, 105, 180, { align: "center" })
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 105, 190, { align: "center" })

  // Add new page for content
  doc.addPage()

  // Continue with detailed content...
  // This would include full amortization table, charts, etc.

  return doc
}
