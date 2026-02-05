import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FluentAI - Learn English with AI',
  description: 'Master English fluently with AI-powered conversations, exercises, and vocabulary learning',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={_geist.className}>
      <body className="font-sans antialiased ">{children}</body>
    </html>
  )
}
