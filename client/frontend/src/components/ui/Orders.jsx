import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./Table";
import { quotationAPI } from "../../api/quotation";
import { taxAPI } from "../../api/tax";
import { unitAPI } from "../../api/unit";
import { paymentAPI } from "../../api/payment";
import { orderAPI } from "../../api/order";

// Need to check on Backend API & Table

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await orderAPI.getOrders();
    console.log(res.data.data);
    setOrders(res.data.data);
  };

  const columns = [
    {
      accessor: "invoice_number",
      header: "Invoice Number",
      // align: "left",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.invoice_number}
        </div>
      ),
    },
    {
      accessor: "name",
      header: "Client Name",
      // align: "left",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.name}
        </div>
      ),
    },
    {
      accessor: "staff_name",
      header: "Staff Name",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.staff_name}
        </div>
      ),
    },
    {
        accessor: "product_name",
        header: "Product Name",
        render: (row, rowIndex) => (
            <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.product_name}
        </div>
      ),
    },
    {
      accessor: "is_paid",
      header: "Payment Status",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.is_paid}
        </div>
      ),
    },
    {
      accessor: "grand_total",
      header: "Total",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.grand_total}
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
      <Table columns={columns} data={orders} />
    </div>
  );
};

export default Orders;
