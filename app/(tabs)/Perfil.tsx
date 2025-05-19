import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../../.env/firebaseConfig'; // Adjust path if needed

const Perfil = () => {
  const router = useRouter();
  const user = auth.currentUser;

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
          {user?.photoURL ? (
            Platform.OS === 'web' ? (
              // Use native <img> for web to avoid CORS issues with react-native-web's Image
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
                  display: 'block'
                }}
                onError={e => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <Image source={{ uri: user.photoURL }} style={viewStyles.avatar} />
            )
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
    backgroundColor: '#FFF8F0', // Match login background
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? undefined : undefined,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#fff', // Match login card
    borderRadius: 16,        // Match login card radius
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,      // Match login shadow
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
    backgroundColor: '#782701', // Match login accent
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,           // Match login button radius
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#B65D45',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,           // Match login button radius
    alignSelf: 'center',
  },
});

const textStyles = StyleSheet.create<{
  header: TextStyle;
  name: TextStyle;
  email: TextStyle;
  editText: TextStyle;
  logoutText: TextStyle;
}>({
  header: {
    fontSize: 30,
    fontWeight: '700',
    color: '#782701', // Match login accent
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
    color: '#fff', // White text for dark button
    fontWeight: '500',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
