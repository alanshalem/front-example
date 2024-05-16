export function formatDateUS(date: Date): string {
  const aux = new Date(date);
  const dd = aux
    .getDate()
    .toString()
    .padStart(2, '0');
  const mm = (aux.getMonth() + 1).toString().padStart(2, '0');
  const yyyy = aux
    .getFullYear()
    .toString()
    .padStart(4, '0');

  return `${yyyy}-${mm}-${dd}T00:00:00`;
} 

export const getMonthName = (monthNumber: number): string => {
  const date = new Date();
  date.setMonth(monthNumber);

  return date.toLocaleString('es-AR', { month: 'short' });
};

export const formatDateYYYYMM = (date: Date | string): string | null => {
  if (date === null) {
    return null;
  }
  if (typeof date === 'string') {
    return date.replace('/', '');
  }
  const aux = new Date(date);
  const yyyy = aux
    .getFullYear()
    .toString()
    .padStart(4, '0');
  const mm = (aux.getMonth() + 1).toString().padStart(2, '0');
  return `${yyyy}${mm}`;
};

export const convertirFechaAISO8601 = (fecha: string): string => {
  try {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(fecha)) {
      return fecha;
    } else {
      const partesFecha = fecha.toString().split('/');

      if (partesFecha.length === 3) {
        const [day, month, year] = partesFecha.map(part => parseInt(part, 10));

        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1000 &&
          year <= 9999
        ) {
          const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
          return utcDate.toISOString();
        }
      }
      return fecha;
    }
  } catch (error) {
    throw error;
  }
};

export const transformarFecha = (fechaString: string): Date | string => {
  const ejemploFormato = /^\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[-+]\d{4} \(.+\)$/;

  if (ejemploFormato.test(fechaString)) {
    return fechaString;
  }
  const partesFecha = fechaString.split('/');
  const [dd, mm, yyyy] = partesFecha;
  const fechaEnFormato = new Date(`${mm}/${dd}/${yyyy}`);
  return fechaEnFormato;
};

export const convertISO8601ToDDMMAAAA = (
  fecha: string | null | undefined
): string => {
  if (!fecha) {
    return '';
  } else {
    const fechaISO = new Date(fecha);
    const dia = fechaISO
      .getDate()
      .toString()
      .padStart(2, '0');
    const mes = (fechaISO.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaISO.getFullYear().toString();
    return `${dia}/${mes}/${año}`;
  }
};
