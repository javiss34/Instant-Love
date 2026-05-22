import { z } from "zod";

const esquemaLogin = z.object({
  email: z.string().email("El email no tiene un formato válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const esquemaRegistro = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede superar los 30 caracteres")
    .regex(/^[a-zA-Z0-9_]+$/, "El nombre de usuario solo puede contener letras, números y guiones bajos"),
  email: z.string().email("El email no tiene un formato válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  fecha_nacimiento: z.string().refine((fecha) => !isNaN(Date.parse(fecha)), {
    message: "La fecha de nacimiento no es válida",
  }),
  genero: z.enum(["H", "M", "O"], {
    errorMap: () => ({ message: "El género debe ser H, M u O" }),
  }),
  preferencia_genero: z.enum(["H", "M", "AMBOS"], {
    errorMap: () => ({ message: "La preferencia de género debe ser H, M o AMBOS" }),
  }),
});

export { esquemaLogin, esquemaRegistro };
