import {
    createNavigationContainerRef,
    CommonActions,
    StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export async function navigate(routeName: string, params?: object) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate(routeName, params))
    }
}

export async function replace(routeName: string, params?: object) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(routeName, params))
    }
}

export async function resetAndNavigate(routeName: string, params?: object) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.reset({
            index: 0,
            routes: [{ name: routeName, params }],
        }))
    }
}

export async function goBack() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.goBack())
    }
}