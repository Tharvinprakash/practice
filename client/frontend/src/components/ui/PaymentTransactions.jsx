import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./Table";
import { quotationAPI } from "../../api/quotation";
import { taxAPI } from "../../api/tax";
import { unitAPI } from "../../api/unit";
import { paymentAPI } from "../../api/payment";

// Need to Rework on Bsckend API & Table

const PaymentTransactions = () => {
  const [paymentTransactions, setPaymentTransactions] = useState([]);

  useEffect(() => {
    fetchPaymentTransactions();
  }, []);

  const fetchPaymentTransactions = async () => {
    const res = await paymentAPI.getPayments();
    console.log(res.data.data);
    setPaymentTransactions(res.data.data);
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
      accessor: "type",
      header: "Payment Type",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.type}
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
      <Table columns={columns} data={paymentTransactions} />
    </div>
  );
};

export default PaymentTransactions;
