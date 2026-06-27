import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { HeaderWrapper } from '@/components/layout/HeaderWrapper'
import { Footer } from '@/components/layout/Footer'
import { SanityLive } from '@/sanity/lib/live'
import { VisualEditing } from 'next-sanity/visual-editing'
import './globals.css'

export const metadata: Metadata = {
  title: 'insidePRO — Film. Brand. Emotion.',
  description: 'Kreativní a marketingová produkce s více než 18 lety zkušeností.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDraftMode = (await draftMode()).isEnabled
  return (
    <html lang="cs" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-brand-black text-brand-light">
        <HeaderWrapper />
        <div className="flex-1">{children}</div>
        <Footer />
        <SanityLive />
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
