export const CATEGORIES_SEED: string[] = [
  'Trabajo',
  'Personal',
  'Salud',
  'Compras',
  'Estudio',
];

export const TODOS_SEED: {
  title: string;
  completed: boolean;
  category: string;
}[] = [
  { title: 'Enviar informe mensual', completed: false, category: 'Trabajo' },
  { title: 'Revisar correos pendientes', completed: true, category: 'Trabajo' },
  { title: 'Preparar presentación', completed: false, category: 'Trabajo' },
  { title: 'Reunión con el equipo', completed: true, category: 'Trabajo' },
  { title: 'Actualizar tareas en Jira', completed: false, category: 'Trabajo' },

  { title: 'Llamar a mamá', completed: true, category: 'Personal' },
  { title: 'Organizar el cuarto', completed: false, category: 'Personal' },
  { title: 'Ver una película', completed: true, category: 'Personal' },
  { title: 'Salir a caminar', completed: false, category: 'Personal' },
  { title: 'Planear vacaciones', completed: false, category: 'Personal' },

  { title: 'Hacer ejercicio', completed: false, category: 'Salud' },
  { title: 'Tomar 2L de agua', completed: true, category: 'Salud' },
  { title: 'Dormir 8 horas', completed: false, category: 'Salud' },
  { title: 'Cita médica', completed: true, category: 'Salud' },
  { title: 'Preparar comida saludable', completed: false, category: 'Salud' },

  { title: 'Comprar frutas', completed: true, category: 'Compras' },
  { title: 'Ir al supermercado', completed: false, category: 'Compras' },
  { title: 'Comprar detergente', completed: true, category: 'Compras' },
  { title: 'Pedir comida online', completed: false, category: 'Compras' },
  { title: 'Revisar ofertas', completed: false, category: 'Compras' },

  { title: 'Estudiar Java', completed: false, category: 'Estudio' },
  { title: 'Leer documentación', completed: true, category: 'Estudio' },
  { title: 'Practicar Flutter', completed: false, category: 'Estudio' },
  { title: 'Ver curso online', completed: true, category: 'Estudio' },
  { title: 'Hacer ejercicios prácticos', completed: false, category: 'Estudio' },

  { title: 'Refactorizar código', completed: false, category: 'Trabajo' },
  { title: 'Hacer backup del proyecto', completed: true, category: 'Trabajo' },
  { title: 'Limpiar escritorio', completed: false, category: 'Personal' },
  { title: 'Comprar vitaminas', completed: true, category: 'Salud' },
  { title: 'Leer libro técnico', completed: false, category: 'Estudio' },
];