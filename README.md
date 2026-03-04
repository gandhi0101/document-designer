# @document-designer/package

Paquete headless del núcleo reutilizable del document designer.

## Qué incluye

- `core`: tipos serializables, documento vacío, borradores y labels neutrales de UI.
- `tour`: contratos y secuencias reutilizables del walkthrough del diseñador.
- Build ESM con tipos `.d.ts` y subpath exports para consumir solo lo necesario.

## Qué no incluye

- DOM, layout global o branding.
- Integración específica de Angular, React o Vue.
- Servicios HTTP, autenticación o persistencia remota.

## Instalación

```bash
npm install @document-designer/package
```

## Uso

```ts
import { createEmptyDocumentDefinition } from '@document-designer/package/core';
import { buildReporteDesignerTourSteps } from '@document-designer/package/tour';

const definition = createEmptyDocumentDefinition();

const steps = buildReporteDesignerTourSteps({
  mode: 'meta',
  onOpenMetaModal: () => {},
  onCloseMetaModal: () => {},
  onCreateTextElement: () => {},
  onCreateCellsElement: () => {},
  onOpenCellsMenu: () => {},
  onOpenCellsMergeMenu: () => {},
  onCreateTableElement: () => {},
  onOpenTableMenu: () => {},
});
```

## Scripts

```bash
npm run build
npm run test
```

`build` genera `dist/`. `test` valida el comportamiento del core y del tour con `vitest`.
