// Documents
import { page } from './documents/page'
import { post } from './documents/post'
import { settings } from './documents/settings'
import { project } from './documents/project'
import { teamMember } from './documents/teamMember'
import { film } from './documents/film'

// Block objects
import { heroSection } from './objects/blocks/heroSection'
import { servicesListSection } from './objects/blocks/servicesListSection'
import { featuredWorksSection } from './objects/blocks/featuredWorksSection'
import { ctaSection } from './objects/blocks/ctaSection'
import { quoteSection } from './objects/blocks/quoteSection'
import { processSection } from './objects/blocks/processSection'
import { twoColumnSection } from './objects/blocks/twoColumnSection'
import { teamSection } from './objects/blocks/teamSection'
import { filmShowcaseSection } from './objects/blocks/filmShowcaseSection'
import { clientsSection } from './objects/blocks/clientsSection'

// Shared objects
import { serviceItem } from './objects/shared/serviceItem'
import { processStep } from './objects/shared/processStep'
import { clientItem } from './objects/shared/clientItem'

export const schemaTypes = [
  // Documents
  page,
  post,
  settings,
  project,
  teamMember,
  film,
  // Block objects
  heroSection,
  servicesListSection,
  featuredWorksSection,
  ctaSection,
  quoteSection,
  processSection,
  twoColumnSection,
  teamSection,
  filmShowcaseSection,
  clientsSection,
  // Shared objects
  serviceItem,
  processStep,
  clientItem,
]
