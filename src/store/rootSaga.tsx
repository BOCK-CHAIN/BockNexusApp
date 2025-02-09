import categoriesSaga from "@modules/categories/api/saga";
import homeSaga from "@modules/home/api/saga";
import { all, fork } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    fork(homeSaga),
    fork(categoriesSaga)
  ]);
}