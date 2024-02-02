"use client";
import { UserContext } from "@/layout/context/usercontext";
import axios from "axios";
import { Chart } from "primereact/chart";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Home() {
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const [categoriesNames, setCategoriesNames] = useState(["", "", "", "", ""]);
  const [quantities, setQuantities] = useState([0, 0, 0, 0, 0]);

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const toast = useRef<Toast | null>(null);
  const toastMessage = (status: any, message: string) => {
    var summary = status == "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const getCategoriesStats = useCallback(async () => {
    const dataToApi = {
      token: userInfo.token,
    };
    try {
      await axios.post("/api/category/stats", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          // Extraction des catégories et des quantités dans des tableaux
          var categories: string[] = result.data.map(
            (item: any) => item.category
          );
          var quantities: number[] = result.data.map((item: any) =>
            parseInt(item.quantity)
          );

          setCategoriesNames(categories);
          setQuantities(quantities);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des catégories."
      );
      console.log(e);
    }
  }, [userInfo.token]);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: categoriesNames,
      datasets: [
        {
          label: "Inventaire",
          backgroundColor: documentStyle.getPropertyValue("--blue-500"),
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          data: quantities,
        },
      ],
    };
    const options = {
      indexAxis: "y",
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            fontColor: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [categoriesNames, quantities]);

  useEffect(() => {
    getCategoriesStats();
  }, [getCategoriesStats]);
  return (
    <>
      <div className="col-12 md:col-12">
        <div className="card">
          <div className="card-title flex mb-3 justify-content-between align-items-center">
            <span className="text-900 text-xl font-semibold">Inventaire</span>
          </div>

          <Divider />
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>
    </>
  );
}
