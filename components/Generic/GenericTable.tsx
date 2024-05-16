import { Table, TableToolkit } from '@brick/table';
import React from 'react';

interface TableProps {
  rows: any[]; //esto es any pq las filas son dinamicas
  columns: any[]; //tambien las columnas
  mensajeTablaVacia?: string; //mensaje a mostrar cuando la tabla esta vacia
  expandible?: boolean; //determina si la tabla va a ser expandible o no
  pagination?: boolean; // determina si la tabla va a ser paginable o no
  sizePerPage?: number;
  paginationSize?: number;
  editCells?: any;
  checks?: any;
  handleCheck?: (rowsAux: any) => void;
  handleOnSelectAll?: any;
}

export const GenericTable = ({
  rows,
  columns,
  mensajeTablaVacia,
  expandible,
  pagination = true,
  sizePerPage = 10,
  paginationSize = 10,
  editCells,
  checks = true,
  handleCheck,
  handleOnSelectAll,
}: TableProps) => {
  //state definido por bricks para determinar si una fila esta expandida o no
  const [isExpanded, setIsExpanded] = React.useState([]);
  const filteredRows = rows.filter(row => row !== undefined);
  const totalLength = rows?.length;

  const sizes = [
    {
      text: '05',
      value: 5,
    },
    {
      text: '10',
      value: 10,
    },
    {
      text: '15',
      value: 15,
    },
    { text: 'Todos', value: totalLength },
  ];

  return (
    <div className="mb-24">
      <TableToolkit keyField="id" data={filteredRows} columns={columns}>
        {props => (
          <>
            <Table
              {...props.baseProps}
              hover
              zebra
              // widthFix
              data={filteredRows}
              columns={columns}
              checks={checks}
              pagination={filteredRows.length > 0 ? pagination : false}
              sizePerPage={sizePerPage}
              sizePerPageList={sizes}
              paginationSize={paginationSize}
              showPages
              onSelectAll={handleOnSelectAll}
              editCell={editCells}
              handlerCheck={handleCheck}
              textEmpty={mensajeTablaVacia}
              iconEmpty="tooltip"
              expandible={
                expandible && {
                  expandByColumnOnly: false,
                  expanded: isExpanded,
                  onExpand: (row, isRowExpanded) => {
                    isRowExpanded
                      ? setIsExpanded(prev => [...prev, row.id])
                      : setIsExpanded(prev => [
                          ...prev.filter(data => data !== row.id),
                        ]);
                  },
                  onExpandAll: (isExpandAll, results) => {
                    results = results.filter(row => row !== undefined);
                    if (isExpandAll) {
                      setIsExpanded(results.map(el => el.id));
                    } else {
                      setIsExpanded([]);
                    }
                  },
                }
              }
            />
          </>
        )}
      </TableToolkit>
    </div>
  );
};
