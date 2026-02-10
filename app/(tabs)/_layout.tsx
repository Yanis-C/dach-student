import { Colors } from "@/constants/Colors";
import { CommonStyles } from "@/constants/CommonStyles";
import { Spacing } from "@/constants/Spacing";
import { FontFamily, FontSize } from "@/constants/Typography";
import { Tabs } from "expo-router";
import { Text } from "react-native";

import { CustomTabBar } from "@/components/navigation/CustomTabBar";

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: Colors.white },
                headerShadowVisible: false,
                headerTintColor: Colors.black,
                headerTitleStyle: {
                    fontFamily: FontFamily.bold,
                    fontSize: FontSize.lg,
                },
                headerTitleAlign: 'left',
                headerLeftContainerStyle: { paddingLeft: Spacing.lg },
                headerRightContainerStyle: { paddingRight: Spacing.lg },
            }}
        >
            <Tabs.Screen name="index" options={{
                title: "Dachboard",
                headerRight: () => <Text style={CommonStyles.text}>Hello Yanis !</Text>,
            }} />
            <Tabs.Screen name="planning" options={{
                title: "Planning",
            }} />
            <Tabs.Screen name="subjects" options={{
                title: "Exams",
            }} />
            <Tabs.Screen name="coach" options={{
                title: "Coach",
            }} />
        </Tabs>
    );
}
