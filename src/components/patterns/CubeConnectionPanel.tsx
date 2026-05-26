'use client'

import { useCubeConnection } from '@/hooks/use-cube-connection-hybrid-new'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Battery, Bluetooth, BluetoothOff, Loader2, RotateCw } from 'lucide-react'
import { useState } from 'react'
import { usePatternStore } from '@/store/pattern-store'
import { cn } from '@/lib/utils'

export function CubeConnectionPanel() {
  const { connectCube, disconnectCube, isConnected, deviceName, batteryLevel, lastMove } = useCubeConnection()
  const { mappingRules } = usePatternStore()
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
    <Card className="chinese-border chinese-shadow card-hover">
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-rose-50">
        <CardTitle className="text-base flex items-center gap-2 text-amber-900">
          {isConnected ? (
            <Bluetooth className="h-4 w-4 text-green-500" />
          ) : (
            <BluetoothOff className="h-4 w-4 text-amber-600" />
          )}
          魔方连接
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* 连接状态 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="chinese-border">
              {isConnected ? '已连接' : '未连接'}
            </Badge>
            {deviceName && (
              <span className="text-sm text-muted-foreground">{deviceName}</span>
            )}
          </div>
          {batteryLevel !== null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Battery className="h-3 w-3" />
              {batteryLevel}%
            </div>
          )}
        </div>

        {/* 连接按钮 */}
        <Button
          onClick={isConnected ? disconnectCube : handleConnect}
          disabled={isConnecting}
          variant={isConnected ? "destructive" : "default"}
          className={cn(
            "w-full chinese-border btn-click",
            !isConnected && "bg-gradient-to-r from-amber-500 via-red-500 to-rose-500 hover:from-amber-600 hover:via-red-600 hover:to-rose-600"
          )}
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              连接中...
            </>
          ) : isConnected ? (
            '断开连接'
          ) : (
            '连接魔方'
          )}
        </Button>

        {/* 错误提示 */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* 最后操作 */}
        {lastMove && (
          <div className="p-3 bg-gradient-to-r from-amber-50 to-rose-50 rounded-lg chinese-border">
            <p className="text-xs text-muted-foreground mb-1">最后操作:</p>
            <p className="text-sm font-mono text-amber-900">
              {lastMove.move} ({lastMove.face}面 {lastMove.direction === 'CW' ? '顺时针' : '逆时针'})
            </p>
          </div>
        )}

        {/* 映射规则说明 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <RotateCw className="h-3 w-3" />
            转动映射规则:
          </p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {mappingRules.map((rule) => (
              <div key={rule.face} className="flex items-center gap-1 p-2 bg-gradient-to-r from-amber-50 to-rose-50/50 rounded chinese-border">
                <span className="font-mono font-bold w-4 text-amber-600">{rule.face}</span>
                <span className="text-muted-foreground truncate">{rule.description.split('：')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
