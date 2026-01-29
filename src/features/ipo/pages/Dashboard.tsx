import { ipoColumns } from "../data/columns";
import { ipoData } from "../data/ipoData";
import IPOTable from "../components/IPOTable";

export const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <IPOTable columns={ipoColumns} data={ipoData} />
    </div>
  );
};
