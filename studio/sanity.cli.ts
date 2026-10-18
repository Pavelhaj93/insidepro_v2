import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: { projectId: '4mvdpq34', dataset: 'production' },
  // Hosted Studio at https://insidepro-v2.sanity.studio — lets `sanity deploy` run without prompting.
  deployment: { appId: 'mqx4i1j697bx67pmxky95kiz' },
})
