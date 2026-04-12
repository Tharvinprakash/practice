import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./Table";
import { stockAPI } from "../../api/stock";

const Stocks = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    const res = await stockAPI.getLowStocks();
    console.log(res.data.data);
    setStocks(res.data.data);
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
      accessor: "quantity",
      header: "Quantity",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.quantity}
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
      <Table columns={columns} data={stocks} />
    </div>
  );
};

export default Stocks;
