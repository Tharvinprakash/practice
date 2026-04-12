import { useEffect, useState } from "react";
import Table from "./Table";
import { productAPI } from "../../api/product";
import { EllipsisVertical } from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  },[])

  const fetchProducts = async() => {
    const res = await productAPI.getProducts();
    console.log(res.data.data)
    setProducts(res.data.data);
  }

  const columns = [
    {
      accessor: "image",
      header: "Image",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.image}
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
      accessor: "price",
      header: "Price",
      render: (row, rowIndex) => (
        <div className="font-medium text-gray-900 hover:underline hover:text-sky-700 cursor-pointer">
          {row.selling_price}
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
          <EllipsisVertical size={20}/>
        </div>
      ),
    },
  ];
  
  return (
    <div>
      <Table columns={columns} data={products} />
    </div>
  );
};

export default Products;
