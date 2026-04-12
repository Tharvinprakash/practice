const Card = ({ columns = [] }) => {
  return (
    <div className="flex gap-8 justify-around">
      {columns.map((curr, index) => {
        const Logo = curr.logo;
        return (
          <div
            key={index}
            className="flex justify-around items-center w-[280px] h-[180px] border border-black-500 shadow-lg rounded-md"
          >
            <div>
              <p className="font-bold text-lg">{curr?.title}</p>
              <p className="text-2xl font-semibold">{curr?.data}</p>
              <p className="text-sm text-gray-400 text-stroke-3">{curr?.subtitle}</p>
            </div>
            <div className={`${curr?.bgColor}`}>{curr?.logo && <Logo size={50} strokeWidth={1.5}/>}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
