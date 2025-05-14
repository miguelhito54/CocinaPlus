import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const Perfil = () => {
  const [user, setUser] = useState({ displayName: '', email: '', photoURL: '' });
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || '',
        });
      } else {
        setUser({ displayName: '', email: '', photoURL: '' });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut()
      .then(() => {
        console.log("User signed out");
        router.push('/login'); // Redirect to the login page
      })
      .catch((error) => {
        console.error("Error signing out:", error);
        alert("Error al cerrar sesión: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✨ Perfil ✨</Text>
      <View style={styles.userInfo}>
        {user.photoURL ? (
          <Image
            source={{ uri: user.photoURL }}
            style={styles.avatar}
            onError={() => setUser((prev) => ({ ...prev, photoURL: '' }))}
          />
        ) : (
          <Image
            source={require('../../assets/images/default.png')}
            style={styles.avatar}
          />
        )}
        <Text style={styles.label}>🌸 Nombre:</Text>
        <Text style={styles.value}>{user.displayName || 'Desconocido'}</Text>
        <Text style={styles.label}>📧 Correo:</Text>
        <Text style={styles.value}>{user.email || 'No disponible'}</Text>
      </View>
      <Button title="Cerrar sesión" color="#a67c52" onPress={handleLogout} />

      <View style={styles.userOptions}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/CRUD')} // Redirect to the CRUD page
        >
          <AntDesign name="edit" size={20} color="#5a4633" />
          <Text style={styles.optionText}>Gestionar Recetas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ddc8b5', // Updated background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a4633', // Darker shade for text
    marginBottom: 20,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a4633', // Darker shade for labels
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#5a4633', // Border matches text color
  },
  userOptions: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5a4633',
  },
});

export default Perfil;
