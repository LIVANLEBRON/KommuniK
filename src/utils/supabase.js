import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
// NOTA: Estas son variables de ejemplo. En producción, usar variables de entorno.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Funciones de autenticación
export const auth = {
  // Registrar usuario
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            role: userData.role || 'student',
            phone: userData.phone || '',
            ...userData
          }
        }
      });
      
      if (error) throw error;
      
      // Crear perfil de usuario en la tabla profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: userData.fullName || '',
            role: userData.role || 'student',
            phone: userData.phone || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  // Obtener sesión actual
  getCurrentSession: () => {
    return supabase.auth.getSession();
  },

  // Restablecer contraseña
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Actualizar contraseña
  updatePassword: async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Funciones para gestión de perfiles
export const profiles = {
  // Obtener perfil por ID
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Actualizar perfil
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obtener todos los perfiles (solo admin)
  getAllProfiles: async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Funciones para gestión de cursos
export const courses = {
  // Obtener todos los cursos
  getAllCourses: async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
        `)
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obtener curso por ID
  getCourse: async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          teacher:profiles!courses_teacher_id_fkey(id, full_name, email),
          enrollments:course_enrollments(student_id, enrolled_at)
        `)
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Crear curso (solo profesores/admin)
  createCourse: async (courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Actualizar curso
  updateCourse: async (courseId, updates) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Inscribir estudiante en curso
  enrollStudent: async (courseId, studentId) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: studentId,
          enrolled_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obtener cursos del estudiante
  getStudentCourses: async (studentId) => {
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(*,
            teacher:profiles!courses_teacher_id_fkey(id, full_name, email)
          )
        `)
        .eq('student_id', studentId);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Funciones para gestión de materiales
export const materials = {
  // Obtener materiales de un curso
  getCourseMaterials: async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Subir material
  uploadMaterial: async (materialData) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert({
          ...materialData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Funciones para gestión de tareas
export const assignments = {
  // Obtener tareas de un curso
  getCourseAssignments: async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', courseId)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Crear tarea
  createAssignment: async (assignmentData) => {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          ...assignmentData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Enviar tarea (estudiante)
  submitAssignment: async (submissionData) => {
    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert({
          ...submissionData,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Funciones para gestión de archivos
export const storage = {
  // Subir archivo
  uploadFile: async (bucket, path, file) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Obtener URL pública del archivo
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // Eliminar archivo
  deleteFile: async (bucket, path) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export default supabase;