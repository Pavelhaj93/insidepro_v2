import { client } from '@/sanity/lib/client'
import { settingsQuery } from '@/sanity/lib/queries'
import { Header } from './Header'

export async function HeaderWrapper() {
  const settings = await client.fetch(settingsQuery)
  return (
    <Header
      logo={settings?.logo ?? null}
      logoText={settings?.logoText ?? 'IN'}
    />
  )
}
