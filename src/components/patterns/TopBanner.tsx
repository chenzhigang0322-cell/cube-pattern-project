'use client'

import { useCubeConnection } from '@/hooks/use-cube-connection-hybrid-new'
import { usePatternStore } from '@/store/pattern-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bluetooth, BluetoothOff, Loader2, Battery, RotateCw, Info } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function TopBanner() {
  const { connectCube, disconnectCube, isConnected, deviceName, batteryLevel, lastMove } = useCubeConnection()
  const { elements } = usePatternStore()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)
    try {
      await connectCube()
    } catch (err) {
      setError(err instanceof Error ? err.message : '连接失败')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="chinese-banner-dark sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-800/40 to-rose-800/40 flex items-center justify-center border border-amber-700/30">
                <span className="text-xl">🧩</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                  魔方纹韵
                </h1>
                <p className="text-xs text-amber-200/80">智能魔方 × 传统纹样</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "secondary"} className="gap-1 bg-amber-900/50 border-amber-700/30 text-amber-200">
                {isConnected ? <Bluetooth className="h-3 w-3" /> : <BluetoothOff className="h-3 w-3" />}
                {isConnected ? '已连接' : '未连接'}
              </Badge>
              {deviceName && <span className="text-sm text-amber-200/80">{deviceName}</span>}
              {batteryLevel !== null && (
                <Badge variant="outline" className="gap-1 border-amber-700/30 text-amber-200">
                  <Battery className="h-3 w-3" />
                  {batteryLevel}%
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastMove && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-amber-900/30 rounded-full border border-amber-700/30">
                <RotateCw className="h-3 w-3 text-amber-400" />
                <span className="text-xs font-mono text-amber-200">
                  {lastMove.move} ({lastMove.face}面)
                </span>
              </div>
            )}

            <Badge variant="outline" className="gap-1 border-amber-700/30 text-stone-200">
              元素: {elements.length}
            </Badge>

            <Button
              onClick={isConnected ? disconnectCube : handleConnect}
              disabled={isConnecting}
              variant={isConnected ? "destructive" : "default"}
              size="sm"
              className={cn(
                "min-w-[100px]",
                !isConnected && "bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 border-amber-700/30"
              )}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  连接中
                </>
              ) : isConnected ? (
                '断开连接'
              ) : (
                '连接魔方'
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-2 text-sm text-amber-300 flex items-center gap-1">
            <Info className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
