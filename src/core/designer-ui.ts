import type { DocumentDesignerSaveMode } from './designer-types.js';

export function getDraftStatusLabel(input: {
  isSaving: boolean;
  hasPendingChanges: boolean;
  hasLocalDraft: boolean;
}): string {
  if (input.isSaving) return 'Guardando...';
  if (input.hasPendingChanges) return 'Cambios locales';
  if (input.hasLocalDraft) return 'Autoguardado local';
  return 'Sin cambios pendientes';
}

export function getLocalDraftUpdatedLabel(
  updatedAt?: string | null,
  locale = 'es-MX',
): string | null {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDocumentTabLabel(input: {
  currentName?: string | null;
  plantillaName?: string | null;
  saveMode: DocumentDesignerSaveMode;
}): string {
  const currentName = `${input.currentName ?? ''}`.trim();
  if (currentName) return currentName;
  const plantillaName = `${input.plantillaName ?? ''}`.trim();
  if (plantillaName) return plantillaName;
  return input.saveMode === 'excel' ? 'Libro sin titulo' : 'Documento sin titulo';
}

export function getDocumentTabMetaLabel(input: {
  draftRestored: boolean;
  localDraftUpdatedLabel?: string | null;
  hasPendingChanges: boolean;
  hasLocalDraft: boolean;
  hasSavedTemplate: boolean;
}): string {
  if (input.draftRestored && input.localDraftUpdatedLabel) {
    return `Recuperado ${input.localDraftUpdatedLabel}`;
  }
  if (input.hasPendingChanges && input.localDraftUpdatedLabel) {
    return `Autoguardado ${input.localDraftUpdatedLabel}`;
  }
  if (input.hasPendingChanges) return 'Cambios locales';
  if (input.hasLocalDraft && input.localDraftUpdatedLabel) {
    return `Autoguardado ${input.localDraftUpdatedLabel}`;
  }
  return input.hasSavedTemplate ? 'Plantilla guardada' : 'Documento nuevo';
}
