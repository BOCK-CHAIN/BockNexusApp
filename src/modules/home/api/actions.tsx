import { GET_HOME_CONTENT } from "./constants"
export const getHomeContent = (page: number) => {
    return {
        type: GET_HOME_CONTENT,
        payload: {
            page: page
        }
    }
}