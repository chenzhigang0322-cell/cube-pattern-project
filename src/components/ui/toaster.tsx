"use client"

import * as React from "react"

import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

export function Toaster() {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-h-screen w-full max-w-[420px]" />
  )
}
