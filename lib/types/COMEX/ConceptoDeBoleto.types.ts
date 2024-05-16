import { GrupoDeConceptoDeBoleto } from './GrupoDeConceptoDeBoleto.types';
import { EntityAudit } from '../EntityAudit';

export class ConceptoDeBoleto extends EntityAudit<number> {
  codigo?: string;
  descripcion?: string ;
  idGrupoDeConceptoDeBoleto?: string ;
  grupoDeConceptoDeBoleto?: GrupoDeConceptoDeBoleto ;
}
