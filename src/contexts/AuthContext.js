import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth, profiles } from '../utils/supabase';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        // Si hay usuario, obtener su perfil
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Obtener perfil del usuario
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await profiles.getProfile(userId);
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  // Función de registro
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signUp(email, password, userData);
      
      if (error) {
        toast.error(error.message || 'Error al registrar usuario');
        return { success: false, error };
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast.success('¡Registro exitoso! Revisa tu email para confirmar tu cuenta.');
      } else {
        toast.success('¡Registro exitoso!');
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      toast.error('Error inesperado al registrar usuario');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Función de inicio de sesión
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await auth.signIn(email, password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenciales inválidas. Verifica tu email y contraseña.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Por favor, confirma tu email antes de iniciar sesión.');
        } else {
          toast.error(error.message || 'Error al iniciar sesión');
        }
        return { success: false, error };
      }

      toast.success('¡Bienvenido a KommuniK Academy!');
      return { success: true, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      toast.error('Error inesperado al iniciar sesión');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Función de cierre de sesión
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await auth.signOut();
      
      if (error) {
        toast.error(error.message || 'Error al cerrar sesión');
        return { success: false, error };
      }

      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success('Sesión cerrada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('Error in signOut:', error);
      toast.error('Error inesperado al cerrar sesión');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Función para restablecer contraseña
  const resetPassword = async (email) => {
    try {
      const { data, error } = await auth.resetPassword(email);
      
      if (error) {
        toast.error(error.message || 'Error al enviar email de recuperación');
        return { success: false, error };
      }

      toast.success('Email de recuperación enviado. Revisa tu bandeja de entrada.');
      return { success: true, data };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      toast.error('Error inesperado al enviar email de recuperación');
      return { success: false, error };
    }
  };

  // Función para actualizar perfil
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      const { data, error } = await profiles.updateProfile(user.id, updates);
      
      if (error) {
        toast.error(error.message || 'Error al actualizar perfil');
        return { success: false, error };
      }

      setProfile(data);
      toast.success('Perfil actualizado exitosamente');
      return { success: true, data };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('Error inesperado al actualizar perfil');
      return { success: false, error };
    }
  };

  // Función para actualizar contraseña
  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await auth.updatePassword(newPassword);
      
      if (error) {
        toast.error(error.message || 'Error al actualizar contraseña');
        return { success: false, error };
      }

      toast.success('Contraseña actualizada exitosamente');
      return { success: true, data };
    } catch (error) {
      console.error('Error in updatePassword:', error);
      toast.error('Error inesperado al actualizar contraseña');
      return { success: false, error };
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole) => {
    if (!profile) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(profile.role);
    }
    
    return profile.role === requiredRole;
  };

  // Verificar si el usuario es administrador
  const isAdmin = () => hasRole('admin');
  
  // Verificar si el usuario es profesor
  const isTeacher = () => hasRole(['teacher', 'admin']);
  
  // Verificar si el usuario es estudiante
  const isStudent = () => hasRole('student');

  const value = {
    // Estado
    user,
    profile,
    session,
    loading,
    
    // Funciones de autenticación
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    
    // Funciones de perfil
    updateProfile,
    fetchUserProfile,
    
    // Funciones de verificación de roles
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;