import { Colors } from "@utils/Constants";
import { FC, ReactNode } from "react";
import { SafeAreaView,StyleSheet,View,ViewStyle } from "react-native";

interface CustomSafeAreaViewProps {
    children: ReactNode;
    style?: ViewStyle;
}

const CustomSafeAreaView: FC<CustomSafeAreaViewProps>= ({children, style}) => {
    return (
        <View style = {[styles.container, style]}> 
            <SafeAreaView />
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
})

export default CustomSafeAreaView;