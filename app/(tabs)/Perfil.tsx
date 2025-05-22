import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../.env/firebaseConfig'; 

const Perfil = () => {
  const router = useRouter();
  const user = auth.currentUser;
  const [imgError, setImgError] = useState(false);

   const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCrudNavigate = () => {
    router.push('/CRUD');
  };

  return (
    <View style={viewStyles.outerContainer}>
      <View style={viewStyles.container}>
        <Text style={textStyles.header}>Mi Perfil</Text>
        <View style={viewStyles.card}>
          {user?.photoURL && Platform.OS === 'web' && !imgError ? (
            <img
              src={user.photoURL}
              alt="avatar"
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                objectFit: 'cover',
                backgroundColor: '#E6D5C3',
                marginBottom: 16,
                display: 'block',
                border: '2px solid #E6D5C3'
              }}
              onError={() => setImgError(true)}
            />
          ) : user?.photoURL && Platform.OS !== 'web' ? (
            <Image source={{ uri: user.photoURL }} style={viewStyles.avatar} />
          ) : (
            <View style={[viewStyles.avatar, { backgroundColor: '#E6D5C3', justifyContent: 'center', alignItems: 'center' }]}>
              <AntDesign name="user" size={48} color="#b0a18e" />
            </View>
          )}
          <Text style={textStyles.name}>{user?.displayName || "Invitado"}</Text>
          <Text style={textStyles.email}>{user?.email || "Sin email"}</Text>
          <TouchableOpacity
            style={[
              viewStyles.editButton,
              !user && { opacity: 0.5 }
            ]}
            onPress={handleCrudNavigate}
            disabled={!user}
          >
            <Text style={textStyles.editText}>
              <AntDesign name="edit" size={20} color="#fff" /> Gestionar recetas
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={viewStyles.logoutButton} onPress={handleLogout}>
          <Text style={textStyles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
      <Text style={textStyles.copyright}>
        © Miguel, Andrea, Christian, Paz
      </Text>
    </View>
  );
};

export default Perfil;

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

const viewStyles = StyleSheet.create<{
  outerContainer: ViewStyle;
  container: ViewStyle;
  card: ViewStyle;
  avatar: ImageStyle;
  editButton: ViewStyle;
  logoutButton: ViewStyle;
}>({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-start', // Centrado vertical solo en web
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: Platform.OS === 'web' ? 0 : 120, // Solo margen arriba en móvil
  },
  card: {
    backgroundColor: '#fff', 
    borderRadius: 16,        
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,     
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6D5C3',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#782701', 
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,          
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#B65D45',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,          
    alignSelf: 'center',
  },
});

const textStyles = StyleSheet.create<{
  header: TextStyle;
  name: TextStyle;
  email: TextStyle;
  editText: TextStyle;
  logoutText: TextStyle;
  copyright: TextStyle;
}>({
  header: {
    fontSize: 30,
    fontWeight: '700',
    color: '#782701',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 30,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3E2C23',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#7D5F4B',
    marginBottom: 20,
  },
  editText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  copyright: {
    fontSize: 12,
    color: '#B65D45',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.7,
  },
});
