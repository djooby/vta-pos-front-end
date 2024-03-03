import fonctions from "@/utils/fonctions";
import React, { RefObject } from "react";

interface MyComponentProps {
  printRef: RefObject<HTMLDivElement>;
  transfertInfo: any;
  enterprise: any;
}

const InvoiceToPrint: React.FC<MyComponentProps> = ({
  printRef,
  transfertInfo,
  enterprise,
  ...props
}) => {
  return (
    <>
      <div
        className="w-full overflow-hidden"
        style={{ padding: "0rem 10rem 0rem 10rem" }}
        ref={printRef}
      >
        {/* Nom et Logo */}
        <div className="flex mt-3 border-bottom-1 surface-border pb-3 w-full justify-content-between">
          {/* nom enterprise */}
          <div className="flex flex-column">
            <img
              alt="logo"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/c-logo.jpg")
              }
              src={enterprise.logo + "?" + Math.random()}
              style={{ borderRadius: "50%" }}
              className="w-4rem h-4rem flex-shrink-0  border-2 border-primary"
            />

            <div className="my-2 text-xl font-bold text-900">
              {enterprise.name}
            </div>
            <span>{enterprise.address}</span>
          </div>
          {/* num recu */}
          <div className="flex flex-column mt-5">
            <div className="text-xl font-semibold text-right mb-2">REÇU</div>
            <div className="flex flex-column text-right">
              <div className="flex justify-content-end">
                <span className="font-semibold mr-1">No: </span>
                <span>{transfertInfo.numero_transfert}</span>
              </div>
              <div className="flex justify-content-end">
                <span className="font-semibold mr-1">DATE:</span>
                <span>
                  {transfertInfo.date &&
                    fonctions.dateFormatYMDtoDMYFr(transfertInfo.date)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* transfer Info */}
        <div className="grid border-bottom-1 surface-border min-w-max">
          <div className="col-6 mt-2 mb-3 flex flex-column">
            <div className="mb-3 text-xl font-medium">DE</div>
            <span className="mb-0 font-semibold ">
              {transfertInfo.expediteur}
            </span>
          </div>

          <div className="col-6 mt-2 mb-3 flex flex-column text-right">
            <div className="mb-3 text-xl font-medium">A</div>
            <span className="mb-0 font-semibold ">
              {transfertInfo.destinataire}
            </span>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full"
            style={{ borderCollapse: "collapse", tableLayout: "auto" }}
          >
            <thead>
              <tr>
                <th className="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">
                  Origine
                </th>

                <th className="text-left font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">
                  Via
                </th>
                <th className="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">
                  Montant
                </th>
                <th className="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap px-3">
                  Frais
                </th>
                <th className="text-right font-semibold py-3 border-bottom-1 surface-border white-space-nowrap">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-left py-3 border-bottom-1 surface-border white-space-nowrap">
                  {transfertInfo.compte}
                </td>

                <td className="text-left py-3 border-bottom-1 surface-border white-space-nowrap">
                  {transfertInfo.via}
                </td>
                <td className="text-right py-3 border-bottom-1 surface-border px-3">
                  {fonctions.formatCurrency(transfertInfo.montant)}
                </td>
                <td className="text-right py-3 border-bottom-1 surface-border px-3">
                  {fonctions.formatCurrency(transfertInfo.frais)}
                </td>
                <td className="text-right py-3 border-bottom-1 surface-border">
                  {fonctions.formatCurrency(
                    parseInt(transfertInfo.montant) +
                      parseInt(transfertInfo.frais)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* footer */}
        <div className="flex grid flex-column md:flex-row md:align-items-start md:justify-content-between mt-8">
          <div className="flex col-12 flex-column">
            <div className="flex justify-content-between align-items-center mb-2">
              <span className="font-semibold mr-6">STATUT</span>
              <span>{transfertInfo.statut}</span>
            </div>
            <div className="flex mb-3 justify-content-between align-items-center">
              <span className="font-semibold mr-6">TOTAL</span>
              <span>
                {fonctions.formatCurrency(
                  parseInt(transfertInfo.montant) +
                    parseInt(transfertInfo.frais)
                )}
              </span>
            </div>

            <div className="flex mb-2 mt-2 py-3 border-top-1 text-center justify-content-center align-items-center">
              <span className="flext text-center">
                Merci d&apos;avoir utilisé{" "}
                <span className="bold font-bold">{enterprise.name}</span>!
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default InvoiceToPrint;
