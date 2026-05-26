'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { usePatternStore } from '@/store/pattern-store'
import { drawElement } from '@/lib/pattern-drawers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, RotateCcw } from 'lucide-react'

interface PatternCanvasProps {
  width?: number
  height?: number
}

export function PatternCanvas({ width = 500, height = 400 }: PatternCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  
  const { 
    elements, 
    selectedElementId, 
    selectElement, 
    removeElement,
    clearCanvas,
    updateElementTransform 
  } = usePatternStore()
  
  // 绘制画布
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 清空画布
    ctx.fillStyle = '#faf8f5'  // 宣纸色背景
    ctx.fillRect(0, 0, width, height)
    
    // 绘制网格背景
    ctx.strokeStyle = '#e8e4df'
    ctx.lineWidth = 0.5
    const gridSize = 20
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    // 绘制所有元素
    elements.forEach(element => {
      drawElement(ctx, element)
      
      // 绘制选中框
      if (element.id === selectedElementId) {
        ctx.save()
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        const padding = 10
        ctx.strokeRect(
          element.transform.x - padding,
          element.transform.y - padding,
          element.size + padding * 2,
          element.size + padding * 2
        )
        ctx.restore()
      }
    })
  }, [elements, selectedElementId, width, height])
  
  // 重绘画布
  useEffect(() => {
    draw()
  }, [draw])
  
  // 点击选择元素
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 查找点击的元素（从后往前查找，后绘制的在上面）
    let foundId: string | null = null
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i]
      if (
        x >= el.transform.x &&
        x <= el.transform.x + el.size &&
        y >= el.transform.y &&
        y <= el.transform.y + el.size
      ) {
        foundId = el.id
        break
      }
    }
    
    selectElement(foundId)
  }
  
  // 拖拽开始
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedElementId) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const selectedElement = elements.find(el => el.id === selectedElementId)
    if (selectedElement) {
      if (
        x >= selectedElement.transform.x &&
        x <= selectedElement.transform.x + selectedElement.size &&
        y >= selectedElement.transform.y &&
        y <= selectedElement.transform.y + selectedElement.size
      ) {
        setIsDragging(true)
        setDragStart({ 
          x: x - selectedElement.transform.x, 
          y: y - selectedElement.transform.y 
        })
      }
    }
  }
  
  // 拖拽移动
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElementId) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    updateElementTransform(selectedElementId, {
      x: x - dragStart.x,
      y: y - dragStart.y
    })
  }
  
  // 拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false)
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="cursor-crosshair"
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* 工具栏 */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => selectedElementId && removeElement(selectedElementId)}
              disabled={!selectedElementId}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={clearCanvas}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* 状态栏 */}
        <div className="px-3 py-2 bg-muted/30 border-t text-xs text-muted-foreground flex justify-between">
          <span>元素数量: {elements.length}</span>
          <span>{selectedElementId ? '已选中元素' : '点击画布选择元素'}</span>
        </div>
      </CardContent>
    </Card>
  )
}
