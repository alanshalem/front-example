import { EntityAudit } from '../EntityAudit';

export class GrupoDeConceptoDeBoleto extends EntityAudit<string> {
  codigo?: string;
  descripcion?: string;
}
