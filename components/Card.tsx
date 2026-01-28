import { CommonStyles } from '@/constants/CommonStyles'
import { PropsWithChildren } from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = PropsWithChildren<{}>

export default function Card({ children}: Props) {
  return (
    <View style={CommonStyles.card}>
      { children }
    </View>
  )
}

const styles = StyleSheet.create({})