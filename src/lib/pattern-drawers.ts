// 中国传统纹样绘制函数
import { PatternType, ElementTransform } from '@/types/pattern'

interface DrawContext {
  ctx: CanvasRenderingContext2D
  x: number
  y: number
  size: number
  color: string
  strokeWidth: number
  opacity: number
  transform: ElementTransform
}

// 应用变换到画布上下文
function applyTransform(ctx: CanvasRenderingContext2D, transform: ElementTransform, centerX: number, centerY: number) {
  ctx.translate(centerX, centerY)
  ctx.rotate((transform.rotation * Math.PI) / 180)
  ctx.scale(transform.scale * (transform.mirrorX ? -1 : 1), transform.scale * (transform.mirrorY ? -1 : 1))
  ctx.transform(1, Math.tan((transform.skewY * Math.PI) / 180), Math.tan((transform.skewX * Math.PI) / 180), 1, 0, 0)
  ctx.translate(-centerX, -centerY)
}

// 绘制回纹
export function drawHuiwen(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  const unit = size / 4
  
  // 外圈回纹
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + size, y)
  ctx.lineTo(x + size, y + size)
  ctx.lineTo(x, y + size)
  ctx.lineTo(x, y + unit)
  ctx.moveTo(x + unit, y + unit)
  ctx.lineTo(x + unit, y + size - unit)
  ctx.stroke()
  
  // 内圈回纹
  ctx.beginPath()
  ctx.moveTo(x + unit * 2, y + unit)
  ctx.lineTo(x + size - unit, y + unit)
  ctx.lineTo(x + size - unit, y + size - unit)
  ctx.lineTo(x + unit * 2, y + size - unit)
  ctx.lineTo(x + unit * 2, y + unit * 2)
  ctx.moveTo(x + unit * 3, y + unit * 2)
  ctx.lineTo(x + unit * 3, y + size - unit * 2)
  ctx.stroke()
  
  ctx.restore()
}

// 绘制云纹
export function drawYunwen(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  // 绘制螺旋云纹
  const spiralCount = 3
  const baseRadius = size / 6
  
  for (let i = 0; i < spiralCount; i++) {
    const offsetX = (i - 1) * size / 3
    const offsetY = (i === 1) ? 0 : (i === 0 ? -size / 6 : size / 6)
    
    ctx.beginPath()
    for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
      const r = baseRadius + angle * 3
      const px = centerX + offsetX + Math.cos(angle) * r
      const py = centerY + offsetY + Math.sin(angle) * r
      if (angle === 0) {
        ctx.moveTo(px, py)
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.stroke()
  }
  
  ctx.restore()
}

// 绘制雷纹
export function drawLeiwen(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  const unit = size / 8
  
  // 绘制锯齿状雷纹
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const startX = x + i * unit * 2
    ctx.moveTo(startX, y)
    ctx.lineTo(startX + unit, y + unit)
    ctx.lineTo(startX + unit * 2, y)
  }
  ctx.stroke()
  
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const startX = x + i * unit * 2
    ctx.moveTo(startX, y + size)
    ctx.lineTo(startX + unit, y + size - unit)
    ctx.lineTo(startX + unit * 2, y + size)
  }
  ctx.stroke()
  
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const startY = y + i * unit * 2
    ctx.moveTo(x, startY)
    ctx.lineTo(x + unit, startY + unit)
    ctx.lineTo(x, startY + unit * 2)
  }
  ctx.stroke()
  
  ctx.beginPath()
  for (let i = 0; i < 4; i++) {
    const startY = y + i * unit * 2
    ctx.moveTo(x + size, startY)
    ctx.lineTo(x + size - unit, startY + unit)
    ctx.lineTo(x + size, startY + unit * 2)
  }
  ctx.stroke()
  
  ctx.restore()
}

// 绘制如意纹
export function drawRuyi(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  // 绘制如意头部（心形）
  ctx.beginPath()
  ctx.moveTo(centerX, y + size * 0.3)
  ctx.bezierCurveTo(
    centerX - size * 0.3, y,
    x, y + size * 0.3,
    centerX, y + size * 0.6
  )
  ctx.bezierCurveTo(
    x + size, y + size * 0.3,
    centerX + size * 0.3, y,
    centerX, y + size * 0.3
  )
  ctx.stroke()
  
  // 绘制如意柄
  ctx.beginPath()
  ctx.moveTo(centerX, y + size * 0.6)
  ctx.lineTo(centerX, y + size)
  ctx.stroke()
  
  ctx.restore()
}

// 绘制方胜纹
export function drawFangsheng(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  const halfSize = size / 3
  const offset = size / 6
  
  // 第一个菱形
  ctx.beginPath()
  ctx.moveTo(centerX - offset, centerY - halfSize)
  ctx.lineTo(centerX - offset + halfSize, centerY)
  ctx.lineTo(centerX - offset, centerY + halfSize)
  ctx.lineTo(centerX - offset - halfSize, centerY)
  ctx.closePath()
  ctx.stroke()
  
  // 第二个菱形（偏移）
  ctx.beginPath()
  ctx.moveTo(centerX + offset, centerY - halfSize)
  ctx.lineTo(centerX + offset + halfSize, centerY)
  ctx.lineTo(centerX + offset, centerY + halfSize)
  ctx.lineTo(centerX + offset - halfSize, centerY)
  ctx.closePath()
  ctx.stroke()
  
  ctx.restore()
}

// 绘制盘长纹
export function drawPanchang(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  const unit = size / 4
  
  // 绘制盘长结的基本形状
  ctx.beginPath()
  // 上部
  ctx.moveTo(centerX - unit, y + unit)
  ctx.lineTo(centerX - unit * 2, y + unit)
  ctx.lineTo(centerX - unit * 2, y + unit * 2)
  ctx.lineTo(centerX - unit, y + unit * 2)
  
  // 右侧
  ctx.moveTo(centerX + unit, y + unit)
  ctx.lineTo(centerX + unit * 2, y + unit)
  ctx.lineTo(centerX + unit * 2, y + unit * 2)
  ctx.lineTo(centerX + unit, y + unit * 2)
  
  // 下部
  ctx.moveTo(centerX - unit, y + unit * 2)
  ctx.lineTo(centerX - unit, y + unit * 3)
  ctx.lineTo(centerX + unit, y + unit * 3)
  ctx.lineTo(centerX + unit, y + unit * 2)
  
  // 中间交叉
  ctx.moveTo(centerX - unit, y + unit)
  ctx.lineTo(centerX + unit, y + unit * 2)
  ctx.moveTo(centerX + unit, y + unit)
  ctx.lineTo(centerX - unit, y + unit * 2)
  
  ctx.stroke()
  
  ctx.restore()
}

// 绘制万字纹
export function drawWanzi(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  const arm = size / 3
  
  // 绘制卍字符
  ctx.beginPath()
  // 上臂
  ctx.moveTo(centerX, centerY - arm)
  ctx.lineTo(centerX, centerY)
  ctx.lineTo(centerX + arm, centerY)
  // 右臂
  ctx.moveTo(centerX + arm, centerY)
  ctx.lineTo(centerX, centerY)
  ctx.lineTo(centerX, centerY + arm)
  // 下臂
  ctx.moveTo(centerX, centerY + arm)
  ctx.lineTo(centerX, centerY)
  ctx.lineTo(centerX - arm, centerY)
  // 左臂
  ctx.moveTo(centerX - arm, centerY)
  ctx.lineTo(centerX, centerY)
  ctx.lineTo(centerX, centerY - arm)
  ctx.stroke()
  
  // 添加端点装饰
  const endSize = arm / 3
  ctx.beginPath()
  ctx.rect(centerX - endSize/2, centerY - arm - endSize/2, endSize, endSize)
  ctx.rect(centerX + arm - endSize/2, centerY - endSize/2, endSize, endSize)
  ctx.rect(centerX - endSize/2, centerY + arm - endSize/2, endSize, endSize)
  ctx.rect(centerX - arm - endSize/2, centerY - endSize/2, endSize, endSize)
  ctx.stroke()
  
  ctx.restore()
}

// 绘制连续纹
export function drawLianxu(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx
  
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)
  
  const unit = size / 5
  
  // 绘制波浪形连续纹
  ctx.beginPath()
  for (let i = 0; i <= 4; i++) {
    const px = x + i * unit
    const py = y + size / 2 + Math.sin(i * Math.PI) * unit * 0.5
    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.quadraticCurveTo(
        px - unit / 2, 
        py + (Math.sin((i - 0.5) * Math.PI) * unit * 0.8),
        px, 
        py
      )
    }
  }
  ctx.stroke()
  
  // 第二层波浪
  ctx.beginPath()
  for (let i = 0; i <= 4; i++) {
    const px = x + i * unit
    const py = y + size / 2 + unit + Math.sin(i * Math.PI + Math.PI / 4) * unit * 0.4
    if (i === 0) {
      ctx.moveTo(px, py)
    } else {
      ctx.quadraticCurveTo(
        px - unit / 2, 
        py + (Math.sin((i - 0.5) * Math.PI + Math.PI / 4) * unit * 0.6),
        px, 
        py
      )
    }
  }
  ctx.stroke()
  
  ctx.restore()
}

// 绘制苗族几何龙纹
export function drawMiaolong(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'square'
  ctx.lineJoin = 'miter'

  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)

  const u = size / 10

  // 龙头（菱形头部）
  ctx.beginPath()
  ctx.moveTo(centerX, y + u)
  ctx.lineTo(centerX + u * 1.5, y + u * 2.5)
  ctx.lineTo(centerX, y + u * 4)
  ctx.lineTo(centerX - u * 1.5, y + u * 2.5)
  ctx.closePath()
  ctx.stroke()

  // 龙角
  ctx.beginPath()
  ctx.moveTo(centerX - u * 0.5, y + u * 1.5)
  ctx.lineTo(centerX - u * 1.2, y)
  ctx.moveTo(centerX + u * 0.5, y + u * 1.5)
  ctx.lineTo(centerX + u * 1.2, y)
  ctx.stroke()

  // 龙身（折线几何形）
  ctx.beginPath()
  ctx.moveTo(centerX, y + u * 4)
  ctx.lineTo(centerX + u * 2, y + u * 5)
  ctx.lineTo(centerX + u, y + u * 6.5)
  ctx.lineTo(centerX + u * 3, y + u * 7.5)
  ctx.lineTo(centerX + u * 0.5, y + u * 9)
  ctx.lineTo(centerX - u * 0.5, y + u * 9)
  ctx.lineTo(centerX - u * 3, y + u * 7.5)
  ctx.lineTo(centerX - u, y + u * 6.5)
  ctx.lineTo(centerX - u * 2, y + u * 5)
  ctx.lineTo(centerX, y + u * 4)
  ctx.stroke()

  // 龙尾
  ctx.beginPath()
  ctx.moveTo(centerX + u * 0.5, y + u * 9)
  ctx.lineTo(centerX + u * 2, y + size - u)
  ctx.lineTo(centerX, y + size)
  ctx.lineTo(centerX - u * 2, y + size - u)
  ctx.lineTo(centerX - u * 0.5, y + u * 9)
  ctx.stroke()

  // 龙鳞装饰（几何点）
  ctx.beginPath()
  ctx.moveTo(centerX + u * 0.5, y + u * 5.5)
  ctx.lineTo(centerX + u * 0.5, y + u * 6)
  ctx.moveTo(centerX - u * 0.5, y + u * 5.5)
  ctx.lineTo(centerX - u * 0.5, y + u * 6)
  ctx.moveTo(centerX, y + u * 7)
  ctx.lineTo(centerX, y + u * 7.5)
  ctx.stroke()

  ctx.restore()
}

// 绘制藏族八吉祥纹（简化法轮）
export function drawZangbajixiang(drawCtx: DrawContext) {
  const { ctx, x, y, size, color, strokeWidth, opacity, transform } = drawCtx

  ctx.save()
  ctx.globalAlpha = opacity
  ctx.strokeStyle = color
  ctx.lineWidth = strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const centerX = x + size / 2
  const centerY = y + size / 2
  applyTransform(ctx, transform, centerX, centerY)

  const r = size / 3
  const spokeCount = 8

  // 外圈
  ctx.beginPath()
  ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
  ctx.stroke()

  // 内圈
  ctx.beginPath()
  ctx.arc(centerX, centerY, r * 0.35, 0, Math.PI * 2)
  ctx.stroke()

  // 八根辐条（象征八吉祥）
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2
    const x1 = centerX + Math.cos(angle) * r * 0.35
    const y1 = centerY + Math.sin(angle) * r * 0.35
    const x2 = centerX + Math.cos(angle) * r * 0.85
    const y2 = centerY + Math.sin(angle) * r * 0.85
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 装饰性小圆点（八吉祥符号的抽象表示）
  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2 + Math.PI / spokeCount
    const cx = centerX + Math.cos(angle) * r * 0.6
    const cy = centerY + Math.sin(angle) * r * 0.6
    ctx.beginPath()
    ctx.arc(cx, cy, r * 0.06, 0, Math.PI * 2)
    ctx.stroke()
  }

  // 中心莲花轮廓
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const px = centerX + Math.cos(angle) * r * 0.2
    const py = centerY + Math.sin(angle) * r * 0.2
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.stroke()

  ctx.restore()
}

// 纹样绘制映射
export const patternDrawers: Record<PatternType, (ctx: DrawContext) => void> = {
  huiwen: drawHuiwen,
  yunwen: drawYunwen,
  leiwen: drawLeiwen,
  ruyi: drawRuyi,
  fangsheng: drawFangsheng,
  panchang: drawPanchang,
  wanzi: drawWanzi,
  lianxu: drawLianxu,
  miaolong: drawMiaolong,
  zangbajixiang: drawZangbajixiang
}

// 绘制元素到画布
export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: {
    type: PatternType
    transform: ElementTransform
    color: string
    strokeWidth: number
    opacity: number
    size: number
  },
  offsetX: number = 0,
  offsetY: number = 0
) {
  const drawCtx: DrawContext = {
    ctx,
    x: element.transform.x + offsetX,
    y: element.transform.y + offsetY,
    size: element.size,
    color: element.color,
    strokeWidth: element.strokeWidth,
    opacity: element.opacity,
    transform: element.transform
  }
  
  const drawer = patternDrawers[element.type]
  if (drawer) {
    drawer(drawCtx)
  }
}
