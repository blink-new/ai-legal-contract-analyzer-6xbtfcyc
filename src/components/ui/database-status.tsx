import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { initializeDatabase } from '@/lib/database'

interface DatabaseStatusProps {
  className?: string
}

export function DatabaseStatus({ className }: DatabaseStatusProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [dbStatus, setDbStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  const checkDatabaseStatus = async () => {
    setDbStatus('checking')
    try {
      const isAvailable = await initializeDatabase()
      setDbStatus(isAvailable ? 'online' : 'offline')
      setLastCheck(new Date())
    } catch (error) {
      setDbStatus('offline')
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    // Check database status on mount
    checkDatabaseStatus()

    // Monitor network status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Periodic check every 30 seconds
    const interval = setInterval(checkDatabaseStatus, 30000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  if (!isOnline) {
    return (
      <Alert className={className}>
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>You're offline. Data will sync when connection is restored.</span>
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Offline
          </Badge>
        </AlertDescription>
      </Alert>
    )
  }

  if (dbStatus === 'offline') {
    return (
      <Alert className={className}>
        <Database className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <span>Database temporarily unavailable. Using local storage.</span>
            <div className="text-xs text-gray-500 mt-1">
              Last checked: {lastCheck.toLocaleTimeString()}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              💾 Local Mode
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={checkDatabaseStatus}
              disabled={dbStatus === 'checking'}
            >
              {dbStatus === 'checking' ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (dbStatus === 'online') {
    return (
      <Alert className={className}>
        <Wifi className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Database connected. Your data is synced across devices.</span>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ☁️ Synced
          </Badge>
        </AlertDescription>
      </Alert>
    )
  }

  return null
}