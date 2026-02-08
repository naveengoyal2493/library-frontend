import { useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: string;
};

type Props<T> = {
  title: string;
  entity: T;
  fields: Field[];
  endpoint: string;
  onClose: () => void;
  onSuccess: () => void;
  handleUpdate: Function;
};

export default function EntityFormModal<T extends { id: number }>({
  title,
  entity,
  fields,
  endpoint,
  onClose,
  onSuccess,
  handleUpdate,
}: Props<T>) {
  const [formData, setFormData] = useState({ ...entity });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const submit = async () => {
    await handleUpdate({
      id: entity.id,
      endpoint,
      entityName: title,
      data: formData,
      onSuccess,
    });

    onClose();
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2>{title}</h2>

        {fields.map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.label}
            type={field.type || "text"}
            value={(formData as any)[field.name]}
            onChange={handleChange}
          />
        ))}

        <div style={{ marginTop: 20 }}>
          <button onClick={submit}>Update</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const boxStyle: React.CSSProperties = {
  background: "white",
  padding: "30px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "320px",
};
