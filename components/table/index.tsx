import { DataGrid, GridColDef, GridRowsProp, GridToolbar } from '@mui/x-data-grid'
import React from 'react'

interface TableProps {
  width: string | number
  height: string | number
  rows: GridRowsProp
  columns: GridColDef[]
  rowSelection?: boolean
  includeToolbar?: boolean
  autoPageSize?: boolean
  rowClassName?: string
  footerHexColor?: string
  hidePagination?: boolean
  className?: string
  density?: 'compact' | 'standard' | 'comfortable'
}
const Table = ({
  width,
  height,
  rows,
  columns,
  autoPageSize = false,
  rowClassName = 'bg-brand-100 text-xs md:text-sm lg:text-base',
  rowSelection = false,
  includeToolbar = true,
  footerHexColor = '#DBE4EE',
  hidePagination = false,
  className = '',
  density = 'comfortable',
}: TableProps) => {
  return (
    <div style={{ height: height, width: width }} className={className}>
      <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize={autoPageSize}
        hideFooterPagination={hidePagination}
        pageSizeOptions={[5, 10, 20, 50, 100]}
        density={density}
        getRowClassName={(params) => {
          return rowClassName
        }}
        slotProps={{
          cell: { className: 'font-quicksand' },
        }}
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#A7BFDC',
          },
          '& .MuiDataGrid-row': {
            fontFamily: 'sans-serif !important',
            color: '#29375B !important',
          },
          '& .MuiButtonBase-root': {
            color: '#465B81 !important',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: `${footerHexColor} !important`,
          },
        }}
        rowSelection={rowSelection}
        slots={{
          toolbar: includeToolbar ? GridToolbar : null,
        }}
      />
    </div>
  )
}

export default Table
