import { Outlet } from "react-router"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout() {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="light" storageKey="admin-theme">
          <Outlet />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
