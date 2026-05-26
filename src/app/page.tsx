'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/create')
    }, 700)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{
      backgroundColor: '#6b1a1a',
      fontFamily: '"STKaiti", "KaiTi", "华文楷体", serif'
    }}>
      {/* 金色琉璃瓦屋檐 */}
      <div className="absolute top-0 left-0 right-0 h-[30px]" style={{
        background: 'linear-gradient(to bottom, #d4af37, #b8860b)',
        borderBottom: '3px solid #8b6914'
      }}>
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 20px, #b8860b 20px, #b8860b 40px)'
        }} />
      </div>

      {/* 中式窗棂纹理 */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(139, 58, 58, 0.15) 49px, rgba(139, 58, 58, 0.15) 51px),
          repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(139, 58, 58, 0.15) 49px, rgba(139, 58, 58, 0.15) 51px)
        `
      }} />

      {/* 金色光晕动画 */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none" style={{
          animation: 'goldenGlow 0.7s ease-out forwards'
        }} />
      )}

      {/* 主内容区域 */}
      <div className="relative z-10 text-center px-4" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        {/* 项目名称 */}
        <h1 className="text-8xl font-bold mb-8" style={{
          color: '#f5e6a3',
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.1em'
        }}>
          魔方纹韵
        </h1>

        {/* 标语 */}
        <p className="text-2xl mb-16" style={{
          color: '#f5f5dc',
          letterSpacing: '0.2em',
          fontWeight: 300
        }}>
          转动魔方，绘就千年纹韵
        </p>

        {/* 创作之门按钮 */}
        <button 
          onClick={handleClick}
          className="group relative mx-auto" 
          style={{
            width: '320px',
            height: '320px',
            background: 'linear-gradient(135deg, #4a3728, #2d1f14)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            ...(isAnimating && {
              transform: 'scale(1.5)',
              opacity: 0,
              transition: 'all 0.7s ease-out'
            })
          }}
        >
          {/* 门环外框 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{
              width: '180px',
              height: '180px',
              border: '4px solid #d4af37',
              borderRadius: '50%',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.4s ease'
            }}>
              {/* 门环内部装饰 */}
              <div className="absolute inset-0" style={{
                border: '2px solid #8b6914',
                borderRadius: '50%',
                margin: '8px'
              }} />

              {/* 中式纹样魔方 SVG */}
              <div className="absolute" style={{
                width: '84px',
                height: '84px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
              }}>
                <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* 右侧面 - 墨绿 */}
                  <path d="M42 24 L68 10 L68 50 L42 64 Z" fill="#1a3a3a" stroke="#d4af37" strokeWidth="1.5"/>
                  {/* 右侧面装饰 - 竖线 */}
                  <line x1="48" y1="21" x2="48" y2="58" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
                  <line x1="55" y1="17" x2="55" y2="54" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
                  <line x1="62" y1="13" x2="62" y2="50" stroke="#d4af37" strokeWidth="1" opacity="0.6"/>
                  {/* 右侧面装饰 - 横线 */}
                  <line x1="45" y1="32" x2="65" y2="22" stroke="#d4af37" strokeWidth="1" opacity="0.4"/>
                  <line x1="45" y1="42" x2="65" y2="32" stroke="#d4af37" strokeWidth="1" opacity="0.4"/>
                  <line x1="45" y1="52" x2="65" y2="42" stroke="#d4af37" strokeWidth="1" opacity="0.4"/>

                  {/* 顶面 - 金色 */}
                  <path d="M16 10 L42 24 L68 10 L42 0 Z" fill="#c9a227" stroke="#8b6914" strokeWidth="1.5"/>
                  {/* 顶面装饰 - 回纹 */}
                  <polyline points="28,12 28,16 32,16 32,12" fill="none" stroke="#6b1a1a" strokeWidth="1.2" opacity="0.7"/>
                  <polyline points="36,16 36,20 40,20 40,16" fill="none" stroke="#6b1a1a" strokeWidth="1.2" opacity="0.7"/>
                  <polyline points="44,12 44,16 48,16 48,12" fill="none" stroke="#6b1a1a" strokeWidth="1.2" opacity="0.7"/>
                  <polyline points="52,8 52,12 56,12 56,8" fill="none" stroke="#6b1a1a" strokeWidth="1.2" opacity="0.7"/>
                  {/* 顶面中心装饰 */}
                  <circle cx="42" cy="13" r="3" fill="none" stroke="#6b1a1a" strokeWidth="1" opacity="0.5"/>

                  {/* 正面 - 深红 */}
                  <path d="M16 10 L42 24 L42 64 L16 50 Z" fill="#6b1a1a" stroke="#d4af37" strokeWidth="1.5"/>
                  {/* 正面装饰 - 云纹弧线 */}
                  <path d="M22 28 Q28 22 34 28 Q40 22 36 32" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.7"/>
                  <path d="M24 38 Q30 32 36 38 Q42 32 38 42" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.6"/>
                  <path d="M26 48 Q32 42 38 48" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.5"/>
                  {/* 正面边框装饰 */}
                  <rect x="20" y="20" width="18" height="26" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.3" rx="2"/>
                  <circle cx="29" cy="48" r="2" fill="#d4af37" opacity="0.5"/>
                  <circle cx="35" cy="52" r="1.5" fill="#d4af37" opacity="0.4"/>
                </svg>
              </div>
            </div>

            {/* 按钮文字 */}
            <div className="absolute bottom-8 left-0 right-0 text-center" style={{
              color: '#f5e6a3',
              fontSize: '24px',
              fontWeight: 'bold',
              letterSpacing: '0.15em',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.4s ease'
            }}>
              推门入画
            </div>
          </div>

          {/* 悬停效果 */}
          <style jsx>{`
            button:hover:not(:disabled) {
              transform: translateY(-8px);
              box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
            }
            button:hover:not(:disabled) > div > div {
              transform: translateY(-8px);
            }
            @keyframes goldenGlow {
              0% {
                opacity: 0;
                background: radial-gradient(circle at center, rgba(212, 175, 55, 0) 0%, transparent 70%);
              }
              50% {
                opacity: 1;
                background: radial-gradient(circle at center, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
              }
              100% {
                opacity: 0;
                background: radial-gradient(circle at center, rgba(212, 175, 55, 0) 0%, transparent 70%);
              }
            }
          `}</style>
        </button>
      </div>

      {/* 底部石阶剪影 */}
      <div className="absolute bottom-0 left-0 right-0 h-24" style={{
        background: 'linear-gradient(to top, #3d0f0f, transparent)',
        opacity: 0.6
      }}>
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(61, 15, 15, 0.3) 49px, rgba(61, 15, 15, 0.3) 51px)'
        }} />
      </div>
    </div>
  )
}
