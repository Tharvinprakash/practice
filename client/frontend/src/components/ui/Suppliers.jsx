import { EllipsisVertical } from "lucide-react";
import { supplierAPI } from "../../api/supplier";
import Table from "./Table";
import { useEffect, useState } from "react";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  },[])

  const fetchSuppliers = async() => {
    const res = await supplierAPI.getSuppliers();
    console.log(res.data.data)
    setSuppliers(res.data.data);
  }

  const columns = [,
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
      accessor: "email",
      header: "Email",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.email}
        </div>
      ),
    },
    {
      accessor: "phone_no",
      header: "Phone Number",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.phone_no}
        </div>
      ),
    },
    {
      accessor: "actions",
      header: "Actions",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          <EllipsisVertical size={20}/>
        </div>
      ),
    },
  ];
  
  return (
    <div>
      <Table columns={columns} data={suppliers} />
    </div>
  );
};

export default Suppliers