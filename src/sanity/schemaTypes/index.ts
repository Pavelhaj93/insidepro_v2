// Documents
import { page } from './documents/page'
import { post } from './documents/post'
import { settings } from './documents/settings'
import { project } from './documents/project'
import { teamMember } from './documents/teamMember'
import { film } from './documents/film'
import { footer } from './documents/footer'
import { brandLogo } from './documents/brandLogo'
import { category } from './documents/category'

// Block objects
import { heroSection } from './objects/blocks/heroSection'
import { servicesListSection } from './objects/blocks/servicesListSection'
import { featuredWorksSection } from './objects/blocks/featuredWorksSection'
import { referenceWorksSection } from './objects/blocks/referenceWorksSection'
import { ctaSection } from './objects/blocks/ctaSection'
import { quoteSection } from './objects/blocks/quoteSection'
import { processSection } from './objects/blocks/processSection'
import { twoColumnSection } from './objects/blocks/twoColumnSection'
import { teamSection } from './objects/blocks/teamSection'
import { filmShowcaseSection } from './objects/blocks/filmShowcaseSection'
import { clientsSection } from './objects/blocks/clientsSection'
import { imageSection } from './objects/blocks/imageSection'
import { infoBoxSection } from './objects/blocks/infoBoxSection'
import { featureCardsSection } from './objects/blocks/featureCardsSection'
import { richTextSection } from './objects/blocks/richTextSection'
import { logoWallSection } from './objects/blocks/logoWallSection'
import { textBlock } from './objects/blocks/textBlock'
import { separator } from './objects/blocks/separator'

// Shared objects
import { serviceItem } from './objects/shared/serviceItem'
import { processStep } from './objects/shared/processStep'
import { clientItem } from './objects/shared/clientItem'
import { featureCard } from './objects/shared/featureCard'

export const schemaTypes = [
  // Documents
  page,
  post,
  settings,
  project,
  teamMember,
  film,
  footer,
  brandLogo,
  category,
  // Block objects
  heroSection,
  servicesListSection,
  featuredWorksSection,
  referenceWorksSection,
  ctaSection,
  quoteSection,
  processSection,
  twoColumnSection,
  teamSection,
  filmShowcaseSection,
  clientsSection,
  imageSection,
  infoBoxSection,
  featureCardsSection,
  richTextSection,
  logoWallSection,
  textBlock,
  separator,
  // Shared objects
  serviceItem,
  processStep,
  clientItem,
  featureCard,
]
