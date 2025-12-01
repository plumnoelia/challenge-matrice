import "./App.css";
import "./index.css";
import { useState, useEffect } from "react";
import ServerList from "./components/ServerList";
import ServerForm from "./components/ServerForm";
import ServerCounter from "./components/ServerCounter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faServer } from "@fortawesome/free-solid-svg-icons";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createServer,
  deleteServer,
  getServers,
  reorderServers,
  updateServer,
} from "./networking/servers.api";
import ConfirmModal from "./components/ConfirmModal";
import FormModal from "./components/FormModal";

function SortableServerCard({ id, server, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ServerList
        servers={[server]}
        onEdit={onEdit}
        onDelete={onDelete}
        isCardMode
        dragListeners={listeners}
      />
    </div>
  );
}

function App() {
  const [servers, setServers] = useState([]);
  const [editingServer, setEditingServer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serverToDelete, setServerToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = servers.findIndex((s) => s.id === active.id);
    const newIndex = servers.findIndex((s) => s.id === over.id);

    const newOrderList = arrayMove(servers, oldIndex, newIndex);

    setServers(newOrderList);

    const payload = newOrderList.map((server, index) => ({
      id: server.id,
      order: index + 1,
    }));

    reorderServers(payload);
  };

  const handleDelete = (server) => {
    setServerToDelete(server);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serverToDelete) {
      try {
        await deleteServer(serverToDelete.id);
        setServers(servers.filter((server) => server.id !== serverToDelete.id));
        if (editingServer && editingServer.id === serverToDelete.id) {
          setEditingServer(null);
        }
        setShowDeleteModal(false);
        setServerToDelete(null);
      } catch (error) {
        console.error("Error al eliminar servidor:", error);
        setShowDeleteModal(false);
        setServerToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServerToDelete(null);
  };

  const handleAddNew = () => {
    setEditingServer(null);
    setShowForm(true);
  };

  const handleEdit = (server) => {
    setEditingServer(server);
    setShowForm(true);
  };

  const handleSave = async (payload, serverId) => {
    try {
      if (serverId) {
        console.log("Updating server with payload:", payload);
        const updatedServer = await updateServer(serverId, payload);
        setServers(
          servers.map((server) =>
            server.id === serverId ? updatedServer : server
          )
        );
        setEditingServer(null);
      } else {
        const newServer = await createServer(payload);
        setServers([...servers, newServer]);
      }
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar servidor:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingServer(null);
    setShowForm(false);
  };

  useEffect(() => {
    const loadServers = async () => {
      try {
        setLoading(true);
        const data = await getServers();
        setServers(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error al cargar servidores:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServers();
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showForm) {
          setEditingServer(null);
          setShowForm(false);
        }
        if (showDeleteModal) {
          cancelDelete();
        }
      }
    };
    if (showForm || showDeleteModal) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [showForm, showDeleteModal]);

  return (
    <main className="flex-1 flex flex-col items-center px-8 py-10">
      <header className="w-full max-w-5xl bg-white py-5 px-8 rounded-xl shadow flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold tracking-wider">
          Administrador de Servidores
        </h1>
        <ServerCounter total={servers.length} />
      </header>

      <section className="w-full max-w-5xl">
        {!showForm && (
          <div className="flex justify-start mb-6">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 shadow"
            >
              <FontAwesomeIcon icon={faPlus} />
              Agregar nuevo servidor
            </button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-500">
            Cargando servidores...
          </div>
        )}

        {!loading && servers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl shadow">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center shadow-inner mb-6">
              <FontAwesomeIcon
                icon={faServer}
                className="text-blue-500 text-4xl"
              />
            </div>

            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No hay servidores registrados
            </h3>

            <p className="text-gray-500 max-w-md mb-6">
              Agregá tu primer servidor para comenzar a gestionarlo desde aquí.
            </p>

            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow"
            >
              <FontAwesomeIcon icon={faPlus} />
              Agregar nuevo servidor
            </button>
          </div>
        )}

        {!loading && servers.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={servers.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 gap-6 max-h-[60vh] overflow-y-auto p-2">
                  {servers.map((server) => (
                    <SortableServerCard
                      key={server.id}
                      id={server.id}
                      server={server}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </section>

      {/* Modales */}
      {showForm && (
        <FormModal
          isOpen={showForm}
          title={editingServer ? "Editar servidor" : "Agregar servidor"}
          onClose={handleCancelEdit}
          children={
            <ServerForm
              onSave={handleSave}
              serverToEdit={editingServer}
              onCancel={handleCancelEdit}
            />
          }
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          isOpen={showDeleteModal}
          title="Confirmar eliminación"
          message={`¿Estas seguro de que deseas eliminar el servidor ${serverToDelete?.host}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </main>
  );
}

export default App;
