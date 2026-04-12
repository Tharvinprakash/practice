import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./Table";
import { quotationAPI } from "../../api/quotation";
import { taxAPI } from "../../api/tax";
import { unitAPI } from "../../api/unit";



const Units = () => {
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    const res = await unitAPI.getUnits();
    console.log(res.data.data);
    setUnits(res.data.data);
  };

  const columns = [
    {
      accessor: "name",
      header: "Name",
      // align: "left",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.name}
        </div>
      ),
    },
    {
      accessor: "unit_name",
      header: "Unit Name",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.unit_name}
        </div>
      ),
    },
    {
      accessor: "actions",
      header: "Actions",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          <EllipsisVertical size={20} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} data={units} />
    </div>
  );
};

export default Units;
