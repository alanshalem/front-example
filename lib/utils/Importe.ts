export const transformNumberForTextInput = (
  inputNumber: number | string
): string => {
  const parsedNumber =
    typeof inputNumber === 'string'
      ? parseFloat(inputNumber.replace(',', '.'))
      : parseFloat(inputNumber.toString());

  if (isNaN(parsedNumber)) {
    return '';
  }

  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  };

  const formattedNumber = new Intl.NumberFormat('es-AR', options).format(
    parsedNumber
  );

  return formattedNumber;
};

export function formatNumberForInput(numero: string | number): string {
  const numeroString: string =
    typeof numero === 'number' ? numero.toString() : numero;

  if (numeroString === '') {
    return '';
  }

  const partes: string[] = numeroString.split('.');

  let parteEntera: string =
    partes[0] !== '' ? partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';

  const parteDecimal: string = partes[1] ? partes[1].slice(0, 2) : '00';

  const numeroFormateado: string = `${parteEntera},${parteDecimal}`;
  return numeroFormateado;
};

export function convertStringANumberDecimal(numeroString: string | number): number {
  let numeroLimpio = numeroString.toString().replace(/\./g, ',');

  numeroLimpio = numeroLimpio.replace(/(?<=\d),(?=\d{3}(\D|$))/g, '');

  numeroLimpio = numeroLimpio.replace(/,/g, '.');

  return parseFloat(numeroLimpio)
};
