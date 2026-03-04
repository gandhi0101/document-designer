import { describe, expect, it, vi } from 'vitest';

import { buildReporteDesignerTourSteps } from '../src/tour';

function createCallbacks() {
  return {
    onOpenMetaModal: vi.fn(),
    onCloseMetaModal: vi.fn(),
    onCreateTextElement: vi.fn(),
    onCreateCellsElement: vi.fn(),
    onOpenCellsMenu: vi.fn(),
    onOpenCellsMergeMenu: vi.fn(),
    onCreateTableElement: vi.fn(),
    onOpenTableMenu: vi.fn(),
  };
}

describe('tour package', () => {
  it('returns a reduced step set for meta mode', () => {
    const steps = buildReporteDesignerTourSteps({
      mode: 'meta',
      ...createCallbacks(),
    });

    expect(steps).toHaveLength(6);
    expect(steps.every((step) => step._skipIfMissing)).toBe(true);
    expect(steps.map((step) => step.element)).toContain('[data-tour="reporte-designer-meta"]');
  });

  it('wires modal callbacks in atajos mode', () => {
    const callbacks = createCallbacks();
    const steps = buildReporteDesignerTourSteps({
      mode: 'atajos',
      ...callbacks,
    });

    const openModalStep = steps.find(
      (step) => step.element === '[data-tour="reporte-designer-meta-atajos-btn"]',
    );
    openModalStep?.popover?.onNextClick?.();
    expect(callbacks.onOpenMetaModal).toHaveBeenCalledTimes(1);

    const driver = { moveNext: vi.fn() };
    const closeModalStep = steps.find(
      (step) => step.element === '[data-tour="reporte-designer-meta-modal-guardar"]',
    );
    closeModalStep?.popover?.onNextClick?.(undefined, undefined, { driver });

    expect(callbacks.onCloseMetaModal).toHaveBeenCalledTimes(1);
    expect(driver.moveNext).toHaveBeenCalledTimes(1);
  });

  it('includes all flows when mode is full', () => {
    const steps = buildReporteDesignerTourSteps({
      mode: 'full',
      ...createCallbacks(),
    });

    expect(steps.length).toBeGreaterThan(20);
    expect(steps.map((step) => step.element)).toContain('[data-tour="reporte-designer-table-menu"]');
    expect(steps.map((step) => step.element)).toContain('[data-tour="reporte-designer-actions"]');
  });
});
