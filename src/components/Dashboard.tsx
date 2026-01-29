import { ipoColumns } from "../data/columns"
import { ipoData } from "../data/ipoData"
import IPOTable from "./IPOTable"

export const Dashboard = () => {
  return (
    <>
    <IPOTable columns={ipoColumns} data={ipoData} />;  
  </>
  )
}
