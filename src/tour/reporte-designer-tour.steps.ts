type Alignment = 'start' | 'center' | 'end';
type Side = 'top' | 'right' | 'bottom' | 'left' | 'over';

interface DriverLike {
  moveNext(): void;
}

interface DriverHookContext {
  driver: DriverLike;
}

interface DriverPopover {
  title?: string;
  description?: string;
  side?: Side;
  align?: Alignment;
  onNextClick?: (
    element?: Element,
    step?: DriveStep,
    context?: DriverHookContext,
  ) => void;
}

interface DriveStep {
  element?: string | Element;
  popover?: DriverPopover;
}

export type ReporteDesignerTourMode =
  | 'full'
  | 'meta'
  | 'atajos'
  | 'componentes'
  | 'crear'
  | 'celdas'
  | 'tablas'
  | 'acciones';

export type ReporteDesignerTourStep = DriveStep & {
  _skipIfMissing?: boolean;
  _isModalStep?: boolean;
};

const asSide = (value: Side): Side => value;
const asAlign = (value: Alignment): Alignment => value;

export function buildReporteDesignerTourSteps(opts: {
  mode: ReporteDesignerTourMode;
  onOpenMetaModal: () => void;
  onCloseMetaModal: () => void;
  onCreateTextElement: () => void;
  onCreateCellsElement: () => void;
  onOpenCellsMenu: () => void;
  onOpenCellsMergeMenu: () => void;
  onCreateTableElement: () => void;
  onOpenTableMenu: () => void;
}): ReporteDesignerTourStep[] {
  const base: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-help"]',
      _skipIfMissing: true,
      popover: {
        title: 'Guia del diseniador',
        description: 'Inicia recorrido completo o por flujo especifico.',
        side: asSide('bottom'),
        align: asAlign('end'),
      },
    },
    {
      element: '[data-tour="reporte-designer-layout"]',
      _skipIfMissing: true,
      popover: {
        title: 'Area de trabajo',
        description: 'Desde aqui configuras meta, editas canvas y guardas plantilla.',
        side: asSide('top'),
        align: asAlign('start'),
      },
    },
  ];

  const meta: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-meta"]',
      _skipIfMissing: true,
      popover: {
        title: 'Meta del reporte',
        description: 'Completa nombre, modulo y dataset antes de guardar.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-nombre"]',
      _skipIfMissing: true,
      popover: {
        title: 'Nombre',
        description: 'Campo obligatorio para identificar la plantilla.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-modulo"]',
      _skipIfMissing: true,
      popover: {
        title: 'Modulo',
        description: 'Define el contexto funcional del reporte.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-dataset"]',
      _skipIfMissing: true,
      popover: {
        title: 'Dataset',
        description: 'Selecciona el origen de datos que alimenta tablas y bindings.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
  ];

  const atajos: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-meta-atajos-btn"]',
      _skipIfMissing: true,
      popover: {
        title: 'Atajos meta',
        description: 'Abre el catalogo para copiar placeholders {{ meta.* }}.',
        side: asSide('right'),
        align: asAlign('center'),
        onNextClick: () => opts.onOpenMetaModal(),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-modal"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Modal de atajos',
        description: 'Aqui consultas y administras placeholders de meta.',
        side: asSide('top'),
        align: asAlign('center'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-modal-search"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Buscar atajo',
        description: 'Filtra por placeholder, descripcion o dataset.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-modal-list"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Lista de placeholders',
        description: 'Haz click en un atajo para copiarlo al portapapeles.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-modal-form"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Crear nuevo atajo',
        description: 'Registra placeholder, dataset y campo para reutilizarlo.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-meta-modal-guardar"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Guardar atajo',
        description: 'Persiste el nuevo atajo para este modulo.',
        side: asSide('top'),
        align: asAlign('center'),
        onNextClick: (_el, _step, context) => {
          opts.onCloseMetaModal();
          context?.driver?.moveNext();
        },
      },
    },
  ];

  const componentes: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-sidebar"]',
      _skipIfMissing: true,
      popover: {
        title: 'Panel lateral',
        description: 'Contiene componentes y propiedades del elemento seleccionado.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-palette"]',
      _skipIfMissing: true,
      popover: {
        title: 'Paleta de componentes',
        description: 'Inserta texto, tablas, celdas, firmas, imagenes y formas.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-canvas"]',
      _skipIfMissing: true,
      popover: {
        title: 'Canvas',
        description: 'Arrastra, redimensiona y organiza elementos dentro de la pagina.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
  ];

  const crear: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-palette-text"]',
      _skipIfMissing: true,
      popover: {
        title: 'Crear texto',
        description: 'Este boton agrega un nuevo bloque de texto al lienzo.',
        side: asSide('right'),
        align: asAlign('center'),
        onNextClick: () => opts.onCreateTextElement(),
      },
    },
    {
      element: '[data-tour="reporte-designer-prop-posicion"]',
      _skipIfMissing: true,
      popover: {
        title: 'Posicion y tamanio',
        description: 'Ajusta X, Y, ancho y alto del elemento seleccionado.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-prop-texto-contenido"]',
      _skipIfMissing: true,
      popover: {
        title: 'Contenido',
        description: 'Edita texto y bindings como {{ meta.campo }}.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-canvas"]',
      _skipIfMissing: true,
      popover: {
        title: 'Resultado en lienzo',
        description: 'Aqui puedes mover y acomodar el elemento recien creado.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
  ];

  const acciones: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-actions"]',
      _skipIfMissing: true,
      popover: {
        title: 'Acciones principales',
        description: 'Desde esta barra previsualizas, exportas y guardas.',
        side: asSide('bottom'),
        align: asAlign('end'),
      },
    },
    {
      element: '[data-tour="reporte-designer-zoom"]',
      _skipIfMissing: true,
      popover: {
        title: 'Zoom',
        description: 'Ajusta el acercamiento del canvas para edicion fina.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-action-preview"]',
      _skipIfMissing: true,
      popover: {
        title: 'Vista previa',
        description: 'Genera PDF temporal para validar diseno y datos.',
        side: asSide('top'),
        align: asAlign('center'),
      },
    },
    {
      element: '[data-tour="reporte-designer-action-exportar-excel"]',
      _skipIfMissing: true,
      popover: {
        title: 'Exportar Excel',
        description: 'Descarga el resultado con el dataset actual.',
        side: asSide('top'),
        align: asAlign('center'),
      },
    },
    {
      element: '[data-tour="reporte-designer-action-importar-pdf"]',
      _skipIfMissing: true,
      popover: {
        title: 'Importar PDF',
        description: 'Convierte estructura PDF en elementos editables.',
        side: asSide('top'),
        align: asAlign('center'),
      },
    },
    {
      element: '[data-tour="reporte-designer-action-guardar"]',
      _skipIfMissing: true,
      popover: {
        title: 'Guardar',
        description: 'Guarda o actualiza la plantilla con el diseno actual.',
        side: asSide('top'),
        align: asAlign('center'),
      },
    },
  ];

  const celdas: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-palette-cells"]',
      _skipIfMissing: true,
      popover: {
        title: 'Insertar celdas',
        description: 'Agrega una cuadrilla editable tipo excel al lienzo.',
        side: asSide('right'),
        align: asAlign('center'),
        onNextClick: () => opts.onCreateCellsElement(),
      },
    },
    {
      element: '[data-tour="reporte-designer-prop-cells"]',
      _skipIfMissing: true,
      popover: {
        title: 'Propiedades de celdas',
        description: 'Controla filtros y dimensiones basicas.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-prop-cells-filtros"]',
      _skipIfMissing: true,
      popover: {
        title: 'Filtros por columna',
        description: 'Activa filtros para mostrar/ocultar filas por valor.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-cell-filter-toggle"]',
      _skipIfMissing: true,
      popover: {
        title: 'Filtro en encabezado',
        description: 'Cada columna muestra icono de filtro cuando esta habilitado.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-canvas"]',
      _skipIfMissing: true,
      popover: {
        title: 'Menu avanzado de celda',
        description: 'La guia abrira menu contextual para fondo, tamano y formato.',
        side: asSide('left'),
        align: asAlign('start'),
        onNextClick: () => opts.onOpenCellsMenu(),
      },
    },
    {
      element: '[data-tour="reporte-designer-cell-menu"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Propiedades avanzadas',
        description: 'Desde aqui ajustas tamano, color, fondo y estilos.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-cell-menu-font-size"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Tamano de texto',
        description: 'Configura el tamano de fuente de la celda activa.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-cell-menu-background"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Fondo de celda',
        description: 'Aplica color de fondo a la celda seleccionada.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-canvas"]',
      _skipIfMissing: true,
      popover: {
        title: 'Combinar celdas',
        description: 'Abrimos modo combinar para unir o descombinar celdas.',
        side: asSide('left'),
        align: asAlign('start'),
        onNextClick: () => opts.onOpenCellsMergeMenu(),
      },
    },
    {
      element: '[data-tour="reporte-designer-cell-menu-merge-selection"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Combinar seleccion',
        description: 'Une un rango seleccionado para cabeceras o bloques.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
  ];

  const tablas: ReporteDesignerTourStep[] = [
    {
      element: '[data-tour="reporte-designer-meta-dataset"]',
      _skipIfMissing: true,
      popover: {
        title: 'Origen de datos',
        description: 'Primero define el dataset que alimenta tus tablas.',
        side: asSide('bottom'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-palette-table"]',
      _skipIfMissing: true,
      popover: {
        title: 'Insertar tabla',
        description: 'Agrega una tabla vinculada al dataset actual.',
        side: asSide('right'),
        align: asAlign('center'),
        onNextClick: () => opts.onCreateTableElement(),
      },
    },
    {
      element: '[data-tour="reporte-designer-prop-table"]',
      _skipIfMissing: true,
      popover: {
        title: 'Columnas de tabla',
        description: 'Edita headers, field binding y ancho por columna.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-prop-table-fields"]',
      _skipIfMissing: true,
      popover: {
        title: 'Campos del dataset',
        description: 'Usa los chips para agregar campos reales rapido.',
        side: asSide('right'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-canvas"]',
      _skipIfMissing: true,
      popover: {
        title: 'Menu de tabla',
        description: 'La guia abre menu para insertar campos y ajustar estructura.',
        side: asSide('left'),
        align: asAlign('start'),
        onNextClick: () => opts.onOpenTableMenu(),
      },
    },
    {
      element: '[data-tour="reporte-designer-table-menu"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Editor de tabla',
        description: 'Gestiona columnas y mapping del dataset.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-table-menu-field"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Seleccionar campo',
        description: 'Elige el campo del dataset para agregarlo como columna.',
        side: asSide('left'),
        align: asAlign('start'),
      },
    },
    {
      element: '[data-tour="reporte-designer-table-menu-add-field"]',
      _skipIfMissing: true,
      _isModalStep: true,
      popover: {
        title: 'Agregar campo',
        description: 'Inserta la columna seleccionada en la tabla.',
        side: asSide('left'),
        align: asAlign('center'),
      },
    },
  ];

  if (opts.mode === 'meta') return [...base, ...meta];
  if (opts.mode === 'atajos') return [...base, ...meta, ...atajos];
  if (opts.mode === 'componentes') return [...base, ...componentes];
  if (opts.mode === 'crear') return [...base, ...componentes, ...crear];
  if (opts.mode === 'celdas') return [...base, ...componentes, ...celdas];
  if (opts.mode === 'tablas') return [...base, ...meta, ...componentes, ...tablas];
  if (opts.mode === 'acciones') return [...base, ...acciones];

  return [...base, ...meta, ...atajos, ...componentes, ...crear, ...celdas, ...tablas, ...acciones];
}
