import React from "react";
import { Chart } from "primereact/chart";

const BarChart = (props: any) => {
  return (
    <div className="col-12 xl:col-8">
      <div className="card h-auto">
        <div className="flex align-items-start justify-content-between mb-6">
          <span className="text-900 text-xl font-semibold">Transactions</span>
        </div>
        <Chart
          height="300px"
          type="bar"
          data={props.barData}
          options={props.barOptions}
        ></Chart>
      </div>
    </div>
  );
};
export default BarChart;
