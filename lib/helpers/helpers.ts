export const unUtilitario = () => {
  return 'soy un utilitario';
};

export const isEmpty = (value: undefined | string) => {
  return value === undefined || value === null || value === '';
};

const checkParts = (decimal: string) => {
  if (decimal) {
    return decimal;
  } else {
    return '00';
  }
};

const columnasBase = [
  {
    text: 'Fecha de Creacion',
    dataField: 'fechaCreacion',
    sort: true,
    label: true,
  },
  {
    text: 'Nro. de Operacion',
    dataField: 'nroOperacion',
    sort: true,
  },
  {
    text: 'Monto',
    dataField: 'monto',
    sort: true,
    currency: '$',
    arsCurrencyFormat: true,
    currencyPosition: 'before',
  },
  {
    text: 'Divisa',
    dataField: 'divisa',
    sort: true,
  },
];

// las de posventa
export const columnasTable = [
  {
    text: 'CUIT',
    dataField: 'cuit',
    sort: true,
    label: true,
  },
  ...columnasBase,
  {
    text: 'Concepto',
    dataField: 'concepto',
    sort: true,
  },
  {
    text: 'Estado',
    dataField: 'descEstado',
    sort: true,
  },
];

export const columnasContabilidad = [
  {
    text: 'Evento',
    dataField: 'evento',
    sort: true,
    label: true,
  },
  ...columnasBase,
  {
    text: 'Estado',
    dataField: 'estado',
    sort: true,
  },
];

export const columnasTableExpandible = [
  {
    text: 'Impuesto',
    dataField: 'impuesto',
    sort: true,
    label: true,
  },
  {
    text: 'Monto Original',
    dataField: 'montoOriginal',
    sort: true,
    currency: '$',
    arsCurrencyFormat: true,
    currencyPosition: 'before',
  },
  {
    text: 'Monto a Acreditar',
    dataField: 'montoADevolver',
    sort: true,
    currency: '$',
    arsCurrencyFormat: true,
    currencyPosition: 'before',
  },
  {
    text: 'Divisa',
    dataField: 'divisa',
    sort: true,
  },
];

export function formatNumber(input: string): string {
  // Convert the input string to a number
  const number = parseFloat(input); // Check if the input is a valid number
  if (isNaN(number)) {
    throw new Error('Invalid input: not a number');
  } // Convert the number to a formatted string
  const formatted = number.toLocaleString('es-AR'); // Split the formatted string into integer and decimal parts
  const parts = formatted.split(','); // Insert a dot separator for every 3 digits in the integer part
  const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Combine the integer and decimal parts with a comma separator
  checkParts(parts[1]);
  return `${integer},${checkParts(parts[1])}`;
}
