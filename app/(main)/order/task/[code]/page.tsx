"use client";

import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import TaskList from "@/components/tasklist/TaskList";
import fonctions from "@/utils/fonctions";

export default function OrderDetail({
  params,
}: {
  params: {
    code: string;
  };
}) {
  const { userInfo } = useContext(UserContext);
  const toast = useRef<Toast | null>(null);

  const toastMessage = (status: any, message: string) => {
    const summary = status === "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  let emptyOrder: Demo.Order = {
    sub_total: 0,
    discount: 0,
    total: 0,
    date: "",
    code: "",
    origin: "",
  };

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Demo.Order>(emptyOrder);

  const getTask = useCallback(async () => {
    try {
      await axios
        .post("/api/task/get", {
          token: userInfo.token,
          code: params.code,
        })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setLoading(false);
            const taskInfo = result.data;

            // incomplete
            const taskIncompleted: Demo.Task[] = taskInfo
              .filter((item: any) => item.status !== "Prêt")
              .map((item: any) => ({
                id_task: item.id_task,
                id_order: item.id_order,
                id_order_item: item.id_order_item,
                description:
                  item.category +
                  " | " +
                  item.size +
                  " | " +
                  item.color +
                  " | " +
                  item.type +
                  " | " +
                  item.service,

                completed: false,
                status: item.status,
                date: order.date,
                quantity: item.quantity,
              }));
            setTodo(taskIncompleted);

            // complete
            const taskCompleted: Demo.Task[] = taskInfo
              .filter((item: any) => item.status === "Prêt")
              .map((item: any) => ({
                id_order_item: item.id_order_item,
                description:
                  item.category +
                  " | " +
                  item.size +
                  " | " +
                  item.color +
                  " | " +
                  item.type +
                  " | " +
                  item.service,

                completed: true,
                status: item.status,
                date: order.date,
                quantity: item.quantity,
                created_bys: item.created_by,
              }));
            setCompleted(taskCompleted);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      console.log(e);
      toastMessage("error", "Erreur lors de la récuperation des taches.");
    }
  }, [order.date, params.code, userInfo.token]);

  const getOrder = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .post("/api/order/get", {
          token: userInfo.token,
          code: params.code,
        })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setLoading(false);
            setOrder(result.data);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
      toastMessage(
        "error",
        "Erreur lors de la récuperation des infos de la commande."
      );
    }
  }, [params.code, userInfo.token]);

  useEffect(() => {
    if (userInfo) {
      getOrder();
    }
  }, [getOrder, userInfo]);

  const [todo, setTodo] = useState<Demo.Task[]>([]);
  const [completed, setCompleted] = useState<Demo.Task[]>([]);

  const handleCompleteTask = () => {
    getOrder();
    getTask();
  };

  useEffect(() => {
    getTask();
  }, [getTask]);

  return (
    <>
      <Toast ref={toast} />
      <div className="col-12">
        <div className="grid">
          <div className="col-12">
            <div className="card flex justify-content-between">
              <span className="flex align-items-center font-semibold white-space-nowrap mr-3">
                <i className="pi pi-clock mr-2"></i>
                {order.date && fonctions.dateFormatYMDtoDMYFr(order.date)}
              </span>

              <span className="flex align-items-center font-semibold mr-3">
                <i className="pi pi-stopwatch mr-2"></i>
                {order.rendez_vous}
              </span>
            </div>
            {order.code !== "" ? (
              <div className="card">
                <TaskList
                  taskList={todo}
                  title="A Faire"
                  completeTask={handleCompleteTask}
                ></TaskList>
                <TaskList
                  taskList={completed}
                  title="Terminé"
                  completeTask={handleCompleteTask}
                ></TaskList>
              </div>
            ) : (
              <div className="card">Commande introuvable</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
