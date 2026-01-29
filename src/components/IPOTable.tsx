import "../style/IPOTable.css";
type Column<T> = {
  header: string;
  accessor: keyof T;
  className?: string;
};
interface Props<T> {
  columns: Column<T>[];
  data: T[];
}
export default function IPOTable<T>({ columns, data }: Props<T>) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr>
              {columns.map((col) => (
                <td
                  key={String(col.accessor)}
                  className={col.className}
                >
                  {String(row[col.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
