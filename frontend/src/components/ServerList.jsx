import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

function ServerList({
  servers,
  onEdit,
  onDelete,
  isCardMode = false,
  dragListeners = null,
}) {
  if (!servers.length) {
    return (
      <div className="text-gray-400 text-center w-full">
        No hay servidores registrados.
      </div>
    );
  }
  if (isCardMode) {
    const server = servers[0];
    return (
      <div
        className="flex items-stretch py-5 px-2 gap-4 bg-white rounded-xl shadow w-full"
        {...(dragListeners || {})}
        style={{ cursor: dragListeners ? "grab" : "default" }}
      >
        <img
          src={server.image}
          alt={server.host}
          className="object-cover border border-gray-200 bg-gray-100"
          width={300}
          height={300}
        />
        <div className="flex-1 min-w-0 flex flex-col h-full">
          <span className="font-semibold text-md text-gray-800 pb-4">
            {server.host}
          </span>
          <span className="font-semibold text-md text-gray-800 pb-4">
            IP: {server.ip}
          </span>
          <div className="text-gray-500 text-sm truncate mb-3 pb-4">
            {server.description}
          </div>
          <div
            className="flex gap-3 mt-auto"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors text-base flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(server);
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
              Editar
            </button>
            <button
              type="button"
              className="text-red-500 font-medium hover:text-red-700 transition-colors text-base flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(server);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default ServerList;
