import type { StructureResolver } from 'sanity/structure'

export const SINGLETON_TYPES = new Set(['settings', 'footer', 'nsSettings'])

// Types grouped under the "Non Shoots" item instead of the flat document list
const NONSHOOTS_TYPES = new Set(['nsSettings', 'nsPage'])

const singletons: Array<{ id: string; type: string; title: string }> = [
  { id: 'settings', type: 'settings', title: 'Site Settings' },
  { id: 'footer', type: 'footer', title: 'Footer' },
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...singletons.map((singleton) =>
        S.listItem()
          .id(singleton.id)
          .title(singleton.title)
          .child(
            S.document()
              .schemaType(singleton.type)
              .documentId(singleton.id)
          )
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? '') && !NONSHOOTS_TYPES.has(item.getId() ?? '')
      ),
      S.divider(),
      // nonshoots.com (Jan Rajnoha's personal site) — separate Next app, same dataset
      S.listItem()
        .id('nonshoots')
        .title('Non Shoots (nonshoots.com)')
        .child(
          S.list()
            .title('Non Shoots')
            .items([
              S.listItem()
                .id('nsSettings')
                .title('Úvodní stránka')
                .child(S.document().schemaType('nsSettings').documentId('nsSettings')),
              S.documentTypeListItem('nsPage').title('Stránky'),
            ])
        ),
    ])
