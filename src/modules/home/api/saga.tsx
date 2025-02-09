import { fetchApiData } from "./api";
import { GET_HOME_CONTENT } from "./constants";
import { setData, setError, setLoading } from "./slice";
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchApiDataSaga(): any {
    try {
        yield put(setLoading());
        const data = yield call(fetchApiData);
        yield put(setData(data))
    } catch (error: any) {
        yield put(setError(error.message))
    }
}
function* homeSaga() {
    yield takeEvery(GET_HOME_CONTENT, fetchApiDataSaga)
}
export default homeSaga