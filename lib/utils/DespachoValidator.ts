import { ValidadorSIMI } from "./ValidadorSIMI";
/*----------------------------------------------------------------------------------------------------------------------*/
/**
 * Valida si el numero es un numero de despacho de importacion es valido
 * Formato Despacho de Importacion: AANNNEEEE9999999D. Ej: 20073EC01018302F
 *                       donde: AA       es el año
 *                              NNN      es el nro de aduana
 *                              EEEE     es el tipo
 *                              999999   es el nro
 *                              D        es el digito verificador
 * @param numeroDeDespachoDeImportacion numero de despacho de importacion a validar
 * @returns true si el parametro @numeroDeDespachoDeImportacion es un numero de DI valido, false en caso contrario
 */
export function validarNumeroDeDespachoDeImportacion(numeroDeDespachoDeImportacion:string|undefined): boolean {
    return ValidadorSIMI.get().validarNumeroDeSeguimiento( numeroDeDespachoDeImportacion );
}
