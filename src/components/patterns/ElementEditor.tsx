'use client'

import { usePatternStore } from '@/store/pattern-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PATTERN_CONFIGS } from '@/types/pattern'
import { Switch } from '@/components/ui/switch'

export function ElementEditor() {
  const { elements, selectedElementId, updateElementTransform } = usePatternStore()
  
  const selectedElement = elements.find(el => el.id === selectedElementId)
  
  if (!selectedElement) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          请先选择一个元素进行编辑
        </CardContent>
      </Card>
    )
  }
  
  const patternConfig = PATTERN_CONFIGS.find(p => p.type === selectedElement.type)
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          元素属性 - {patternConfig?.name || selectedElement.type}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 位置 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">X 位置</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.transform.x)}
              onChange={(e) => updateElementTransform(selectedElement.id, { x: Number(e.target.value) })}
              className="h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Y 位置</Label>
            <Input
              type="number"
              value={Math.round(selectedElement.transform.y)}
              onChange={(e) => updateElementTransform(selectedElement.id, { y: Number(e.target.value) })}
              className="h-8"
            />
          </div>
        </div>
        
        {/* 旋转 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">旋转角度</Label>
            <span className="text-xs text-muted-foreground">{Math.round(selectedElement.transform.rotation)}°</span>
          </div>
          <Slider
            value={[selectedElement.transform.rotation]}
            onValueChange={([value]) => updateElementTransform(selectedElement.id, { rotation: value })}
            min={0}
            max={360}
            step={15}
          />
        </div>
        
        {/* 缩放 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">缩放比例</Label>
            <span className="text-xs text-muted-foreground">{selectedElement.transform.scale.toFixed(2)}x</span>
          </div>
          <Slider
            value={[selectedElement.transform.scale * 100]}
            onValueChange={([value]) => updateElementTransform(selectedElement.id, { scale: value / 100 })}
            min={25}
            max={300}
            step={5}
          />
        </div>
        
        {/* 大小 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">元素大小</Label>
            <span className="text-xs text-muted-foreground">{selectedElement.size}px</span>
          </div>
          <Slider
            value={[selectedElement.size]}
            onValueChange={([value]) => {
              usePatternStore.setState(state => ({
                elements: state.elements.map(el => 
                  el.id === selectedElementId ? { ...el, size: value } : el
                )
              }))
            }}
            min={40}
            max={200}
            step={10}
          />
        </div>
        
        {/* 镜像 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs">水平镜像</Label>
            <Switch
              checked={selectedElement.transform.mirrorX}
              onCheckedChange={(checked) => updateElementTransform(selectedElement.id, { mirrorX: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">垂直镜像</Label>
            <Switch
              checked={selectedElement.transform.mirrorY}
              onCheckedChange={(checked) => updateElementTransform(selectedElement.id, { mirrorY: checked })}
            />
          </div>
        </div>
        
        {/* 颜色 */}
        <div className="space-y-1">
          <Label className="text-xs">颜色</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedElement.color}
              onChange={(e) => {
                usePatternStore.setState(state => ({
                  elements: state.elements.map(el => 
                    el.id === selectedElementId ? { ...el, color: e.target.value } : el
                  )
                }))
              }}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={selectedElement.color}
              onChange={(e) => {
                usePatternStore.setState(state => ({
                  elements: state.elements.map(el => 
                    el.id === selectedElementId ? { ...el, color: e.target.value } : el
                  )
                }))
              }}
              className="h-8 flex-1"
            />
          </div>
        </div>
        
        {/* 线宽 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">线条粗细</Label>
            <span className="text-xs text-muted-foreground">{selectedElement.strokeWidth}px</span>
          </div>
          <Slider
            value={[selectedElement.strokeWidth]}
            onValueChange={([value]) => {
              usePatternStore.setState(state => ({
                elements: state.elements.map(el => 
                  el.id === selectedElementId ? { ...el, strokeWidth: value } : el
                )
              }))
            }}
            min={1}
            max={10}
            step={0.5}
          />
        </div>
        
        {/* 透明度 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">透明度</Label>
            <span className="text-xs text-muted-foreground">{Math.round(selectedElement.opacity * 100)}%</span>
          </div>
          <Slider
            value={[selectedElement.opacity * 100]}
            onValueChange={([value]) => {
              usePatternStore.setState(state => ({
                elements: state.elements.map(el => 
                  el.id === selectedElementId ? { ...el, opacity: value / 100 } : el
                )
              }))
            }}
            min={10}
            max={100}
            step={5}
          />
        </div>
      </CardContent>
    </Card>
  )
}
