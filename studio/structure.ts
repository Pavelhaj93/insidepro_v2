import type { StructureResolver } from 'sanity/structure'

export const SINGLETON_TYPES = new Set(['settings', 'footer'])

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
        (item) => !SINGLETON_TYPES.has(item.getId() ?? '')
      ),
    ])
