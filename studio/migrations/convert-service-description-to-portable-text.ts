import { at, defineMigration, set } from 'sanity/migrate'

function randomKey(length = 12) {
  return Math.random().toString(36).slice(2, 2 + length)
}

export default defineMigration({
  title: 'Convert serviceItem.description from plain text to Portable Text',
  documentTypes: ['page'],
  migrate: {
    object(node, path, context) {
      // Some existing serviceItem entries are missing an explicit `_type`
      // (legacy data), so detect them structurally: this schema only has one
      // object array field named `items` (servicesListSection.items).
      const isServiceItem =
        node._type === 'serviceItem' ||
        (path[path.length - 2] === 'items' && 'title' in node)
      if (!isServiceItem) return
      if (typeof node.description !== 'string') return

      const paragraphs = node.description
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)

      return at(
        'description',
        set(
          paragraphs.map((text) => ({
            _type: 'block',
            _key: randomKey(),
            style: 'normal',
            markDefs: [],
            children: [
              {
                _type: 'span',
                _key: randomKey(),
                text,
                marks: [],
              },
            ],
          })),
        ),
      )
    },
  },
})
