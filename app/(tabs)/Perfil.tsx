import React, { useEffect, useState } from 'react';
import { handleLogout } from '../../users/infrastructure/firebaseAuth';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Perfil = () => {
  const [user, setUser] = useState({ displayName: '', email: '', photoURL: '' });

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

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Perfil</Text>
      <View style={styles.userInfo}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : null}
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{user.displayName}</Text>
        <Text style={styles.label}>Correo:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default Perfil;
