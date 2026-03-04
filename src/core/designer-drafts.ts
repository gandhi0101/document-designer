import type {
  BuildDraftPayloadInput,
  DocumentDesignerDefinition,
  DocumentDesignerDraft,
  DocumentDesignerRecord,
  DocumentDesignerSaveMode,
  DraftComparableStateInput,
} from './designer-types.js';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | undefined;

function cloneSerializable<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createDraftComparableState<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
>(input: DraftComparableStateInput<TDefinition, TMeta>): string {
  return JSON.stringify({
    saveMode: input.saveMode,
    definition: input.definition,
    meta: input.meta,
    customParams: input.customParams ?? {},
    contextSyncEnabled: input.contextSyncEnabled,
    contextSelectedEntity: input.contextSelectedEntity,
    zoom: input.zoom,
  });
}

export function buildDraftPayload<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
>(input: BuildDraftPayloadInput<TDefinition, TMeta>): DocumentDesignerDraft<TDefinition, TMeta> {
  return {
    version: 1,
    updatedAt: input.updatedAt ?? new Date().toISOString(),
    saveMode: input.saveMode,
    plantillaUuid: input.plantillaUuid ?? null,
    definition: cloneSerializable(input.definition),
    meta: cloneSerializable(input.meta),
    customParams: cloneSerializable(input.customParams ?? {}),
    contextSyncEnabled: input.contextSyncEnabled,
    contextSelectedEntity: input.contextSelectedEntity,
    zoom: input.zoom,
  };
}

export function createDraftStorageKey(
  saveMode: DocumentDesignerSaveMode,
  plantillaUuid?: string | null,
): string {
  return `reporte-designer:draft:${saveMode}:${plantillaUuid ?? 'new'}`;
}

export function readDraft<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
>(
  storage: StorageLike,
  draftKey: string,
): DocumentDesignerDraft<TDefinition, TMeta> | null {
  if (!storage) return null;
  const raw = storage.getItem(draftKey);
  if (!raw) return null;
  try {
    const draft = JSON.parse(raw) as DocumentDesignerDraft<TDefinition, TMeta>;
    if (draft?.version !== 1) return null;
    return draft;
  } catch {
    return null;
  }
}

export function persistDraftToStorage<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
>(
  storage: StorageLike,
  draftKey: string,
  draft: DocumentDesignerDraft<TDefinition, TMeta>,
): void {
  if (!storage) return;
  storage.setItem(draftKey, JSON.stringify(draft));
}

export function clearDraftFromStorage(storage: StorageLike, draftKey: string): void {
  storage?.removeItem(draftKey);
}

export function isDraftEqualToComparableState<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
>(
  draft: DocumentDesignerDraft<TDefinition, TMeta>,
  comparableState: string,
  fallbackZoom: number,
): boolean {
  const draftSnapshot = JSON.stringify({
    saveMode: draft.saveMode,
    definition: draft.definition,
    meta: draft.meta,
    customParams: draft.customParams ?? {},
    contextSyncEnabled: !!draft.contextSyncEnabled,
    contextSelectedEntity: draft.contextSelectedEntity ?? '',
    zoom: draft.zoom ?? fallbackZoom,
  });
  return draftSnapshot === comparableState;
}
