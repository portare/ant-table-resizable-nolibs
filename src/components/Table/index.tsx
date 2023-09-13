import { Table, TableProps } from 'antd'
import { useRef, useState } from "react";

export type TProps<RecordType extends Record<string, any>> = Omit<TableProps<RecordType>, 'columns'> & {
  columns: NonNullable<TableProps<RecordType>['columns']>
};

export const ResizableTable = <RecordType extends Record<string, any>>({columns: columnsProp, ...tableProps}: TProps<RecordType>) => {
  const [ columns, setColumns ] = useState(columnsProp);

  const tableRef = useRef<any>(null)

  const handleResize = (columnIndex: number, width: number) => {
    // tableNode.style.width todo add calculating all form width when resize columns
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      newColumns[columnIndex] = {
        ...newColumns[columnIndex],
        width,
      };
      return newColumns;
    });
  };

  let startX = 0;
  let startWidth = 0;
  let resizingColumnIndex: number | null = null;

  const handleMouseDown = (e: MouseEvent, columnIndex: number) => {
    startX = e.pageX;
    startWidth = tableRef.current?.querySelectorAll('th.ant-table-cell')[columnIndex].getBoundingClientRect().width;
    resizingColumnIndex = columnIndex;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingColumnIndex !== null) {
      const offsetX = e.pageX - startX;
      const newWidth = startWidth + offsetX;

      if (newWidth > 0) {
        handleResize(resizingColumnIndex, newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    resizingColumnIndex = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
      <Table
        ref={tableRef}
        {...tableProps}
        scroll={{
          x: true
        }}
        columns={columns.map((column, index) => {
          return ({
            ...column,
            title: column.title,
            onHeaderCell: () => {
             return {
               onMouseDown: (e: MouseEvent) => {
                 handleMouseDown(e, index);
               },
               onMouseUp: handleMouseUp,
               onMouseMove: handleMouseMove
             }
            },
          })
        })}

      />
  );
};