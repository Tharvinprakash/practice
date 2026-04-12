import { useState } from "react";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { brandAPI } from "../../api/brand";
import Table from "./Table";

const Brands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    const res = await brandAPI.getBrands();
    console.log(res.data.data);
    setBrands(res.data.data);
  };

  const columns = [
    {
      accessor: "logo_img",
      header: "Logo",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.logo_img}
        </div>
      ),
    },
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
      accessor: "name_slug",
      header: "Slug",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.name_slug}
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
      <Table columns={columns} data={brands} />
    </div>
  );
};

export default Brands;
