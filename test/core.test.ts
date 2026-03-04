import { describe, expect, it } from 'vitest';

import {
  buildDraftPayload,
  clearDraftFromStorage,
  createDraftComparableState,
  createDraftStorageKey,
  createEmptyDocumentDefinition,
  getDocumentTabLabel,
  getDocumentTabMetaLabel,
  getDraftStatusLabel,
  getLocalDraftUpdatedLabel,
  isDraftEqualToComparableState,
  persistDraftToStorage,
  readDraft,
} from '../src/core';

class MemoryStorage implements Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe('core package', () => {
  it('creates an empty document definition with expected defaults', () => {
    expect(createEmptyDocumentDefinition()).toEqual({
      page: {
        size: 'LETTER',
        margin: { top: 40, right: 40, bottom: 60, left: 40 },
      },
      body: [],
      header: [],
      footer: [],
    });
  });

  it('builds a draft payload without leaking object references', () => {
    const definition = createEmptyDocumentDefinition();
    const meta = { title: 'Cotizacion' };
    const customParams = { modulo: 'ventas' };

    const draft = buildDraftPayload({
      saveMode: 'plantilla',
      definition,
      meta,
      customParams,
      contextSyncEnabled: true,
      contextSelectedEntity: 'cliente',
      zoom: 1.25,
      updatedAt: '2026-03-03T12:00:00.000Z',
    });

    definition.page!.size = 'A4';
    meta.title = 'Factura';
    customParams.modulo = 'compras';

    expect(draft.definition.page?.size).toBe('LETTER');
    expect(draft.meta.title).toBe('Cotizacion');
    expect(draft.customParams.modulo).toBe('ventas');
  });

  it('persists, reads and clears drafts from storage', () => {
    const storage = new MemoryStorage();
    const key = createDraftStorageKey('excel', null);
    const draft = buildDraftPayload({
      saveMode: 'excel',
      definition: createEmptyDocumentDefinition(),
      meta: { title: 'Libro' },
      contextSyncEnabled: false,
      contextSelectedEntity: '',
      zoom: 1,
      updatedAt: '2026-03-03T13:00:00.000Z',
    });

    persistDraftToStorage(storage, key, draft);
    expect(readDraft(storage, key)).toEqual(draft);

    clearDraftFromStorage(storage, key);
    expect(readDraft(storage, key)).toBeNull();
  });

  it('compares a draft against the normalized comparable state', () => {
    const draft = buildDraftPayload({
      saveMode: 'plantilla',
      definition: createEmptyDocumentDefinition(),
      meta: { title: 'Reporte' },
      contextSyncEnabled: false,
      contextSelectedEntity: '',
      zoom: 1,
      updatedAt: '2026-03-03T13:00:00.000Z',
    });

    const comparableState = createDraftComparableState({
      saveMode: 'plantilla',
      definition: createEmptyDocumentDefinition(),
      meta: { title: 'Reporte' },
      contextSyncEnabled: false,
      contextSelectedEntity: '',
      zoom: 1,
    });

    expect(isDraftEqualToComparableState(draft, comparableState, 0.75)).toBe(true);
    expect(isDraftEqualToComparableState({ ...draft, zoom: 2 }, comparableState, 0.75)).toBe(false);
  });

  it('returns stable labels for draft and tab state', () => {
    expect(
      getDraftStatusLabel({
        isSaving: false,
        hasPendingChanges: false,
        hasLocalDraft: true,
      }),
    ).toBe('Autoguardado local');

    expect(
      getDocumentTabLabel({
        currentName: '  ',
        plantillaName: null,
        saveMode: 'excel',
      }),
    ).toBe('Libro sin titulo');

    expect(
      getDocumentTabMetaLabel({
        draftRestored: true,
        localDraftUpdatedLabel: '12:45',
        hasPendingChanges: false,
        hasLocalDraft: true,
        hasSavedTemplate: false,
      }),
    ).toBe('Recuperado 12:45');
  });

  it('formats local draft dates and rejects invalid values', () => {
    expect(getLocalDraftUpdatedLabel('not-a-date')).toBeNull();

    const formatted = getLocalDraftUpdatedLabel('2026-03-03T15:04:00.000Z', 'en-US');
    expect(formatted).toMatch(/^\d{2}:\d{2}/);
  });
});
