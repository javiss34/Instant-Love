import { z } from "zod";

const esquemaLogin = z.object({
  email: z.string().email("El email no tiene un formato válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const esquemaRegistro = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede superar los 30 caracteres")
    .regex(/^[a-zA-Z0-9_.]+$/, "El nombre de usuario solo puede contener letras, números, puntos y guiones bajos"),
  email: z.string().email("El email no tiene un formato válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
    .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(/[^a-zA-Z0-9]/, "La contraseña debe contener al menos un carácter especial"),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  fecha_nacimiento: z
    .string()
    .refine((fecha) => !isNaN(Date.parse(fecha)), {
      message: "La fecha de nacimiento no es válida",
    })
    .refine((fecha) => {
      const hoy = new Date();
      const nacimiento = new Date(fecha);
      const edad = hoy.getFullYear() - nacimiento.getFullYear();
      const cumplio = hoy >= new Date(nacimiento.setFullYear(nacimiento.getFullYear() + edad));
      return cumplio ? edad >= 18 : edad - 1 >= 18;
    }, { message: "Debes tener al menos 18 años para registrarte" }),
  genero: z.enum(["H", "M", "O"], {
    errorMap: () => ({ message: "El género debe ser H, M u O" }),
  }),
  preferencia_genero: z.enum(["H", "M", "AMBOS"], {
    errorMap: () => ({ message: "La preferencia de género debe ser H, M o AMBOS" }),
  }),
  red_social_tipo: z.enum(["INSTAGRAM", "WHATSAPP", "TIK TOK", "OTRO"], {
    errorMap: () => ({ message: "Debes seleccionar una red social" }),
  }),
  red_social_usuario: z
    .string()
    .min(2, "El usuario o número debe tener al menos 2 caracteres")
    .max(100, "El usuario o número no puede superar los 100 caracteres"),
});

const esquemaRegistroPaso1 = z.object({
  username: esquemaRegistro.shape.username,
  nombre: esquemaRegistro.shape.nombre,
  email: esquemaRegistro.shape.email,
  password: esquemaRegistro.shape.password,
  fecha_nacimiento: esquemaRegistro.shape.fecha_nacimiento,
});

const esquemaPerfil = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres"),
  preferencia_genero: z.enum(["H", "M", "AMBOS"], {
    errorMap: () => ({ message: "Debes seleccionar una preferencia de género" }),
  }),
  red_social_tipo: z.enum(["INSTAGRAM", "WHATSAPP", "TIK TOK", "OTRO"], {
    errorMap: () => ({ message: "Debes seleccionar una red social" }),
  }),
  red_social_usuario: z
    .string()
    .min(2, "El usuario o número debe tener al menos 2 caracteres")
    .max(100, "El usuario o número no puede superar los 100 caracteres"),
});

export { esquemaLogin, esquemaRegistro, esquemaRegistroPaso1, esquemaPerfil };
