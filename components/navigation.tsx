"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Clock, DollarSign, BarChart3, Settings, Menu, Home, UserPlus, FileText } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Employees", href: "/employees", icon: Users },
  { name: "Attendance", href: "/attendance", icon: Clock },
  { name: "Leaves", href: "/leaves", icon: Calendar },
  { name: "Payroll", href: "/payroll", icon: DollarSign },
  { name: "Performance", href: "/performance", icon: BarChart3 },
]

const adminNavigation = [
  { name: "Add Employee", href: "/admin/employees/create", icon: UserPlus },
  { name: "Templates", href: "/admin/templates", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.href) ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4 mr-3" />
            {item.name}
          </Link>
        )
      })}

      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center px-3 py-2 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Admin</span>
          <Badge variant="secondary" className="ml-2 text-xs">
            Admin
          </Badge>
        </div>
        {adminNavigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(item.href) ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </div>
    </>
  )

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">HR</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">HRMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <NavItems />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-1 mt-6">
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
