import { NextRequest, NextResponse } from 'next/server'

interface QwenImageResponse {
  output: {
    choices: Array<{
      finish_reason: string
      message: {
        role: string
        content: Array<{
          image: string
        }>
      }
    }>
  }
  usage: {
    image_count: number
    width: number
    height: number
  }
  request_id: string
}

export async function POST(request: NextRequest) {
  try {
    const { imageData, scene, colorTone, artStyle, aspectRatio, mood, item } = await request.json()

    if (!imageData) {
      return NextResponse.json({ error: '缺少图像数据' }, { status: 400 })
    }

    // 场景描述映射
    const sceneDescriptions: Record<string, string> = {
      hat: '帽子设计，图案印在棒球帽或渔夫帽上',
      cup: '马克杯设计，图案印在陶瓷杯表面',
      avatar: '社交媒体头像，圆形裁剪',
      tshirt: 'T恤印花设计，图案印在白色T恤正面',
      poster: '艺术海报，适合装裱展示',
      'phone-case': '手机壳设计，图案覆盖手机背面'
    }

    // 颜色倾向映射
    const colorDescriptions: Record<string, string> = {
      warm: '暖色调为主，如红、橙、金等温暖配色',
      cool: '冷色调为主，如蓝、青、紫等清冷配色',
      vivid: '色彩鲜艳饱和，对比强烈',
      elegant: '色彩淡雅柔和，低饱和度',
      bnw: '黑白灰为主，极简 monochrome 风格'
    }

    // 艺术风格映射
    const styleDescriptions: Record<string, string> = {
      modern: '现代简约风格，线条简洁，留白得当',
      classical: '传统古典风格，讲究对称与繁复之美',
      ethnic: '民族风，保留原汁原味的民族艺术特征',
      ink: '水墨意境，晕染自然，虚实相生',
      palace: '宫廷华丽风格，富丽堂皇，金碧辉煌'
    }

    // 心情映射
    const moodDescriptions: Record<string, string> = {
      serene: '宁静悠远',
      joyful: '欢快愉悦',
      nostalgic: '温婉思念',
      blessing: '美好祝福',
      prayer: '虔诚祈愿',
      retro: '怀旧温情',
      celebration: '喜庆庆典',
      elegant: '典雅端庄'
    }

    // 物品映射
    const itemDescriptions: Record<string, string> = {
      'lotus': '莲花',
      'peony': '牡丹',
      'bamboo': '竹子',
      'plum': '梅花',
      'orchid': '兰花',
      'chrysanthemum': '菊花',
      'pine': '松树',
      'lotus-leaf': '荷叶',
      'pavilion': '亭台',
      'tower': '楼阁',
      'door-window': '门窗',
      'eaves': '屋檐',
      'screen': '屏风',
      'archway': '牌坊',
      'corridor-bridge': '廊桥',
      'pagoda': '宝塔',
      'dragon-phoenix': '龙凤',
      'qilin': '麒麟',
      'koi': '锦鲤',
      'crane': '仙鹤',
      'butterfly': '蝴蝶',
      'mandarin-duck': '鸳鸯',
      'pixiu': '貔貅',
      'peacock': '孔雀'
    }

    // 画面尺寸映射
    const sizeMap: Record<string, string> = {
      '1:1': '1024*1024',
      '16:9': '1280*720',
      '9:16': '720*1280',
      '3:4': '768*1024'
    }

    const sceneDesc = sceneDescriptions[scene] || '设计作品'
    const colorDesc = colorDescriptions[colorTone] || '配色和谐优雅'
    const styleDesc = styleDescriptions[artStyle] || '现代与传统融合'
    const moodDesc = moodDescriptions[mood] || '典雅端庄'
    const itemDesc = itemDescriptions[item] || '工艺品'
    const size = sizeMap[aspectRatio] || '1024*1024'

    // 构建完整的提示词
    const fullPrompt = `请基于用户上传的画布图案进行创作。核心要求如下：
1. **直接使用原图案**：将画布上的纹样图案直接、清晰地呈现在${itemDesc}的表面或造型之中，必须保持纹样的原有色彩、线条走势和结构特征，确保观者能一眼辨认出原纹样的样貌，不得过度重新创作或改变原图案。
2. **物品融合**：让${itemDesc}的造型与原纹样自然融合，纹样应作为${itemDesc}的主体装饰或核心视觉元素出现。
3. **应用场景**：将融合了纹样的${itemDesc}应用于${sceneDesc}中，构图需突出${itemDesc}与纹样的结合效果。
4. **氛围风格**：整体氛围要求${moodDesc}，${colorDesc}，${styleDesc}。
请务必将原纹样的视觉特征完整保留并清晰展现。`

    // 获取API密钥
    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      throw new Error('未配置 DASHSCOPE_API_KEY 环境变量')
    }

    // 调用千问图像生成API
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-image-2.0-pro',
        input: {
          messages: [
            {
              role: 'user',
              content: [
                { image: imageData },
                { text: fullPrompt }
              ]
            }
          ]
        },
        parameters: {
          n: 1,
          negative_prompt: ' ',
          prompt_extend: true,
          watermark: false,
          size: size
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`API调用失败: ${errorData.message || response.statusText}`)
    }

    const data: QwenImageResponse = await response.json()
    const generatedImageUrl = data.output.choices[0]?.message.content[0]?.image

    if (!generatedImageUrl) {
      throw new Error('生成图像失败')
    }

    // 下载生成的图像并转换为base64
    const imageResponse = await fetch(generatedImageUrl)
    if (!imageResponse.ok) {
      throw new Error('下载生成的图像失败')
    }
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // 返回base64格式的图像
    return NextResponse.json({
      image: `data:image/png;base64,${base64Image}`,
      prompt: fullPrompt
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '生成失败' },
      { status: 500 }
    )
  }
}
