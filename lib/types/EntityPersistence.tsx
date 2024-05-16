import { SourceSystem } from './SourceSystem';

export class EntityPersistence<TKey> {
  id?: TKey;
  origenSistema?: SourceSystem;
  fechaCreacion?: Date | string;
  usuarioCreacion?: string;
  fechaEliminacion?: Date | string;
  usuarioEliminacion?: string;
  fechaDeUltimaModificacion?: Date | string;
  usuarioUltimaModificacion?: string;
}
