"use client";

import { Demo } from "@/types";

interface ClientProps {
  client: Demo.Client;
}

const ClientPos: React.FC<ClientProps> = ({ client }) => {
  return (
    <div className="flex flex-column row-gap-3">
      <div className="flex flex-column">
        {client.name !== "" ? (
          <div className="w-full p-3 border-1 border-round surface-border flex align-items-center hover:surface-100 cursor-pointer border-radius">
            <img
              alt="avatar"
              src={`/user.png`}
              className="w-3rem flex-shrink-0 mr-2"
            />
            <div className="flex flex-column">
              <span className="text-900 text-lg font-medium">
                {client.name}
              </span>
              <span className="text-800 text-sm font-small">
                {client.phone}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full p-3 border-1 border-round surface-border flex align-items-center hover:surface-100 cursor-pointer border-radius">
            <span className="text-900 text-lg text-center font-medium">
              Aucun client selectionné!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPos;
