import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://dmbsyedchoaqoqsffkds.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtYnN5ZWRjaG9hcW9xc2Zma2RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjM4MDgsImV4cCI6MjA1NjgzOTgwOH0.pGB_Vwi0MNeEi7xqYAckwI91Mag2ZnI7tXQYGBhfLro';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const registerUser = async (email: string, password: string, role: string, displayName: string) => {
  try {
    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile in Supabase database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          role,
          display_name: displayName,
          created_at: new Date().toISOString(),
          status: role === 'driver' ? 'not_cleared' : 'active'
        });

      if (profileError) throw profileError;
      
      return { success: true, user: authData.user };
    } else {
      return { success: false, error: 'User registration failed' };
    }
  } catch (error) {
    return { success: false, error };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error };
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    if (data) {
      // Convert snake_case to camelCase for consistency with the old API
      return { 
        success: true, 
        profile: {
          email: data.email,
          role: data.role,
          displayName: data.display_name,
          status: data.status,
          createdAt: data.created_at
        } 
      };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

// Driver functions
export const updateDriverStatus = async (driverId: string, status: string) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        status,
        last_updated: new Date().toISOString()
      })
      .eq('id', driverId);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Supervisor functions
export const getDriversList = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'driver');

    if (error) throw error;
    
    // Convert snake_case to camelCase for consistency with the old API
    const drivers = data.map(driver => ({
      id: driver.id,
      email: driver.email,
      role: driver.role,
      displayName: driver.display_name,
      status: driver.status,
      createdAt: driver.created_at,
      lastUpdated: driver.last_updated
    }));
    
    return { success: true, drivers };
  } catch (error) {
    return { success: false, error };
  }
};

// Auth state change listener setup
export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}; 