'use client'

import { useState, useEffect } from 'react'
import { PatternSelector } from '@/components/patterns/PatternSelector'
import { EthnicPatternSelector } from '@/components/patterns/EthnicPatternSelector'
import { PatternCanvas } from '@/components/patterns/PatternCanvas'
import { ElementEditor } from '@/components/patterns/ElementEditor'
import { SceneSelector } from '@/components/patterns/sceneselector'
import { TopBanner } from '@/components/patterns/TopBanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { usePatternStore } from '@/store/pattern-store'
import { PATTERN_CONFIGS } from '@/types/pattern'
import { BookOpen, Image, ArrowLeft, Download, Sparkles } from 'lucide-react'
import './chinese-architecture.css'

export default function CreatePage() {
  const { generatedImage, clearGeneratedImage, elements, selectedElementId } = usePatternStore()
  const [showGeneratedOverlay, setShowGeneratedOverlay] = useState(false)

  // 根据当前选中的元素获取对应的纹样知识
  const selectedElement = elements.find(el => el.id === selectedElementId)
  const selectedPatternConfig = selectedElement
    ? PATTERN_CONFIGS.find(p => p.type === selectedElement.type)
    : null

  // 当生成图片存在时，自动显示覆盖层
  useEffect(() => {
    if (generatedImage) {
      setShowGeneratedOverlay(true)
    }
  }, [generatedImage])

  // 返回画板
  const handleBackToCanvas = () => {
    setShowGeneratedOverlay(false)
    clearGeneratedImage()
  }

  // 下载生成的图片
  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `ai-pattern-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen flex flex-col chinese-wall-bg chinese-eaves chinese-lattice">
      <TopBanner />

      <main className="flex-1 w-full px-4 py-6">
        <div className="max-w-[1600px] mx-auto flex flex-row gap-6 overflow-x-auto pb-2 items-start">

          {/* 左侧栏：纹样选择 + 映射规则 */}
          <aside className="w-72 shrink-0 space-y-4 flex flex-col">
            <div className="sticky top-24 space-y-4 flex-1 pt-7">
              <PatternSelector />

              <EthnicPatternSelector />

              <Card className="chinese-card-dark shadow-lg">
                <CardHeader className="pb-2 chinese-card-header-dark">
                  <CardTitle className="text-sm flex items-center gap-2 chinese-text-gold">
                    <BookOpen className="h-4 w-4" />
                    转动映射规则
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <p className="text-xs chinese-text-light leading-relaxed">
                    <span className="text-amber-300 font-medium">基准面：</span>白顶（U面白色朝上）、绿前（F面绿色朝前）
                  </p>
                  <p className="text-xs chinese-text-light leading-relaxed">
                    <span className="text-amber-300 font-medium">转动方向：</span>以该面朝向自己时的顺时针为准
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { face: 'U', name: '顶面', effect: '平移' },
                      { face: 'R', name: '右面', effect: '水平翻转' },
                      { face: 'F', name: '前面', effect: '旋转90°' },
                      { face: 'D', name: '底面', effect: '中心对称' },
                      { face: 'L', name: '左面', effect: '垂直翻转' },
                      { face: 'B', name: '后面', effect: '缩放' },
                    ].map((rule) => (
                      <div key={rule.face} className="flex flex-col gap-0.5 p-2 bg-amber-900/30 rounded-md border border-amber-700/30 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-amber-400 w-5">{rule.face}</span>
                          <span className="text-amber-200/70 text-[10px]">{rule.name}</span>
                        </div>
                        <span className="chinese-text-light">{rule.effect}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </aside>

          {/* 中间区域：画布 + 生成结果覆盖层 */}
          <section className="flex-1 min-w-[520px] relative flex flex-col">
            <Card className="chinese-card-dark shadow-lg overflow-hidden">
              <CardHeader className="pb-2 chinese-card-header-dark">
                <CardTitle className="text-base flex items-center gap-2 chinese-text-gold">
                  <Image className="h-4 w-4" />
                  创作画布
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 flex justify-center relative" style={{ backgroundColor: '#faf8f5' }}>
                <div className="relative">
                  <PatternCanvas width={700} height={550} />
                  {showGeneratedOverlay && generatedImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                      <Button
                        onClick={() => setShowGeneratedOverlay(false)}
                        className="absolute top-2 left-2 bg-amber-900/60 text-white border border-amber-500/50 hover:bg-amber-800/80 z-20"
                        size="sm"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        返回画板
                      </Button>
                      <Button
                        onClick={handleDownload}
                        className="absolute top-2 right-2 bg-amber-900/60 text-white border border-amber-500/50 hover:bg-amber-800/80 z-20"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                      <div className="relative w-full h-full p-2">
                        <img
                          src={generatedImage}
                          alt="AI生成"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 生成AI图像后的下一步按钮 */}
            {generatedImage && (
              <div className="mt-auto pt-4">
                <Button
                  className="w-full btn-click bg-gradient-to-r from-amber-500 via-red-500 to-rose-500 hover:from-amber-600 hover:via-red-600 hover:to-rose-600 text-white font-medium shadow-lg border-amber-400/50"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-white" />
                  <span className="text-white">下一步</span>
                </Button>
              </div>
            )}
          </section>

          {/* 右侧栏：编辑 + 生成 */}
          <aside className="w-80 shrink-0 space-y-4 flex flex-col">
            <div className="sticky top-24 flex-1">
              <Tabs defaultValue="editor" className="w-full">
                {/* 给 Tabs 列表添加外框和背景 */}
                <TabsList className="grid w-full grid-cols-2 p-1 bg-amber-900/40 border border-amber-700/40 rounded-lg shadow-sm">
                  <TabsTrigger
                    value="editor"
                    className="text-sm data-[state=active]:bg-amber-800/50 data-[state=active]:chinese-text-gold data-[state=active]:shadow-sm rounded-md chinese-text-light"
                  >
                    元素编辑
                  </TabsTrigger>
                  <TabsTrigger
                    value="generate"
                    className="text-sm data-[state=active]:bg-amber-800/50 data-[state=active]:chinese-text-gold data-[state=active]:shadow-sm rounded-md chinese-text-light"
                  >
                    AI 生成
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="mt-4">
                  <ElementEditor />
                </TabsContent>

                <TabsContent value="generate" className="mt-4">
                  <SceneSelector />
                </TabsContent>
              </Tabs>

              {/* 纹样小知识 */}
              <Card className="mt-2 chinese-card-dark shadow-lg">
                <CardHeader className="pb-2 pt-3 chinese-card-header-dark">
                  <CardTitle className="text-sm flex items-center gap-2 chinese-text-gold">
                    📖 纹样小知识
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-3 px-3">
                  <p className="text-xs chinese-text-light leading-relaxed">
                    {selectedPatternConfig
                      ? `${selectedPatternConfig.name}：${selectedPatternConfig.description}`
                      : '在画布上选择或添加一个纹样元素，即可查看该纹样的文化寓意与历史渊源。'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      <footer className="chinese-footer-dark py-3 mt-auto">
        <div className="text-center text-xs chinese-text-light">
          <span>支持 GAN 356 i3 · Web Bluetooth · AI 图像生成</span>
        </div>
      </footer>
    </div>
  )
}
