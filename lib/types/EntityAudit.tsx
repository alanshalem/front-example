import { EntityPersistence } from './EntityPersistence';

export class EntityAudit<TKey> extends EntityPersistence<TKey> {
  usuarioAutorizante?: string;
  fechaDeAutorizacion?: Date | string;

  // Incluir los metodos hara saltar varias implementaciones, usar EntityAuditUtils
  // estaFirmado():boolean {
  //     return this.usuarioAutorizante === undefined || this.fechaDeAutorizacion === undefined
  // }
  // estaEliminado():boolean {
  //     return this.usuarioEliminacion === undefined || this.fechaEliminacion === undefined
  // }
  // estaFirmadoORechazado():boolean {
  //     return this.estaFirmado() || this.estaEliminado()
  // }
}
