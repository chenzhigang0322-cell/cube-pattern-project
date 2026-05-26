'use client'

import { BASE_PATTERN_CONFIGS, PatternType } from '@/types/pattern'
import { usePatternStore } from '@/store/pattern-store'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Sparkles, Star } from 'lucide-react'

interface PatternSelectorProps {
  onPatternSelect?: (type: PatternType) => void
}

export function PatternSelector({ onPatternSelect }: PatternSelectorProps) {
  const { addElement, selectedElementId } = usePatternStore()

  const handlePatternClick = (type: PatternType) => {
    // 在画布中心添加元素
    const canvasCenterX = 200
    const canvasCenterY = 200
    addElement(type, canvasCenterX, canvasCenterY)
    onPatternSelect?.(type)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-300" />
        <h3 className="text-sm font-medium text-amber-100">选择纹样元素</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {BASE_PATTERN_CONFIGS.map((config) => (
          <Card
            key={config.type}
            className={cn(
              "cursor-pointer transition-all chinese-border chinese-shadow card-hover bg-stone-900/50",
              "hover:border-amber-400/50",
              selectedElementId === config.type && "ring-2 ring-amber-400"
            )}
            onClick={() => handlePatternClick(config.type)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center chinese-border"
                  style={{ 
                    backgroundColor: config.defaultColor + '20',
                    borderColor: config.defaultColor + '40'
                  }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{ color: config.defaultColor }}
                  >
                    {config.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: config.defaultColor }}>{config.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: config.complexity }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
