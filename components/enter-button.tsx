import { Terminal } from 'lucide-react'

interface EnterButtonProps {
  onClick: () => void
}

export default function EnterButton({ onClick }: EnterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#e8f9ff] text-black px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#e8f9ff] focus:ring-opacity-50 flex items-center gap-2"
      aria-label="Enter the terminal"
    >
      <Terminal className="w-5 h-5" />
      Enter
    </button>
  )
}

