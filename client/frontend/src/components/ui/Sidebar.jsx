import {
  LayoutDashboard,
  ChartBarStacked,
  ShoppingBasket,
  Truck,
  Settings,
  User,
  NotebookPen,
  ScrollText,
  CircleStar,
  Warehouse,
  MessageSquareQuote,
  Landmark,
  RulerDimensionLine,
  HandCoins,
  ArrowLeftRight,
  ReceiptIndianRupee,
  CalendarArrowDown,
  UserRoundKey,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navbar = [
    {
      name: "Dashboard",
      path: "/mainlayout/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Categories",
      path: "/mainlayout/categories",
      icon: ChartBarStacked,
      show: true,
    },
    {
      name: "Products",
      path: "/mainlayout/products",
      icon: ShoppingBasket,
      show: true,
      children: [
        {
          name: "Brands",
          path: "/mainlayout/products/brands",
          icon: CircleStar,
          show: true,
        },
        {
          name: "Stocks",
          path: "/mainlayout/products/stocks",
          icon: Warehouse,
          show: true,
        },
      ],
    },
    {
      name: "Supplier",
      path: "/mainlayout/suppliers",
      icon: Truck,
      show: true,
      children: [
        {
          name: "Quotations",
          path: "/mainlayout/suppliers/quotations",
          icon: MessageSquareQuote,
          show: true,
        },
      ],
    },
    {
      name: "Finance details",
      path: "/mainlayout/finance-details",
      icon: NotebookPen,
      show: true,
      children: [
        {
          name: "Taxes",
          path: "/mainlayout/finance-details/taxes",
          icon: Landmark,
          show: true,
        },
        {
          name: "Units",
          path: "/mainlayout/finance-details/units",
          icon: RulerDimensionLine,
          show: true,
        },
        {
          name: "Payment Modes",
          path: "/mainlayout/finance-details/payment-modes",
          icon: HandCoins,
          show: true,
        },
        {
          name: "Payment Transactions",
          path: "/mainlayout/finance-details/payment-transactions",
          icon: ArrowLeftRight,
          show: true,
        },
      ],
    },
    {
      name: "Billing details",
      path: "/mainlayout/billing-details",
      icon: ScrollText,
      show: true,
      children: [
        {
          name: "Invoices",
          path: "/mainlayout/billing-details/invoices",
          icon: ReceiptIndianRupee,
          show: true,
        },
        {
          name: "Orders",
          path: "/mainlayout/billing-details/orders",
          icon: CalendarArrowDown,
          show: true,
        },
      ],
    },
    {
      name: "Users",
      path: "/mainlayout/users",
      icon: User,
      show: true,
      children: [
        { name: "Roles", path: "/mainlayout/users/roles", icon: UserCog, show: true },
        {
          name: "Role Permissions",
          path: "/mainlayout/users/role-permissions",
          icon: UserRoundKey,
          show: true,
        },
      ],
    },
    {
      name: "Settings",
      path: "/mainlayout/settings",
      icon: Settings,
      show: true,
    },
  ];

  return (
    // <div className="w-[15%] h-full border border-gray-800 p-4 bg-black text-white">
    //   <img
    //     src="/home/tharvin/React Learnikngs/To do App/practice/POS-System-Express-React-/client/frontend/src/assets/360_F_392557923_FCHEloSJcOq9FzElO6mIIGEW8p1aCiII.jpg"
    //     alt="logo"
    //   />

    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      {navbar
        .filter((item) => item.show)
        .map((curr, index) => {
          const Icon = curr.icon;
          const isOpen = openIndex === index;

          return (
            <div key={index}>
              {!curr.children ? (
                <NavLink
                  key={index}
                  to={curr.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-md transition
                    ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                  }
                >
                  <Icon size={20} />
                  <span>{curr.name}</span>
                </NavLink>
              ) : (
                <div
                  onClick={() => toggleMenu(index)}
                  className="flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{curr.name}</span>
                  </div>
                  {curr.children && <span>{isOpen ? "-" : "+"}</span>}
                </div>
              )}

              {isOpen && (
                <div>
                  {curr?.children.map((c, i) => {

                    const ChildIcon = c.icon;

                    return (
                      <NavLink
                        key={i}
                        to={c.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-2 ml-6 rounded-md transition
                    ${isActive ? "bg-gray-700" : "hover:bg-gray-800"}`
                        }
                      >
                        <ChildIcon size={16} />
                        <span>{c.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
    // </div>
  );
};

export default Sidebar;
