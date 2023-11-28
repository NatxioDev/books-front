import { Button } from "@nextui-org/button";
import UsersTable from "@/app/ui/customers/users-table";
import SalesTable from "@/app/ui/sales/sales-table";
export default function Page() {
  return (
    <div>
      <div>
        <h1 className="text-center text-4xl mb-4">Sales</h1>
      </div>
      <SalesTable />
    </div>
  );
}
