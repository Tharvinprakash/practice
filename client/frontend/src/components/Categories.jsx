import { useState } from "react";
import { categoryAPI } from "../api/category";
import { useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import Table from "./ui/Table";


const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  },[])

  const fetchCategories = async() => {
    const res = await categoryAPI.getCategory();
    console.log(res.data.data)
    setCategories(res.data.data);
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
      accessor: "is_active",
      header: "Active",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.is_active}
        </div>
      ),
    },
    {
      accessor: "is_delete",
      header: "Delete",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.is_delete}
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
      <Table columns={columns} data={categories} />
    </div>
  );
};

export default Categories;