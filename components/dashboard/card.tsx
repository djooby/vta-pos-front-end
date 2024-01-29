import fonctions from "@/utils/fonctions";

const Card = ({title, balance}:{
  title: string;
  balance: number;
}) => {
  return title !== "Total" ? (
    <div className="col-12 md:col-6 xl:col-3">
      <div className="card h-full">
        <div className="flex align-items-center justify-content-between mb-3">
          <div className="text-900 text-xl font-semibold">{title}</div>
        </div>
        <div className="text-600 mb-1 font-semibold">Balance</div>
        <div className="text-900 text-2xl text-primary mb-5 font-bold">
          {fonctions.formatCurrency(balance)}
        </div>
      </div>
    </div>
  ) : (
    <div className="col-12 md:col-6 xl:col-3">
      <div className="card h-full relative overflow-hidden">
        <svg
          id="visual"
          viewBox="0 0 900 600"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          className="absolute left-0 top-0 h-full w-full z-1"
          preserveAspectRatio="none"
        >
          <rect
            x="0"
            y="0"
            width="900"
            height="600"
            fill="var(--primary-600)"
          ></rect>
          <path
            d="M0 400L30 386.5C60 373 120 346 180 334.8C240 323.7 300 328.3 360 345.2C420 362 480 391 540 392C600 393 660 366 720 355.2C780 344.3 840 349.7 870 352.3L900 355L900 601L870 601C840 601 780 601 720 601C660 601 600 601 540 601C480 601 420 601 360 601C300 601 240 601 180 601C120 601 60 601 30 601L0 601Z"
            fill="var(--primary-500)"
            strokeLinecap="round"
            strokeLinejoin="miter"
          ></path>
        </svg>
        <div className="z-2 relative text-white">
          <div className="text-xl font-semibold mb-3">{title}</div>
          <div className="mb-1 font-semibold">Balance</div>
          <div className="text-2xl mb-5 font-bold">
            {fonctions.formatCurrency(balance)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
