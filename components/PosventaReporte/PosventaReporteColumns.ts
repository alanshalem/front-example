export const columnasReporteTable = [
  {
    text: 'Nro. Operacion',
    dataField: 'nroOperacion',
    sort: true,
    label: true,
  },
  {
    text: 'Secuencia',
    dataField: 'secuencia',
    sort: true,
    label: true,
  },
  {
    text: 'Aplicación',
    dataField: 'aplicacion',
    sort: true,
    label: true,
  },
  {
    text: 'CUIT',
    dataField: 'cuit',
    sort: true,
    label: true,
  },
  {
    text: 'Razon Social',
    dataField: 'razonSocial',
    sort: true,
    label: true,
  },
  {
    text: 'Concepto',
    dataField: 'concepto',
    sort: true,
    label: true,
  },
  {
    text: 'Devolucion/Cobro',
    dataField: 'tipoPosVenta',
    sort: true,
    label: true,
  },
  {
    text: 'Monto',
    dataField: 'monto',
    sort: true,
    label: true,
  },
  {
    text: 'Fecha de Aprobación',
    dataField: 'fechaAprobacion',
    sort: true,
    formatter: cell => {
      const date = cell ? new Date(Date.parse(cell)) : null;
      return date && !isNaN(date.getTime()) ? date.toLocaleDateString() : '-';
    },
    label: true,
  },
  {
    text: 'Legajo de Creación',
    dataField: 'legajoCreacion',
    sort: true,
    label: true,
  },
  {
    text: 'Estado',
    dataField: 'estado',
    sort: true,
    label: true,
  },
];
