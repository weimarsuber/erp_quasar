import { useState } from 'react';
import { Search, Grid, Maximize2, Download, X, SortAsc, SortDesc } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  addLabel?: string;
  filename?: string;
}

export default function DataTable<T>({ 
  data, 
  columns, 
  onAdd, 
  addLabel = "REGISTRAR",
  filename = "export" 
}: DataTableProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const search = searchParams.get('search') || '';
  const filters = Object.fromEntries(
    columns.map(col => [col.key, searchParams.get(col.key) || ''])
  );

  const handleSearch = (value: string) => {
    searchParams.set('search', value);
    setSearchParams(searchParams);
  };

  const handleFilterChange = (column: keyof T, value: string) => {
    if (value) {
      searchParams.set(column.toString(), value);
    } else {
      searchParams.delete(column.toString());
    }
    setSearchParams(searchParams);
  };

  const handleSort = (column: keyof T) => {
    if (!columns.find(col => col.key === column)?.sortable) return;

    setSortConfig(current => {
      if (current?.key === column) {
        if (current.direction === 'asc') {
          return { key: column, direction: 'desc' };
        }
        return null;
      }
      return { key: column, direction: 'asc' };
    });
  };

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    );

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      const itemValue = item[key as keyof T]?.toString().toLowerCase();
      return itemValue?.includes(value.toLowerCase());
    });

    return matchesSearch && matchesFilters;
  });

  const sortedData = sortConfig
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        
        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      })
    : filteredData;

  const exportToCSV = () => {
    const headers = columns.map(col => col.title).join(',');
    const rows = sortedData.map(item =>
      columns
        .map(col => {
          const value = item[col.key];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        })
        .join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  return (
    <div className={`bg-white rounded-lg shadow ${isMaximized ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          {onAdd && (
            <button
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              + {addLabel}
            </button>
          )}
          
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGridView(!isGridView)}
              className={`p-2 rounded-md ${
                isGridView ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={exportToCSV}
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          {columns.map(column => (
            <div key={column.key.toString()} className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={filters[column.key]}
                onChange={(e) => handleFilterChange(column.key, e.target.value)}
                placeholder={`Filtrar por ${column.title}`}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {isGridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sortedData.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-2">
                {columns.map(column => (
                  <div key={column.key.toString()}>
                    <dt className="text-sm font-medium text-gray-500">{column.title}</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]?.toString()}
                    </dd>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key.toString()}
                    onClick={() => handleSort(column.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {column.sortable && sortConfig?.key === column.key && (
                        {
                          'asc': <SortAsc className="h-4 w-4" />,
                          'desc': <SortDesc className="h-4 w-4" />
                        }[sortConfig.direction]
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((item, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={column.key.toString()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}