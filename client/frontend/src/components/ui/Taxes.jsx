import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./Table";
import { quotationAPI } from "../../api/quotation";
import { taxAPI } from "../../api/tax";


//  TODO :  Need to Rework on Table

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    const res = await taxAPI.getTaxes();
    console.log(res.data.data);
    setTaxes(res.data.data);
  };

  const columns = [
    // {
    //   accessor: "logo_img",
    //   header: "Logo",
    //   render: (row, rowIndex) => (
    //     <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
    //       {row.logo_img}
    //     </div>
    //   ),
    // },
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
      accessor: "percent",
      header: "Percentage",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.percent}
        </div>
      ),
    },
    {
      accessor: "is_active",
      header: "Active",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.is_active}
        </div>
      ),
    },
    {
      accessor: "created_by",
      header: "Created By",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.created_by}
        </div>
      ),
    },
    {
      accessor: "updated_by",
      header: "Updated By",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.updated_by}
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
      <Table columns={columns} data={taxes} />
    </div>
  );
};

export default Taxes;
