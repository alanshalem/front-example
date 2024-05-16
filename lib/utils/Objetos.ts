export function validarCamposNulos<T>(objeto: T): boolean {
  for (const campo in objeto) {
    const valor = objeto[campo];
    if (
      valor === null ||
      valor === '' ||
      (typeof valor === 'string' && valor.trim() === '') ||
      (typeof valor === 'number' && valor === 0)
    ) {
      return true;
    }
    if (typeof valor === 'object' && !Array.isArray(valor)) {
      if (validarCamposNulos(valor)) {
        return true;
      }
    }
  }
  return false;
}
