import { esNumero } from './StringUtils';

/**
 * Patron Singleton para validar numeros de permisos de embarque y depachos de importacion
 */
export abstract class ValidadorDeNumerosDeSeguimiento {
  protected static instancia: ValidadorDeNumerosDeSeguimiento;

  protected static crearInstancia(
    instancia: ValidadorDeNumerosDeSeguimiento
  ): ValidadorDeNumerosDeSeguimiento {
    if (!ValidadorDeNumerosDeSeguimiento.instancia) {
      ValidadorDeNumerosDeSeguimiento.instancia = instancia;
    }
    return ValidadorDeNumerosDeSeguimiento.instancia;
  }

  /**
   * Valida si el numero es un numero de permiso de embarque valido
   * Formato Permiso de Embarque: AANNNEEEE9999999D. Ej: 20073EC01018302F
   *                       donde: AA       es el año
   *                              NNN      es el nro de aduana
   *                              EEEE     es el tipo de exportacion
   *                              999999   es el nro de permiso
   *                              D        es el digito verificador
   * @param numeroDePermisoDeEmbarque numero de permiso de embarque a validar
   * @returns true si el parametro @numeroDePermisoDeEmbarque es un numero de PE valido, false en caso contrario
   */
  public validarNumeroDeSeguimiento(
    numeroDeSeguimiento: string | undefined
  ): boolean {
    if (!numeroDeSeguimiento || numeroDeSeguimiento === '') {
      return false;
    }
    numeroDeSeguimiento = numeroDeSeguimiento.trim();

    if (!esNumero(numeroDeSeguimiento.slice(0, 5))) {
      //los primeros 5 son numeros
      return false;
    }
    if (!esNumero(numeroDeSeguimiento.slice(9, 15))) {
      //del 9 al 15 son numeros
      return false;
    }
    if (esNumero(numeroDeSeguimiento.slice(15, 16))) {
      //el ultimo digito es un caracter
      return false;
    }
    if (['CI', 'CE', 'CC'].indexOf(numeroDeSeguimiento.slice(5, 7)) >= 0) {
      //6 y 7 no pueden ser: "CI", "CE" ni "CC"
      return false;
    }
    if (esNumero(numeroDeSeguimiento.slice(5, 6))) {
      //caracter 6 no puede ser numerico
      return false;
    }
    if (esNumero(numeroDeSeguimiento.slice(6, 7))) {
      //caracter 7 no puede ser numerico
      return false;
    }
    if (
      this.getArrayDeValidacionDeCaracteres6Al10().indexOf(
        numeroDeSeguimiento.slice(5, 9)
      ) >= 0
    ) {
      //6 al 10 no pueden ser: "DJAI","MANI","PART","DJAS" ni "DAPE", solo puede ser "SIMI" o "SIRA"
      return false;
    }
    return (
      numeroDeSeguimiento.slice(15, 16) ===
      this.calcularDigitoVerificador(numeroDeSeguimiento)
    );
  }

  /**
   * Devolver el grupo de textos que no pueden existir en los caracteres 6 al 10.
   * Ejemplo: return ["DJAI","MANI","PART","DJAS","DAPE"];
   */
  protected abstract getArrayDeValidacionDeCaracteres6Al10(): string[];

  /**
   * Calcula el digito verificador
   * @param numeroDeSeguimiento
   * @returns el digito verificador calculado que le corresponde
   */
  private calcularDigitoVerificador(numeroDeSeguimiento: string): string {
    let suma = 0;
    for (let i = 0; i < 15; i++) {
      const codigoAscii = numeroDeSeguimiento.charCodeAt(i);
      suma += codigoAscii;
    }
    const modulo23 = suma % 23;
    const codigoAscii = modulo23 + 65;
    let digitoVerificador = String.fromCharCode(codigoAscii);

    switch (digitoVerificador) {
      case 'I':
        digitoVerificador = 'X';
        break;
      case 'O':
        digitoVerificador = 'Y';
        break;
      case 'Q':
        digitoVerificador = 'Z';
        break;
    }
    return digitoVerificador;
  }
}
