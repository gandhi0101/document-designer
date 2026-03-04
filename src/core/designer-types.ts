export type DocumentDesignerSaveMode = 'plantilla' | 'excel';

export type DocumentDesignerPrimitive = string | number | boolean | null;

export type DocumentDesignerValue =
  | DocumentDesignerPrimitive
  | DocumentDesignerValue[]
  | { [key: string]: DocumentDesignerValue };

export type DocumentDesignerRecord = Record<string, DocumentDesignerValue>;

export interface DocumentDesignerDefinition {
  meta?: DocumentDesignerRecord;
  page?: {
    size?: string;
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
  };
  header?: unknown[];
  footer?: unknown[];
  body?: unknown[];
  elements?: unknown[];
}

export interface DocumentDesignerDraft<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
> {
  version: 1;
  updatedAt: string;
  saveMode: DocumentDesignerSaveMode;
  plantillaUuid?: string | null;
  definition: TDefinition;
  meta: TMeta;
  customParams: DocumentDesignerRecord;
  contextSyncEnabled: boolean;
  contextSelectedEntity: string;
  zoom: number;
}

export interface DraftComparableStateInput<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
> {
  saveMode: DocumentDesignerSaveMode;
  definition: TDefinition;
  meta: TMeta;
  customParams?: DocumentDesignerRecord;
  contextSyncEnabled: boolean;
  contextSelectedEntity: string;
  zoom: number;
}

export interface BuildDraftPayloadInput<
  TDefinition extends DocumentDesignerDefinition = DocumentDesignerDefinition,
  TMeta extends DocumentDesignerRecord = DocumentDesignerRecord,
> extends DraftComparableStateInput<TDefinition, TMeta> {
  plantillaUuid?: string | null;
  updatedAt?: string;
}
