import { Image, ImageStyle } from 'expo-image'
import { StyleSheet, View, ViewStyle } from 'react-native'

type Props = {
    source: any
    width?: number
    height?: number
    style?: ViewStyle
    imageStyle?: ImageStyle
}

export default function ImageIcon({ source, width = 24, height = 24, style, imageStyle }: Props) {
    return (
        <View style={[styles.container, { width, height }, style]}>
            <Image 
                source={source} 
                style={[styles.image, { width, height }, imageStyle]}
                contentFit="cover"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        borderRadius: 4,
    },
})
