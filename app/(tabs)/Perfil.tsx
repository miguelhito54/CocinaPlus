import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AVATAR_URL = 'https://i.pravatar.cc/150?img=3'; 

const Perfil = () => {
  const router = useRouter();

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleCrudNavigate = () => {
    router.push('/CRUD');
  };

  return (
    <View style={viewStyles.outerContainer}>
      <View style={viewStyles.container}>
        <Text style={textStyles.header}>Mi Perfil</Text>
        <View style={viewStyles.card}>
          <Image source={{ uri: AVATAR_URL }} style={viewStyles.avatar} />
          <Text style={textStyles.name}>Miguel</Text>
          <Text style={textStyles.email}>miguel@example.com</Text>
          <TouchableOpacity style={viewStyles.editButton} onPress={handleCrudNavigate}>
            <Text style={textStyles.editText}>
              <AntDesign name="edit" size={20} color="#5a4633" /> Gestionar recetas
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
    backgroundColor: '#FAF3EC',
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? undefined : undefined, // Remove '100vh' for web, as it's not valid ViewStyle
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
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
    backgroundColor: '#DAB49D',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#B65D45',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
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
    color: '#5A3E2B',
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
    color: '#4B2F22',
    fontWeight: '500',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
