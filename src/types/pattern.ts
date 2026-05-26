// 中国传统纹样元素类型定义

// 纹样元素类型
export type PatternType =
  | 'huiwen'        // 回纹
  | 'yunwen'        // 云纹
  | 'leiwen'        // 雷纹
  | 'ruyi'          // 如意纹
  | 'fangsheng'     // 方胜纹
  | 'panchang'      // 盘长纹
  | 'wanzi'         // 万字纹
  | 'lianxu'        // 连续纹
  | 'miaolong'      // 苗族几何龙纹
  | 'zangbajixiang' // 藏族八吉祥纹

// 元素变换状态
export interface ElementTransform {
  x: number
  y: number
  rotation: number      // 旋转角度（度）
  scale: number         // 缩放比例
  mirrorX: boolean      // 水平镜像
  mirrorY: boolean      // 垂直镜像
  skewX: number         // X轴倾斜
  skewY: number         // Y轴倾斜
}

// 画布上的元素
export interface PatternElement {
  id: string
  type: PatternType
  transform: ElementTransform
  color: string
  strokeWidth: number
  opacity: number
  size: number
}

// 魔方面定义
export type CubeFace = 'U' | 'R' | 'F' | 'D' | 'L' | 'B'

// 魔方转动方向
export type CubeDirection = 'CW' | 'CCW'  // 顺时针/逆时针

// 魔方移动事件
export interface CubeMoveEvent {
  face: CubeFace
  direction: CubeDirection
  move: string
  timestamp: number
}

// 魔方连接状态
export interface CubeConnectionState {
  isConnected: boolean
  deviceName: string | null
  batteryLevel: number | null
  lastMove: CubeMoveEvent | null
}

// 映射规则：魔方面 -> 元素变换
export interface MappingRule {
  face: CubeFace
  transformType: 'rotate' | 'mirror' | 'scale' | 'skew' | 'translate' | 'mirrorX' | 'mirrorY' | 'rotate180'
  value: number | boolean
  description: string
}

// 场景类型
export type SceneType = 'hat' | 'cup' | 'avatar' | 'tshirt' | 'poster' | 'phone-case'

// 场景配置
export interface SceneConfig {
  type: SceneType
  name: string
  description: string
  previewImage?: string
}

// 纹样配置
export interface PatternConfig {
  type: PatternType
  name: string
  description: string
  defaultColor: string
  complexity: number  // 1-3
}

// 纹样配置列表
export const PATTERN_CONFIGS: PatternConfig[] = [
  {
    type: 'huiwen',
    name: '回纹',
    description: '古代几何纹样，由回字形线条组成，象征连绵不断、吉利永长。回纹因形状像"回"字而得名，是最古老的几何装饰纹样之一。',
    defaultColor: '#8B4513',
    complexity: 1
  },
  {
    type: 'yunwen',
    name: '云纹',
    description: '流动优美的云形图案，寓意吉祥如意。云纹象征高升和如意，是古代吉祥图案的代表，常见于青铜器、陶瓷和建筑雕刻中。',
    defaultColor: '#4169E1',
    complexity: 2
  },
  {
    type: 'leiwen',
    name: '雷纹',
    description: '方折连续的雷形纹样，象征威严与力量。雷纹呈方折回旋状，如雷电交加之势，给人以庄重肃穆之感。',
    defaultColor: '#2F4F4F',
    complexity: 2
  },
  {
    type: 'ruyi',
    name: '如意纹',
    description: '形如灵芝或云头的装饰纹样，寓意心想事成、万事如意。如意纹头部呈云形或心形，柄部修长，是传统的吉祥图案。',
    defaultColor: '#DC143C',
    complexity: 2
  },
  {
    type: 'fangsheng',
    name: '方胜纹',
    description: '两个菱形相互叠压的传统纹样，寓意同心同德、同心合意。方胜是古代妇女的首饰，后演变为吉祥纹样。',
    defaultColor: '#9932CC',
    complexity: 1
  },
  {
    type: 'panchang',
    name: '盘长纹',
    description: '佛教八宝之一，线条回环贯穿、无始无终，象征永恒不灭。盘长结因其绵延不断的外形，寓意世代延续、长命百岁。',
    defaultColor: '#228B22',
    complexity: 3
  },
  {
    type: 'wanzi',
    name: '万字纹',
    description: '连续不断的万字形纹样，寓意万福万寿、吉祥云集。万字纹是佛教和道教中的吉祥符号，代表永恒的祝福。',
    defaultColor: '#FFD700',
    complexity: 2
  },
  {
    type: 'lianxu',
    name: '连续纹',
    description: '连续不断的几何纹样，可无限延伸，寓意生生不息、绵延不绝。连续纹常以二方或四方连续的形式出现。',
    defaultColor: '#008080',
    complexity: 3
  },
  {
    type: 'miaolong',
    name: '苗族几何龙纹',
    description: '苗族刺绣中常见的龙形几何纹样，以直线和折线构成抽象的龙形，象征祖先的庇护与力量。苗族龙纹造型独特，与汉族龙纹风格迥异，更显古朴神秘。',
    defaultColor: '#C41E3A',
    complexity: 3
  },
  {
    type: 'zangbajixiang',
    name: '藏族八吉祥纹',
    description: '藏传佛教的八种吉祥宝物纹饰，包括法轮、宝伞、双鱼、宝瓶、莲花、海螺、吉祥结、胜利幢。八吉祥纹象征智慧、圆满与福报，是藏族艺术中最常见的装饰题材。',
    defaultColor: '#FF8C00',
    complexity: 3
  }
]

// 基础纹样配置
export const BASE_PATTERN_CONFIGS = PATTERN_CONFIGS.filter(c =>
  ['huiwen', 'yunwen', 'leiwen', 'ruyi', 'fangsheng', 'panchang', 'wanzi', 'lianxu'].includes(c.type)
)

// 少数民族纹样配置
export const ETHNIC_PATTERN_CONFIGS = PATTERN_CONFIGS.filter(c =>
  ['miaolong', 'zangbajixiang'].includes(c.type)
)

// 默认映射规则
export const DEFAULT_MAPPING_RULES: MappingRule[] = [
  { face: 'U', transformType: 'translate', value: 10, description: '顶面转动：平移' },
  { face: 'R', transformType: 'mirrorX', value: true, description: '右面转动：水平翻转' },
  { face: 'F', transformType: 'rotate', value: 90, description: '前面转动：旋转90°' },
  { face: 'D', transformType: 'rotate180', value: 180, description: '底面转动：中心对称（旋转180°）' },
  { face: 'L', transformType: 'mirrorY', value: true, description: '左面转动：垂直翻转' },
  { face: 'B', transformType: 'scale', value: 1.2, description: '后面转动：缩放' }
]

// 场景配置
export const SCENE_CONFIGS: SceneConfig[] = [
  {
    type: 'hat',
    name: '帽子',
    description: '将图案应用到帽子设计中',
    previewImage: '/scenes/hat.png'
  },
  {
    type: 'cup',
    name: '杯子',
    description: '将图案应用到马克杯设计中',
    previewImage: '/scenes/cup.png'
  },
  {
    type: 'avatar',
    name: '头像',
    description: '生成个性化头像',
    previewImage: '/scenes/avatar.png'
  },
  {
    type: 'tshirt',
    name: 'T恤',
    description: '将图案应用到T恤设计中',
    previewImage: '/scenes/tshirt.png'
  },
  {
    type: 'poster',
    name: '海报',
    description: '生成艺术海报',
    previewImage: '/scenes/poster.png'
  },
  {
    type: 'phone-case',
    name: '手机壳',
    description: '将图案应用到手机壳设计中',
    previewImage: '/scenes/phone-case.png'
  }
]
