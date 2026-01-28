import { Colors } from '@/constants/Colors'
import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Not found !</Text>
      <Link href="/" style={styles.button}>Go back home</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: Colors.white,
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    fontSize: 20,
    color: Colors.white,
    textDecorationLine: "underline",
  }
})