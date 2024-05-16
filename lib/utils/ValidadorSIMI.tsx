import {ValidadorDeNumerosDeSeguimiento}  from "./ValidadorDeNumerosDeSeguimiento";

export class ValidadorSIMI extends ValidadorDeNumerosDeSeguimiento {
    /*** el constructor es siempre privado en un Singleton */
    private constructor() {
        super();
    }

    public static get(): ValidadorDeNumerosDeSeguimiento {
        return this.crearInstancia( new ValidadorSIMI() );
    }

    protected getArrayDeValidacionDeCaracteres6Al10() : string[] {
        return [];
    }
}
