import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithGoogle, signInWithFacebook } from '../../users/infrastructure/firebaseAuth';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = () => {
  const router = useRouter();

  const handleFacebookLogin = () => {
    alert('Iniciar sesión con Facebook');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>¡Bienvenido a Cocina Más!</Text>
        <Text style={styles.subtitle}>Inicia sesión y disfruta de la experiencia</Text>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: '#782701' }]}
          onPress={handleFacebookLogin}
        >
          <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.loginButtonText}>Iniciar sesión con Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: '#782701' }]}
          onPress={() => signInWithGoogle((path: string) => router.push(path as any))}
        >
          <MaterialCommunityIcons name="google" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.loginButtonText}>Iniciar sesión con Google</Text>
        </TouchableOpacity>

        <Text style={styles.guestText}>O continúa como invitado</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#782701',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    marginRight: 6,
  },
  guestText: {
    marginTop: 12,
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
  },
});

export default LoginScreen;