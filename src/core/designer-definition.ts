import type { DocumentDesignerDefinition } from './designer-types.js';

export function createEmptyDocumentDefinition<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
>(): TDefinition {
  return {
    page: {
      size: 'LETTER',
      margin: { top: 40, right: 40, bottom: 60, left: 40 },
    },
    body: [],
    header: [],
    footer: [],
  } as unknown as TDefinition;
}
