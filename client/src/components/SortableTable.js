import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background: #2C2C2C;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #c3ac83;
  cursor: pointer;
  border-bottom: 1px solid #c3ac83;
  user-select: none;
  
  &:hover {
    background: #3a3a3a;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #c3ac83;
  color: #c3ac83;
`;

const SortIcon = styled.span`
  margin-left: 0.5rem;
  font-size: 0.8rem;
`;

const SortableTable = ({ 
  data, 
  columns, 
  defaultSort = null,
  defaultSortDirection = 'asc'
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSort,
    direction: defaultSortDirection
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Helper function to get nested property values
  const getNestedValue = (obj, key) => {
    if (key.includes('.')) {
      const keys = key.split('.');
      return keys.reduce((currentObj, k) => currentObj?.[k], obj);
    }
    return obj[key];
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue = getNestedValue(a, sortConfig.key);
      let bValue = getNestedValue(b, sortConfig.key);

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to string for comparison if not numbers
      if (typeof aValue !== 'number' && typeof bValue !== 'number') {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort />;
    }
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => (
            <TableHeader
              key={column.key}
              onClick={() => column.sortable !== false && handleSort(column.key)}
              style={{ cursor: column.sortable !== false ? 'pointer' : 'default' }}
            >
              {column.label}
              {column.sortable !== false && (
                <SortIcon>
                  {getSortIcon(column.key)}
                </SortIcon>
              )}
            </TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, index) => (
          <tr key={row.id || index}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render ? column.render(row) : getNestedValue(row, column.key)}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SortableTable; 