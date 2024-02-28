import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import Image from "next/image";
import { Button } from "primereact/button";

import { useRef } from "react";
import ReactToPrint from "react-to-print";

const Invoice = ({
  order,
  type,
  avance,
  balance,
}: {
  type: string;
  order: Demo.Order;
  avance: number;
  balance: number;
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="card py-2 px-6 md:px-8 overflow-auto" ref={printRef}>
        <div className="flex align-items-end flex-row md:align-items-end justify-content-between border-bottom-1 surface-border pb-5 min-w-max">
          <div className="flex flex-column">
            <Image src={"/logo/icon.png"} width={90} height={90} alt="Logo" />
            <div className="my-3 text-4xl font-bold text-900">
              VTA ENTERPRISE
            </div>
            <span>En face l&apos;ecole des soeurs EIC,</span>
            <span>Rte nationale #6, Nord&apos;Est,Haiti</span>
            <span className="mb-2">(+509) 4279-8776 / (+509) 4626-0757</span>
          </div>
          <div className="flex flex-column mt-5 md:mt-0">
            <div className="text-2xl font-semibold text-left md:text-right mb-3">
              {type}
            </div>
            <div className="flex flex-column">
              <div className="flex justify-content-between align-items-center mb-2">
                <span className="font-semibold mr-6">DATE</span>
                <span>{fonctions.dateFormatDMY(order.date)}</span>
              </div>
              <div className="flex justify-content-between align-items-center mb-2">
                <span className="font-semibold mr-6">NUMERO</span>
                <span>{order.code}</span>
              </div>
              <div className="flex justify-content-between align-items-center">
                <span className="font-semibold mr-6">STATUT</span>
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 mb-4 flex flex-column">
          <div className="mb-3 text-2xl font-medium">CLIENT</div>
          <span className="mb-2">{order.client?.name}</span>
          <span className="mb-2">{order.client?.phone}</span>
          <span>{order.client?.address}</span>
        </div>

        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{ borderCollapse: "collapse", tableLayout: "auto" }}
          >
            <thead>
              <tr>
                <th className="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">
                  Description
                </th>
                <th className="text-center font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">
                  Service
                </th>
                <th className="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">
                  Quantite
                </th>
                <th className="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">
                  Prix
                </th>
                <th className="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.orderProducts &&
                order.orderProducts.map((product: Demo.OrderProduct, index) => (
                  <tr key={index}>
                    <td className="text-left py-3 border-bottom-1 surface-border white-space-nowrap">
                      {product.category +
                        " | " +
                        product.size +
                        " | " +
                        product.color +
                        " | " +
                        product.type}
                    </td>
                    <td className="text-center py-3 border-bottom-1 surface-border px-3">
                      {product.service}
                    </td>
                    <td className="text-right py-3 border-bottom-1 surface-border px-3">
                      {product.quantity}
                    </td>
                    <td className="text-right py-3 border-bottom-1 surface-border px-3">
                      {fonctions.formatCurrency(product.price)}
                    </td>
                    <td className="text-right py-3 border-bottom-1 surface-border">
                      {fonctions.formatCurrency(product.total)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-row align-items-end justify-content-between mt-5 mb-4">
          <div className="flex flex-column">
            <div className="flex justify-content-between align-items-center mb-2">
              <span className="font-semibold mr-6">AVANCE</span>
              <span> {fonctions.formatCurrency(avance)}</span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="font-semibold mr-6">BALANCE</span>
              <span> {fonctions.formatCurrency(balance)}</span>
            </div>
          </div>
          <div className="flex flex-column">
            <div className="flex justify-content-between align-items-center mb-2">
              <span className="font-semibold mr-6">SOUS-TOTAL</span>
              <span> {fonctions.formatCurrency(order.subTotal)}</span>
            </div>
            <div className="flex justify-content-between align-items-center mb-2">
              <span className="font-semibold mr-6">DISCOUNT</span>
              <span> {fonctions.formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-content-between align-items-center">
              <span className="font-semibold mr-6">TOTAL</span>
              <span> {fonctions.formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* print btn */}

      <div className="flex flex-row justify-content-end mb-2">
        <div className="flex flex-column">
          <div className="flex mb-2">
            <ReactToPrint
              trigger={() => (
                <Button label="Imprimer" icon="pi pi-print" className="mr-2" />
              )}
              content={() => printRef.current}
              documentTitle="Invoice"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Invoice;
