const Table = ({
  columns = [],
  data = [],
  loadingMessage = "",
  emptyMessage = "",
  loading = false,
  className = "",
  minHeight = "",
}) => {
  const colCount = columns.length;

  return (
    <div
      className={`bg-white rounded-md shadow overflow-hidden flex flex-col ${className} ${minHeight}`}
    >
      <div className="flex-1 overflow-x-auto">
        <table className="table-fixed min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, ind) => {
                return (
                  <th key={ind} className="px-4 py-2 text-left text-md text-transform: uppercase tracking-wider">
                    {col.header}
                  </th>
                )
              })}
            </tr>
          </thead>
          {loading ? (
            <div></div>
          ) : (
            <tbody className="divide-y divide-gray-200">
              {data.length > 0 ? (
                <>
                  {Array.isArray(data) &&
                    data.map((row, rowIndex,arr) => (
                      <tr key={rowIndex}>
                        {columns.map((col, colIndex) => (
                          <td key={colIndex} className="px-4 py-2">
                            {col.render
                              ? col.render(row, rowIndex)
                              : row[col.accessor] || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                </>
              ) : (
                <div></div>
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Table;
