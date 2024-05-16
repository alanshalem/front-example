import { GenericTable } from '@components/Generic/GenericTable'
import React from 'react';

export const GastosRebatesDesplegable = () => {
  //const [info, setInfo] = useState<any>([]);
  //const data = [];

  // lo que esta en comentarios solo para deployar y no tirar error despues cuando este esa data lo agrego
  const columns = [
    {
      dataField: 'nroBoleto',
      text: 'Nro Boleto',
    },
    {
      dataField: 'cotizacion',
      text: 'Cotizacion',
    },
    {
      dataField: 'codigoConcepto',
      text: 'Codigo Concepto',
    },
    {
      dataField: 'legajoUltimaModificacion',
      text: 'Legajo Ultima Modificacion',
    },
    {
      dataField: 'legajoAprobacion',
      text: 'Legajo Aprobacion',
    },
    {
      dataField: 'fechaCreacion',
      text: 'Fecha Creacion',
    },
  ];

  /*
  useEffect(() => {
    const rows: any[] = [];
    if(!!data) {
      data.forEach((e: any) => {
        return pushRows(e, rows);
      })
      setInfo(rows)
    }
  }, [data])*/

  /*function pushRows(e: any, rows: any) {
    return rows.push({
      nroBoleto: e.nroBoleto ? e.nroBoleto : '',
      cotizacion: e.cotizacion ? e.cotizacion : '',
      codigoConcepto: e.codigoConcepto ? e.codigoConcepto : '',
      legajoUltimaModificacion: e.legajoUltimaModificacion ? e.egajoUltimaModificacion : '',
      legajoAprobacion: e.legajoAprobacion ? e.legajoAprobacion : '',
      fechaCreacion: e.fechaCreacion ? e.fechaCreacion : '',
    })
  }*/


  return (
    <div className="container-fluid">
      <GenericTable rows={[]} columns={columns} pagination={false} checks={false} />
    </div>
  )
}