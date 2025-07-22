import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  className?: string
  }

export default function HeaderPages({ className }: HeaderProps) {
  return (
         <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
             <div className="flex items-center">
               <Link href="/" className="flex items-center mr-4">
                 <ArrowLeft className="h-5 w-5 mr-2" />
                 <span>Voltar</span>
               </Link>
               <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                 Kiwify Crédito
               </span>
             </div>
             <ThemeToggle />
           </div>
         </header>
)
};
