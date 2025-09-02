import { useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext" 
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("ThemeContext not found")
  const { theme, setTheme } = context

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg border bg-card text-card-foreground"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}