'use client'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from '@nextui-org/react'

const rows = [
  {
    id: '1',
    name: 'A+B',
    pass: '30',
    score: '100/100',
  },
  {
    id: '2',
    name: 'A*B',
    pass: '27',
    score: '100/100',
  },
  {
    id: '3',
    name: 'Grading',
    pass: '14',
    score: '0/100',
  },
  {
    id: '4',
    name: 'Pyramid 1',
    pass: '15',
    score: '0/100',
  },
  {
    id: '5',
    name: 'Hill',
    pass: '4',
    score: '30/100',
  },
]

const columns = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'pass',
    label: 'PASS',
  },
  {
    key: 'score',
    label: 'SCORE',
  },
]

export default function ProblemsTable() {
  return (
    <Table isStriped aria-label="Problems List">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      {rows.length ? (
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="cursor-pointer py-3">
                  {getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      ) : (
        <TableBody emptyContent={'No problems to display.'}>{[]}</TableBody>
      )}
    </Table>
  )
}
