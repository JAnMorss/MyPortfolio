
import ThemeToggle from "../ThemeToggle"
import Logo from "./Logo"

type Props = {}

export default function Header({}: Props) {
  return (
    <header className="border-b border-[#d0d7de] dark:border-[#21262d] bg-[#f6f8fa] dark:bg-[#010409]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="text-base font-semibold">JAnMors</span>
        </div>

        <div className="flex items-center gap-3">
            <ThemeToggle />
        </div>

      </div>
    </header>
  )
}