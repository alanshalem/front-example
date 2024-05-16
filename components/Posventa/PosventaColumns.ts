// La tabla principal debe tener: nroOp/secuencia - tipoPosventa - concepto - montoOriginal - montoADevolver - montoACobrar - fechaAprobacion - estado - tres puntitos del workflow
// La tabla secundaria debe tener: montoOperacion - codConcepto - razonSocial - CUIT - legajoCreacion
export const columnasTablaPrincipal = [
  {
    text: 'Nro. Operacion',
    dataField: 'nroOperacion',
    sort: true,
    label: true,
  },
  {
    text: 'Tipo Posventa',
    dataField: 'tipoPosventa',
    sort: true,
    label: true,
  },
  {
    text: 'Concepto',
    dataField: 'concepto',
    sort: true,
  },
  {
    text: 'Monto Original',
    dataField: 'montoOriginal',
    sort: true,
  },
  {
    text: 'Monto a Acreditar',
    dataField: 'montoADevolver',
    sort: true,
  },
  {
    text: 'Monto a Debitar',
    dataField: 'montoACobrar',
    sort: true,
  },
  {
    text: 'Fecha de Aprobacion',
    dataField: 'fechaAprobacion',
    sort: true,
    formatter: cell => {
      const date = cell ? new Date(Date.parse(cell)) : null;
      return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-';
    },
  },
  {
    text: 'Estado',
    dataField: 'descEstado',
    sort: true,
  },
  { text: '', dataField: 'elipse', sort: false },
];

export const columnasTablaSecundaria = [
  {
    text: 'Monto Operacion',
    dataField: 'montoOperacion',
    sort: true,
  },
  {
    text: 'Concepto',
    dataField: 'codConcepto',
    sort: true,
  },
  {
    text: 'Razon Social',
    dataField: 'razonSocial',
    sort: true,
  },
  {
    text: 'CUIT',
    dataField: 'cuit',
    sort: true,
    label: true,
  },
  {
    text: 'Legajo Creacion',
    dataField: 'legajoCreacion',
    sort: true,
  },
];

export const columnasTable = [
  {
    text: 'Nro. Operacion',
    dataField: 'nroOperacionSecuencia',
    sort: true,
    label: true,
  },
  {
    text: 'Tipo Posventa',
    dataField: 'tipoPosventa',
    sort: true,
    label: true,
  },
  {
    text: 'Cod. Concepto',
    dataField: 'concepto',
    sort: true,
  },
  {
    text: 'Monto Original',
    dataField: 'montoOriginal',
    sort: true,
  },
  {
    text: 'Monto a Acreditar',
    dataField: 'montoDevolver',
    sort: true,
  },
  {
    text: 'Monto a Debitar',
    dataField: 'montoCobrar',
    sort: true,
  },
  {
    text: 'Fecha de Aprobacion',
    dataField: 'fechaAprobacion',
    sort: true,
    formatter: cell => {
      const date = cell ? new Date(Date.parse(cell)) : null;
      return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-';
    },
  },
  {
    text: 'Log',
    dataField: 'log',
    sort: true,
  },
  {
    text: 'Estado',
    dataField: 'descEstado',
    sort: true,
  },
  { text: '', dataField: 'elipse', sort: false },
];
