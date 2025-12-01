import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faUpload } from "@fortawesome/free-solid-svg-icons";

function ServerForm({ onSave, serverToEdit, onCancel }) {
  const [formData, setFormData] = useState({
    host: "",
    ip: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (serverToEdit) {
      setFormData({
        host: serverToEdit.host || "",
        ip: serverToEdit.ip || "",
        description: serverToEdit.description || "",
        image: serverToEdit.image || "",
      });
      setImagePreview(serverToEdit.image || null);
      setImageFile(null);
    } else {
      setFormData({
        host: "",
        ip: "",
        description: "",
        image: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setErrors({});
  }, [serverToEdit]);

  const validateIPv4 = (ip) => {
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipv4Regex);

    if (!match) {
      return false;
    }

    for (let i = 1; i <= 4; i++) {
      const octet = parseInt(match[i], 10);
      if (octet < 0 || octet > 255) {
        return false;
      }
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "ip" && value.trim()) {
      if (!validateIPv4(value.trim())) {
        setErrors((prev) => ({
          ...prev,
          ip: "El formato de IP no es válido. Debe ser una dirección IPv4 (ej: 192.168.1.1)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, ip: "" }));
      }
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "image" && value) {
      setImagePreview(value);
      setImageFile(null);
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Por favor selecciona una imagen JPG, JPEG, GIF o PNG.");
      return;
    }

    setImageFile(file);

    // Preview de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.host.trim()) {
      newErrors.host = "El campo Host es obligatorio";
    }

    if (!formData.ip.trim()) {
      newErrors.ip = "El campo IP es obligatorio";
    } else if (!validateIPv4(formData.ip.trim())) {
      newErrors.ip =
        "El formato de IP no es válido. Debe ser una dirección IPv4 (ej: 192.168.1.1)";
    }

    if (!formData.description.trim()) {
      newErrors.description = "El campo Descripción es obligatorio";
    }

    if (!imageFile && !serverToEdit) {
      newErrors.image = "Debe subir una imagen (JPG, JPEG, GIF o PNG)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("host", formData.host);
    formDataToSend.append("ip", formData.ip);
    formDataToSend.append("description", formData.description);
    if (imageFile) {
      formDataToSend.append("image", imageFile);
    }

    await onSave(formDataToSend, serverToEdit?.id);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="host"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Host <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="host"
          name="host"
          value={formData.host}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.host ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ej: db-server-01"
        />
        {errors.host && (
          <p className="mt-1 text-sm text-red-500">{errors.host}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="ip"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          IP <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="ip"
          name="ip"
          value={formData.ip}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.ip ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Ej: 192.168.1.10"
        />
        {errors.ip && <p className="mt-1 text-sm text-red-500">{errors.ip}</p>}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Descripción <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Descripción del servidor..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Imagen del servidor <span className="text-red-500">*</span>
        </label>

        <div className="mb-3">
          <label
            htmlFor="image-upload"
            className={`flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
              errors.image
                ? "border-red-500 hover:border-red-600"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <FontAwesomeIcon icon={faUpload} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {imageFile ? imageFile.name : "Haz clic para subir una imagen"}
            </span>
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/jpg,image/gif,image/png"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        {errors.image && (
          <p className="mt-1 text-sm text-red-500">{errors.image}</p>
        )}

        {imagePreview && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
            <div className="relative w-full h-48 border border-gray-300 rounded-md overflow-hidden bg-gray-100">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                setImageFile(null);
                setFormData((prev) => ({ ...prev, image: "" }));
                if (errors.image) {
                  setErrors((prev) => ({ ...prev, image: "" }));
                }
              }}
              className="mt-2 text-xs text-red-500 hover:text-red-700"
            >
              Eliminar imagen
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} />
          {serverToEdit ? "Actualizar" : "Guardar"}
        </button>
        {serverToEdit && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default ServerForm;
