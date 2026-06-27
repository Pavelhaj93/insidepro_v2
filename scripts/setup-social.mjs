import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '4mvdpq34',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

// 1. Upsert settings with social links
const existingSettings = await client.fetch(`*[_type == "settings"][0]{ _id }`)

let settingsId
if (existingSettings?._id) {
  settingsId = existingSettings._id
  await client.patch(settingsId).set({
    socialLinks: {
      instagram: 'https://www.instagram.com/insidepro.cz/',
      linkedin: 'https://www.linkedin.com/company/insidepro',
      facebook: 'https://www.facebook.com/insidepro.cz',
      vimeo: 'https://vimeo.com/insidepro',
    }
  }).commit()
  console.log('✓ Patched settings:', settingsId)
} else {
  const created = await client.create({
    _type: 'settings',
    title: 'insidePRO',
    logoText: 'IN',
    socialLinks: {
      instagram: 'https://www.instagram.com/insidepro.cz/',
      linkedin: 'https://www.linkedin.com/company/insidepro',
      facebook: 'https://www.facebook.com/insidepro.cz',
      vimeo: 'https://vimeo.com/insidepro',
    },
  })
  settingsId = created._id
  console.log('✓ Created settings:', settingsId)
}

// 2. Enable showSocialIcons on the homepage hero block
const homepage = await client.fetch(
  `*[_type == "page" && isHomepage == true][0]{ _id, blocks }`
)

if (!homepage) {
  console.error('✗ Homepage not found')
  process.exit(1)
}

const heroBlock = homepage.blocks?.find(b => b._type === 'heroSection')
if (!heroBlock) {
  console.error('✗ No heroSection block on homepage')
  process.exit(1)
}

await client
  .patch(homepage._id)
  .set({ [`blocks[_key == "${heroBlock._key}"].showSocialIcons`]: true })
  .commit()

console.log('✓ Enabled showSocialIcons on homepage hero block')
console.log('\nDone! Social icons will appear in the homepage hero bottom-right corner.')
