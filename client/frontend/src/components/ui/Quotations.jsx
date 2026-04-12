import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./Table";
import { quotationAPI } from "../../api/quotation";


//  TODO :  Need to Rework on Table

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const res = await quotationAPI.getQuotation();
    console.log(res.data.data);
    setQuotations(res.data.data);
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
      accessor: "ref_no",
      header: "Reference Number",
      // align: "left",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.ref_no}
        </div>
      ),
    },
    {
      accessor: "supplier_id",
      header: "Supplier",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.supplier_id}
        </div>
      ),
    },
    {
      accessor: "added_by",
      header: "Added By",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.added_by}
        </div>
      ),
    },
    {
      accessor: "discount",
      header: "Discount",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.discount}
        </div>
      ),
    },
    {
      accessor: "payment_status",
      header: "Payment Status",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.payment_status}
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
      <Table columns={columns} data={quotations} />
    </div>
  );
};

export default Quotations;
