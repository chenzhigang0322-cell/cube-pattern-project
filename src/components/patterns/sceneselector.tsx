'use client'

import { useState } from 'react'
import { usePatternStore } from '@/store/pattern-store'
import { SCENE_CONFIGS, SceneType, PATTERN_CONFIGS, PatternType } from '@/types/pattern'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Sparkles, Loader2, Shirt, User, Image as ImageIcon, Smartphone, Crown, Coffee, Wand2, Settings2, Smile, Leaf } from 'lucide-react'

// 场景图标映射
const sceneIcons: Record<SceneType, React.ReactNode> = {
  hat: <Crown className="h-5 w-5" />,
  cup: <Coffee className="h-5 w-5" />,
  avatar: <User className="h-5 w-5" />,
  tshirt: <Shirt className="h-5 w-5" />,
  poster: <ImageIcon className="h-5 w-5" />,
  'phone-case': <Smartphone className="h-5 w-5" />
}

const colorOptions = [
  { value: 'warm', label: '暖色调' },
  { value: 'cool', label: '冷色调' },
  { value: 'vivid', label: '鲜艳' },
  { value: 'elegant', label: '淡雅' },
  { value: 'bnw', label: '黑白' }
]

const styleOptions = [
  { value: 'modern', label: '现代简约' },
  { value: 'classical', label: '传统古典' },
  { value: 'ethnic', label: '民族风' },
  { value: 'ink', label: '水墨意境' },
  { value: 'palace', label: '宫廷华丽' }
]

const ratioOptions = [
  { value: '1:1', label: '1:1', size: '1024*1024' },
  { value: '16:9', label: '16:9', size: '1280*720' },
  { value: '9:16', label: '9:16', size: '720*1280' },
  { value: '3:4', label: '3:4', size: '768*1024' }
]

const moodOptions = [
  { value: 'serene', label: '宁静' },
  { value: 'joyful', label: '喜悦' },
  { value: 'nostalgic', label: '思念' },
  { value: 'blessing', label: '祝福' },
  { value: 'prayer', label: '祈愿' },
  { value: 'retro', label: '怀旧' },
  { value: 'celebration', label: '庆典' },
  { value: 'elegant', label: '优雅' }
]

const itemOptions = [
  // 植物
  { value: 'lotus', label: '莲花', group: '植物' },
  { value: 'peony', label: '牡丹', group: '植物' },
  { value: 'bamboo', label: '竹子', group: '植物' },
  { value: 'plum', label: '梅花', group: '植物' },
  { value: 'orchid', label: '兰花', group: '植物' },
  { value: 'chrysanthemum', label: '菊花', group: '植物' },
  { value: 'pine', label: '松树', group: '植物' },
  { value: 'lotus-leaf', label: '荷叶', group: '植物' },
  // 建筑
  { value: 'pavilion', label: '亭台', group: '建筑' },
  { value: 'tower', label: '楼阁', group: '建筑' },
  { value: 'door-window', label: '门窗', group: '建筑' },
  { value: 'eaves', label: '屋檐', group: '建筑' },
  { value: 'screen', label: '屏风', group: '建筑' },
  { value: 'archway', label: '牌坊', group: '建筑' },
  { value: 'corridor-bridge', label: '廊桥', group: '建筑' },
  { value: 'pagoda', label: '宝塔', group: '建筑' },
  // 动物
  { value: 'dragon-phoenix', label: '龙凤', group: '动物' },
  { value: 'qilin', label: '麒麟', group: '动物' },
  { value: 'koi', label: '锦鲤', group: '动物' },
  { value: 'crane', label: '仙鹤', group: '动物' },
  { value: 'butterfly', label: '蝴蝶', group: '动物' },
  { value: 'mandarin-duck', label: '鸳鸯', group: '动物' },
  { value: 'pixiu', label: '貔貅', group: '动物' },
  { value: 'peacock', label: '孔雀', group: '动物' }
]

// 物品寓意映射
const itemMeanings: Record<string, string> = {
  'lotus': '出淤泥而不染，象征纯洁与超脱',
  'peony': '花中之王，象征富贵繁荣与幸福美满',
  'bamboo': '虚心有节，象征节节高升与坚韧不屈',
  'plum': '凌寒独放，象征坚韧不拔与高洁品格',
  'orchid': '幽香清远，象征君子品格与高雅淡泊',
  'chrysanthemum': '傲霜斗雪，象征长寿安康与隐逸情怀',
  'pine': '四季常青，象征长寿坚贞与不屈风骨',
  'lotus-leaf': '清雅脱俗，象征和合美满与清净无尘',
  'pavilion': '驻足休憩之所，象征诗意栖居与超然物外',
  'tower': '登高望远，象征志向高远与眼界开阔',
  'door-window': '开合之间，象征通达包容与内外相连',
  'eaves': '遮风挡雨，象征庇护安宁与家的温暖',
  'screen': '隔而不断，象征含蓄内敛与雅致格调',
  'archway': '功德铭记，象征荣耀传承与家族昌盛',
  'corridor-bridge': '连接两岸，象征缘分通达与美好相遇',
  'pagoda': '镇邪祈福，象征智慧超脱与心灵宁静',
  'dragon-phoenix': '祥瑞至尊，象征权势和谐与美满姻缘',
  'qilin': '仁兽降瑞，象征祥瑞太平与仁慈宽厚',
  'koi': '逆流而上，象征好运跃升与飞黄腾达',
  'crane': '仙风道骨，象征长寿高雅与超凡脱俗',
  'butterfly': '破茧成蝶，象征蜕变新生与自由美好',
  'mandarin-duck': '成双成对，象征爱情忠贞与夫妻恩爱',
  'pixiu': '只进不出，象征招财纳福与聚财守财',
  'peacock': '开屏展姿，象征吉祥如意与华贵端庄'
}

// 纹样核心感觉映射
const patternFeelings: Record<string, string> = {
  'huiwen': '回环往复、秩序井然，寓意连绵不断、吉利永长',
  'yunwen': '流动飘逸、变幻莫测，寓意吉祥如意、高升如意',
  'leiwen': '方折回旋、庄重威严，象征力量与不可侵犯',
  'ruyi': '曲线优美、灵芝形态，寓意心想事成、万事如意',
  'fangsheng': '菱形交错、同心叠压，象征同心同德、永结同心',
  'panchang': '线条回环、无始无终，象征永恒不灭、世代延续',
  'wanzi': '旋转展开、万福汇聚，寓意万福万寿、吉祥云集',
  'lianxu': '连绵不绝、循环往复，象征生生不息、绵延不绝',
  'miaolong': '几何折线、古朴神秘，象征祖先庇护与民族力量',
  'zangbajixiang': '八宝汇聚、法轮常转，象征智慧圆满与福报绵长'
}

// 生成物品图解读
function generateItemDescription(itemValue: string, patternTypes: PatternType[]) {
  const itemMap: Record<string, string> = {
    'lotus': '莲花', 'peony': '牡丹', 'bamboo': '竹子', 'plum': '梅花',
    'orchid': '兰花', 'chrysanthemum': '菊花', 'pine': '松树', 'lotus-leaf': '荷叶',
    'pavilion': '亭台', 'tower': '楼阁', 'door-window': '门窗', 'eaves': '屋檐',
    'screen': '屏风', 'archway': '牌坊', 'corridor-bridge': '廊桥', 'pagoda': '宝塔',
    'dragon-phoenix': '龙凤', 'qilin': '麒麟', 'koi': '锦鲤', 'crane': '仙鹤',
    'butterfly': '蝴蝶', 'mandarin-duck': '鸳鸯', 'pixiu': '貔貅', 'peacock': '孔雀'
  }

  const itemName = itemMap[itemValue] || '作品'
  const itemMeaning = itemMeanings[itemValue] || '承载深厚的文化意蕴'

  // 获取画布上的纹样信息
  const primaryType = patternTypes[0]
  const patternConfig = primaryType ? PATTERN_CONFIGS.find(p => p.type === primaryType) : null
  const patternName = patternConfig?.name || '传统纹样'
  const patternFeeling = primaryType ? (patternFeelings[primaryType] || patternConfig?.description || '蕴含深厚的文化内涵') : '蕴含深厚的文化内涵'

  // 结合语句库
  const connections: Record<string, string[]> = {
    'huiwen': ['回纹的循环往复仿佛为作品注入了生生不息的活力', '回纹的连绵不断与物品的寓意相互呼应，增添了绵延不绝的祝福'],
    'yunwen': ['云纹的飘逸灵动为作品赋予了升腾向上的气韵', '云纹的流动美感与物品的寓意交融，营造出祥瑞高升的意境'],
    'leiwen': ['雷纹的庄重威严为作品增添了一份不可侵犯的力量感', '雷纹的方折刚劲与物品的寓意相合，传递出刚毅坚定的精神'],
    'ruyi': ['如意纹的优美曲线为作品带来了心想事成的美好祝愿', '如意纹的灵芝形态与物品的寓意相得益彰，洋溢着吉祥如意的气息'],
    'fangsheng': ['方胜纹的交错叠压为作品赋予了同心同德的深层寓意', '方胜纹的菱形对称与物品的寓意交织，象征着和谐圆满'],
    'panchang': ['盘长纹的回环贯穿为作品注入了永恒不灭的精神力量', '盘长纹的绵延不断与物品的寓意相辅相成，寓意世代延续'],
    'wanzi': ['万字纹的旋转汇聚为作品带来了万福万寿的吉祥祝福', '万字纹的万福汇聚与物品的寓意交融，洋溢着无尽的祥瑞'],
    'lianxu': ['连续纹的循环往复为作品赋予了生生不息的蓬勃朝气', '连续纹的绵延不绝与物品的寓意相合，象征着永续传承'],
    'miaolong': ['苗族龙纹的几何古朴为作品增添了神秘而原始的民族力量', '苗族龙纹的独特造型与物品的寓意交融，传递出祖先庇护的深意'],
    'zangbajixiang': ['八吉祥纹的八宝汇聚为作品注入了智慧圆满的精神内涵', '八吉祥纹的法轮常转与物品的寓意相辅相成，象征着福报绵长']
  }

  const connection = primaryType ? (connections[primaryType]?.[Math.floor(Math.random() * connections[primaryType].length)] || '') : ''

  return `画布上的${patternName}，${patternFeeling}。${itemName}，${itemMeaning}。${connection}，整体呈现出传统美学与吉祥寓意的完美交融，令人心生敬意与欢喜。`
}

export function SceneSelector() {
  const { selectedScene, setSelectedScene, elements, isGenerating, setGeneratedImage, setIsGenerating } = usePatternStore()
  const [colorTone, setColorTone] = useState('warm')
  const [artStyle, setArtStyle] = useState('modern')
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [mood, setMood] = useState('serene')
  const [item, setItem] = useState('lotus')
  const [itemDescription, setItemDescription] = useState<string | null>(null)

  // 生成AI图像
  const handleGenerate = async () => {
    if (elements.length === 0) {
      alert('请先在画布上添加一些纹样元素')
      return
    }

    if (!selectedScene) {
      alert('请先选择一个应用场景')
      return
    }

    setIsGenerating(true)

    try {
      const canvas = document.querySelector('canvas')
      if (!canvas) throw new Error('找不到画布')

      const imageData = canvas.toDataURL('image/png')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          scene: selectedScene,
          colorTone,
          artStyle,
          aspectRatio,
          mood,
          item
        })
      })

      if (!response.ok) throw new Error('生成失败')

      const data = await response.json()
      setGeneratedImage(data.image)

      // 获取画布上的纹样类型
      const patternTypes = elements.map(el => el.type)
      // 生成本地物品图解读
      setItemDescription(generateItemDescription(item, patternTypes))

    } catch (error) {
      console.error('Generation error:', error)
      alert(error instanceof Error ? error.message : '生成失败')
    } finally {
      setIsGenerating(false)
    }
  }

  // 按分组渲染物品选项
  const plantOptions = itemOptions.filter(o => o.group === '植物')
  const buildingOptions = itemOptions.filter(o => o.group === '建筑')
  const animalOptions = itemOptions.filter(o => o.group === '动物')

  return (
    <div className="space-y-2">
      {/* 场景选择 */}
      <Card className="chinese-border chinese-shadow chinese-card-dark">
        <CardHeader className="pb-2 pt-3 chinese-card-header-dark">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-100">
            <Wand2 className="h-4 w-4" />
            选择应用场景
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-3 px-3">
          <div className="grid grid-cols-3 gap-1.5">
            {SCENE_CONFIGS.map((config) => (
              <Button
                key={config.type}
                variant="outline"
                className={cn(
                  "h-auto py-2 flex-col gap-0.5 text-[11px] btn-click border-amber-700/40",
                  selectedScene === config.type
                    ? "ring-2 ring-amber-400 bg-gradient-to-br from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 !text-white border-transparent [&_svg]:text-white"
                    : "bg-stone-900/50 text-amber-100 hover:bg-amber-900/40 hover:text-amber-50"
                )}
                onClick={() => setSelectedScene(config.type)}
              >
                {sceneIcons[config.type]}
                <span>{config.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 生成设置 */}
      <Card className="chinese-border chinese-shadow chinese-card-dark">
        <CardHeader className="pb-2 pt-3 chinese-card-header-dark">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-100">
            <Settings2 className="h-4 w-4" />
            生成设置
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2 pb-3 px-3 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-200/80 w-14 shrink-0">颜色倾向</label>
            <select
              value={colorTone}
              onChange={(e) => setColorTone(e.target.value)}
              className="flex-1 h-8 px-2 text-xs rounded-md border border-amber-700/40 bg-stone-900/50 text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            >
              {colorOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-200/80 w-14 shrink-0">艺术风格</label>
            <select
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value)}
              className="flex-1 h-8 px-2 text-xs rounded-md border border-amber-700/40 bg-stone-900/50 text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            >
              {styleOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-200/80 w-14 shrink-0">画面比例</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="flex-1 h-8 px-2 text-xs rounded-md border border-amber-700/40 bg-stone-900/50 text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            >
              {ratioOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-200/80 w-14 shrink-0 flex items-center gap-1">
              <Smile className="h-3 w-3" />心情
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="flex-1 h-8 px-2 text-xs rounded-md border border-amber-700/40 bg-stone-900/50 text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            >
              {moodOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-amber-200/80 w-14 shrink-0 flex items-center gap-1">
              <Leaf className="h-3 w-3" />元素
            </label>
            <select
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="flex-1 h-8 px-2 text-xs rounded-md border border-amber-700/40 bg-stone-900/50 text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            >
              <optgroup label="植物" className="bg-stone-800 text-amber-100">
                {plantOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">{opt.label}</option>
                ))}
              </optgroup>
              <optgroup label="建筑" className="bg-stone-800 text-amber-100">
                {buildingOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">{opt.label}</option>
                ))}
              </optgroup>
              <optgroup label="动物" className="bg-stone-800 text-amber-100">
                {animalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-stone-800 text-amber-100">{opt.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 生成按钮 */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || elements.length === 0 || !selectedScene}
        className="w-full btn-click bg-gradient-to-r from-amber-500 via-red-500 to-rose-500 hover:from-amber-600 hover:via-red-600 hover:to-rose-600 text-white font-medium shadow-lg border-amber-400/50 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
            <span className="text-white">AI生成中...</span>
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2 text-white" />
            <span className="text-white">生成创意设计</span>
          </>
        )}
      </Button>

      {/* 物品图解读 */}
      {itemDescription && (
        <Card className="chinese-border chinese-shadow chinese-card-dark">
          <CardHeader className="pb-2 pt-3 chinese-card-header-dark">
            <CardTitle className="text-sm flex items-center gap-2 chinese-text-gold">
              <Sparkles className="h-4 w-4" />
              作品解读
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 pb-3 px-3">
            <p className="text-xs chinese-text-light leading-relaxed">
              {itemDescription}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
