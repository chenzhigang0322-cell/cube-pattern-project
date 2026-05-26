import { create } from 'zustand'
import {
  PatternElement,
  CubeConnectionState,
  MappingRule,
  SceneType,
  ElementTransform,
  PatternType,
  DEFAULT_MAPPING_RULES,
  PATTERN_CONFIGS
} from '@/types/pattern'

interface PatternStore {
  // 画布元素
  elements: PatternElement[]
  selectedElementId: string | null

  // 魔方连接状态
  cubeConnection: CubeConnectionState

  // 映射规则
  mappingRules: MappingRule[]

  // 当前选择的场景
  selectedScene: SceneType | null

  // AI生成结果
  generatedImage: string | null
  isGenerating: boolean

  // 操作方法
  addElement: (type: PatternType, x: number, y: number) => void
  removeElement: (id: string) => void
  updateElementTransform: (id: string, transform: Partial<ElementTransform>) => void
  selectElement: (id: string | null) => void
  clearCanvas: () => void

  // 魔方相关
  setCubeConnection: (state: Partial<CubeConnectionState>) => void
  applyCubeMove: (face: string, direction: number) => void

  // 映射规则
  updateMappingRule: (face: string, rule: Partial<MappingRule>) => void

  // 场景选择
  setSelectedScene: (scene: SceneType | null) => void

  // AI生成
  setGeneratedImage: (image: string | null) => void
  setIsGenerating: (isGenerating: boolean) => void
  clearGeneratedImage: () => void
}

// 生成唯一ID
const generateId = () => Math.random().toString(36).substring(2, 9)

// 默认元素变换
const defaultTransform: ElementTransform = {
  x: 0,
  y: 0,
  rotation: 0,
  scale: 1,
  mirrorX: false,
  mirrorY: false,
  skewX: 0,
  skewY: 0
}

export const usePatternStore = create<PatternStore>((set, get) => ({
  // 初始状态
  elements: [],
  selectedElementId: null,
  cubeConnection: {
    isConnected: false,
    deviceName: null,
    batteryLevel: null,
    lastMove: null
  },
  mappingRules: DEFAULT_MAPPING_RULES,
  selectedScene: null,
  generatedImage: null,
  isGenerating: false,

  // 添加元素
  addElement: (type, x, y) => {
    const config = PATTERN_CONFIGS.find(p => p.type === type)
    const newElement: PatternElement = {
      id: generateId(),
      type,
      transform: { ...defaultTransform, x, y },
      color: config?.defaultColor || '#333333',
      strokeWidth: 2,
      opacity: 1,
      size: 80
    }
    set(state => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id
    }))
  },

  // 删除元素
  removeElement: (id) => {
    set(state => ({
      elements: state.elements.filter(el => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
    }))
  },

  // 更新元素变换
  updateElementTransform: (id, transform) => {
    set(state => ({
      elements: state.elements.map(el =>
        el.id === id
          ? { ...el, transform: { ...el.transform, ...transform } }
          : el
      )
    }))
  },

  // 选择元素
  selectElement: (id) => {
    set({ selectedElementId: id })
  },

  // 清空画布
  clearCanvas: () => {
    set({ elements: [], selectedElementId: null })
  },

  // 设置魔方连接状态
  setCubeConnection: (connectionState) => {
    set(state => ({
      cubeConnection: { ...state.cubeConnection, ...connectionState }
    }))
  },

  // 应用魔方移动到选中的元素
  applyCubeMove: (face, direction) => {
    const state = get()
    const selectedId = state.selectedElementId

    if (!selectedId) return

    const rule = state.mappingRules.find(r => r.face === face)
    if (!rule) return

    // 获取当前选中的元素
    const originalElement = state.elements.find(el => el.id === selectedId)
    if (!originalElement) return

    // 创建一个深拷贝
    const newElement: PatternElement = {
      ...originalElement,
      id: generateId(),
      transform: { ...originalElement.transform }
    }

    // 方向乘数：顺时针为1，逆时针为-1
    const directionMultiplier = direction === 0 ? 1 : -1

    switch (rule.transformType) {
      case 'rotate':
        const rotateValue = (rule.value as number) * directionMultiplier
        newElement.transform.rotation += rotateValue
        break

      case 'mirror':
        if (face === 'U') {
          newElement.transform.mirrorX = !newElement.transform.mirrorX
        } else if (face === 'D') {
          newElement.transform.mirrorY = !newElement.transform.mirrorY
        }
        break

      case 'scale':
        const scaleValue = directionMultiplier > 0 ? (rule.value as number) : (1 / (rule.value as number))
        newElement.transform.scale *= scaleValue
        break

      case 'skew':
        const skewValue = (rule.value as number) * directionMultiplier
        newElement.transform.skewX += skewValue
        break

      case 'translate':
        const translateValue = (rule.value as number) * directionMultiplier
        newElement.transform.x += translateValue
        break

      case 'mirrorX':
        newElement.transform.mirrorX = !newElement.transform.mirrorX
        break

      case 'mirrorY':
        newElement.transform.mirrorY = !newElement.transform.mirrorY
        break

      case 'rotate180':
        const rotate180Value = (rule.value as number) * directionMultiplier
        newElement.transform.rotation += rotate180Value
        break
    }

    // 将新元素添加到元素列表中，并设置为新选中的元素
    set(state => ({
      elements: [...state.elements, newElement],
      selectedElementId: newElement.id
    }))
  },

  // 更新映射规则
  updateMappingRule: (face, ruleUpdate) => {
    set(state => ({
      mappingRules: state.mappingRules.map(r =>
        r.face === face ? { ...r, ...ruleUpdate } : r
      )
    }))
  },

  // 设置选择的场景
  setSelectedScene: (scene) => {
    set({ selectedScene: scene })
  },

  // 设置生成的图像
  setGeneratedImage: (image) => {
    set({ generatedImage: image })
  },

  // 设置生成状态
  setIsGenerating: (isGenerating) => {
    set({ isGenerating })
  },

  // 清空生成的图像
  clearGeneratedImage: () => {
    set({ generatedImage: null })
  }
}))
