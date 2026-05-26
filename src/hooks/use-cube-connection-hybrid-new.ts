'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePatternStore } from '@/store/pattern-store'
import { CubeFace, CubeDirection } from '@/types/pattern'

// 动态导入类型
type GanCubeConnection = {
  deviceName: string
  deviceMAC: string
  events$: {
    subscribe: (callback: (event: GanCubeEvent) => void) => { unsubscribe: () => void }
  }
  sendCubeCommand: (command: { type: string }) => Promise<void>
  disconnect: () => Promise<void>
}

type GanCubeEvent = {
  type: string
  timestamp: number
  face?: number
  direction?: number
  move?: string
  batteryLevel?: number
  hardwareName?: string
}

// 魔方面映射
const FACE_MAP: Record<number, CubeFace> = {
  0: 'U',
  1: 'R',
  2: 'F',
  3: 'D',
  4: 'L',
  5: 'B'
}

export function useCubeConnection() {
  const connectionRef = useRef<GanCubeConnection | null>(null)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  const {
    setCubeConnection,
    applyCubeMove,
    cubeConnection
  } = usePatternStore()

  // 连接魔方
  const connectCube = useCallback(async () => {
    try {
      console.log('=== 开始连接魔方 ===')

      // 检查浏览器是否支持Web Bluetooth
      if (!navigator.bluetooth) {
        throw new Error('您的浏览器不支持Web Bluetooth API，请使用Chrome、Edge等支持蓝牙的浏览器')
      }

      console.log('✓ 浏览器支持Web Bluetooth API')

      // 检查蓝牙是否可用
      const bluetoothAvailability = await navigator.bluetooth.getAvailability()
      console.log('蓝牙可用性:', bluetoothAvailability)

      if (!bluetoothAvailability) {
        throw new Error('蓝牙不可用，请确保设备已开启蓝牙')
      }

      console.log('✓ 蓝牙已开启')

      // 动态导入gan-web-bluetooth
      console.log('正在导入gan-web-bluetooth库...')
      const { connectGanCube } = await import('gan-web-bluetooth')
      console.log('✓ gan-web-bluetooth库导入成功')

      console.log('=== 准备连接 ===')
      console.log('请确保:')
      console.log('1. 魔方已开机')
      console.log('2. 魔方处于配对模式(长按配对按钮直到指示灯快速闪烁)')
      console.log('3. 魔方未被其他设备连接')
      console.log('即将弹出蓝牙设备选择对话框...')

      // 直接使用MAC地址提供者函数连接
      console.log('准备使用MAC地址提供者函数连接...')
      let connection: GanCubeConnection | null = null

      try {
        connection = await connectGanCube(async (device: any, fallback?: boolean) => {
          console.log('获取设备信息:', device.name, device.id)
          console.log('fallback模式:', fallback)

          // 直接返回已知的魔方MAC地址
          const cubeMAC = 'AB:12:34:5F:B0:BE'
          console.log('使用已知MAC地址:', cubeMAC)
          return cubeMAC
        }) as GanCubeConnection
        console.log('✓ 连接成功')
      } catch (error) {
        console.log('连接失败')
        console.log('错误:', error)
        throw error
      }

      if (!connection) {
        throw new Error('连接失败')
      }

      console.log('连接信息:')
      console.log('设备名称:', connection.deviceName)
      console.log('设备MAC:', connection.deviceMAC)

      connectionRef.current = connection

      // 设置连接状态
      setCubeConnection({
        isConnected: true,
        deviceName: connection.deviceName
      })

      console.log('=== 订阅魔方事件 ===')

      // 订阅魔方事件
      subscriptionRef.current = connection.events$.subscribe((event: GanCubeEvent) => {
        console.log('收到魔方事件:', event.type, event)

        switch (event.type) {
          case 'MOVE':
            if (event.face !== undefined && event.direction !== undefined) {
              const face = FACE_MAP[event.face]
              const direction: CubeDirection = event.direction === 0 ? 'CW' : 'CCW'

              console.log('移动: ' + face + '面, ' + direction)

              setCubeConnection({
                lastMove: {
                  face,
                  direction,
                  move: event.move || '',
                  timestamp: event.timestamp
                }
              })

              // 应用移动到选中的元素
              applyCubeMove(face, event.direction)
            }
            break

          case 'BATTERY':
            if (event.batteryLevel !== undefined) {
              console.log('电池电量: ' + event.batteryLevel + '%')
              setCubeConnection({ batteryLevel: event.batteryLevel })
            }
            break

          case 'HARDWARE':
            if (event.hardwareName) {
              console.log('硬件名称: ' + event.hardwareName)
              setCubeConnection({ deviceName: event.hardwareName })
            }
            break

          case 'DISCONNECT':
            console.log('魔方已断开连接')
            setCubeConnection({
              isConnected: false,
              deviceName: null,
              batteryLevel: null
            })
            connectionRef.current = null
            break
        }
      })

      console.log('=== 连接成功 ===')
      console.log('现在可以转动魔方来控制画布上的元素了')

      return true
    } catch (error) {
      console.error('=== 连接失败 ===')
      console.error('错误详情:', error)

      // 提供更详细的错误信息
      if (error instanceof Error) {
        console.error('错误消息:', error.message)
        console.error('错误堆栈:', error.stack)

        if (error.message.includes('User cancelled')) {
          throw new Error('用户取消了蓝牙设备选择')
        } else if (error.message.includes('Device not found')) {
          throw new Error('未找到魔方设备，请确保: 1)魔方已开机 2)魔方处于配对模式 3)魔方未被其他设备连接')
        } else if (error.message.includes('Bluetooth')) {
          throw new Error('蓝牙连接错误: ' + error.message + '\n请确保浏览器已授予蓝牙权限')
        } else if (error.message.includes('Connection attempt failed')) {
          throw new Error('连接尝试失败，请确保: 1)魔方已开机 2)魔方处于配对模式 3)魔方未被其他设备连接 4)魔方距离设备足够近')
        }
        throw error
      }

      throw new Error('连接失败，请检查控制台获取详细信息')
    }
  }, [setCubeConnection, applyCubeMove])

  // 断开连接
  const disconnectCube = useCallback(async () => {
    console.log('断开连接...')

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
      subscriptionRef.current = null
    }

    if (connectionRef.current) {
      await connectionRef.current.disconnect()
      connectionRef.current = null
    }

    setCubeConnection({
      isConnected: false,
      deviceName: null,
      batteryLevel: null
    })

    console.log('已断开连接')
  }, [setCubeConnection])

  // 清理
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
    }
  }, [])

  return {
    connectCube,
    disconnectCube,
    isConnected: cubeConnection.isConnected,
    deviceName: cubeConnection.deviceName,
    batteryLevel: cubeConnection.batteryLevel,
    lastMove: cubeConnection.lastMove
  }
}
