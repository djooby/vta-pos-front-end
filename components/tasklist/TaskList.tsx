import { UserContext } from "@/layout/context/usercontext";
import type { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useContext, useRef } from "react";

interface TaskListProps {
  taskList: Demo.Task[];
  completeTask: () => void;
  title: string;
}

function TaskList(props: TaskListProps) {
  const { userInfo } = useContext(UserContext);

  const toast = useRef<Toast | null>(null);

  const toastMessage = (status: any, message: string) => {
    const summary = status == "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const onCheckboxChange = async (
    event: CheckboxChangeEvent,
    task: Demo.Task
  ) => {
    event.originalEvent?.stopPropagation();

    if (task.completed === false) {
      const newTask = {
        id_task: task.id_task,
        id_order_item: task.id_order_item,
        id_order: task.id_order,
        status: "Prêt",
        created_by: userInfo.fullname,
        date: fonctions.getCurrentDate(),
      };

      const dataApi = {
        token: userInfo.token,
        task: newTask,
      };

      try {
        await axios.post("/api/task/update", dataApi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            props.completeTask();
            toastMessage("success", result.data);
          } else {
            toastMessage("error", result.data);
          }
        });
      } catch (e) {
        console.log(e);
        toastMessage("error", "Erreur lors de l'enregistrement de la tâche.");
      }
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="text-900 font-semibold text-lg mt-5 mb-3 border-bottom-1 surface-border py-3">
        {props.title}
      </div>
      <ul className="list-none p-0 m-0">
        {props.taskList.map((task, i) => {
          return (
            <li
              key={i}
              className="flex flex-column gap-3 md:flex-row md:align-items-center p-2 border-bottom-1 surface-border"
            >
              <div className="flex align-items-center flex-1">
                <Checkbox
                  onChange={(event) => onCheckboxChange(event, task)}
                  checked={task.completed as boolean}
                  inputId={task.id_order_item?.toString()}
                ></Checkbox>
                <label
                  htmlFor={task.id_order_item?.toString()}
                  className={classNames(
                    "font-medium white-space-nowrap text-overflow-ellipsis overflow-hidden5 ml-2",
                    {
                      "line-through": task.completed,
                    }
                  )}
                  style={{ maxWidth: "300px" }}
                >
                  {task.description}
                </label>
              </div>

              <div className="flex flex-2 gap-3 flex-column sm:flex-row sm:justify-content-between">
                <div className="flex align-items-center">
                  <span className="flex align-items-center font-semibold mr-3">
                    {task.quantity}
                  </span>
                </div>

                <div className="flex align-items-center sm:justify-content-end">
                  <AvatarGroup className="mr-3">
                    {task && task.created_by && (
                      <Avatar
                        image={`/demo/images/avatar/amyelsner.png`}
                        size="large"
                        shape="circle"
                        label={``}
                        style={{
                          backgroundColor: "#ffffff",
                          color: "#212121",
                          border: "2px solid var(--surface-border)",
                        }}
                      />
                    )}
                  </AvatarGroup>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TaskList;
