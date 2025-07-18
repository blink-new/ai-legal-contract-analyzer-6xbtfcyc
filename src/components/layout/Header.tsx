import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Scale, User, Settings, LogOut, CreditCard, Menu, X } from 'lucide-react'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import { useLanguage } from '@/hooks/useLanguage'
import { blink } from '@/blink/client'

interface User {
  id: string
  email: string
  displayName?: string
}

export function Header() {
  const { t } = useLanguage()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleSignOut = () => {
    blink.auth.logout()
  }

  const navigationItems = [
    { 
      label: t('analyzer'), 
      href: '/#start-analysis',
      onClick: (e: React.MouseEvent) => {
        e.preventDefault()
        setMobileMenuOpen(false)
        const analysisSection = document.getElementById('start-analysis')
        if (analysisSection) {
          analysisSection.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.location.href = '/#start-analysis'
        }
      }
    },
    { 
      label: 'Generate Contracts', 
      href: '/generate',
      onClick: () => setMobileMenuOpen(false)
    },
    { 
      label: 'Signature Tool', 
      href: '/signatures',
      onClick: () => setMobileMenuOpen(false)
    },
    { 
      label: t('dashboard'), 
      href: '/dashboard',
      onClick: () => setMobileMenuOpen(false)
    },
    { 
      label: t('pricing'), 
      href: '/pricing',
      onClick: () => setMobileMenuOpen(false)
    }
  ]

  if (loading) {
    return (
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold">LegalAI</span>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </header>
    )
  }

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold">LegalAI</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navigationItems.map((item) => (
            <a 
              key={item.label}
              href={item.href} 
              className="text-sm font-medium hover:text-blue-600 transition-colors"
              onClick={item.onClick}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop User Menu */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <>
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>{t('billing')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logOut')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <LanguageSwitcher />
              <Button onClick={() => blink.auth.login()}>
                {t('signIn')}
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center space-x-2">
          <LanguageSwitcher />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="flex items-center space-x-2">
                    <Scale className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-semibold">LegalAI</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-6">
                  <div className="space-y-4">
                    {navigationItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
                        onClick={item.onClick}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </nav>

                {/* Mobile User Section */}
                <div className="border-t pt-4">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {user.displayName || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <User className="mr-2 h-4 w-4" />
                          {t('profile')}
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <CreditCard className="mr-2 h-4 w-4" />
                          {t('billing')}
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          {t('settings')}
                        </Button>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-red-600 hover:text-red-700" 
                          size="sm"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('logOut')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => {
                        blink.auth.login()
                        setMobileMenuOpen(false)
                      }} 
                      className="w-full"
                    >
                      {t('signIn')}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}