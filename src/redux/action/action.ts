import { Dispatch } from "redux";
import axios from "axios";
import QS from "query-string";
import { pipe } from "fp-ts/lib/function";

import { getActionTypes, getManyActionTypes } from "../reducer/async-reducer";

import { ResourceKey, Resources } from "../../models/Resources.model";
import { RequirementParams } from "../../hooks/useFetchMany";

const apikey = process.env.REACT_APP_APIKEY;

export const getOne = <A extends ResourceKey>(
  resKey: ResourceKey,
  options: { id: number | string } & RequirementParams<A>
) => {
  const { name, api, params: resourceParams } = Resources[resKey];

  const [GET_ACTION, SUCCESS_ACTION, FAILED_ACTION] = getActionTypes(name);

  const { id } = options;

  return (dispatch: Dispatch) => {
    dispatch({ type: GET_ACTION, id });
    axios
      .get((typeof api === "string" ? api : api(options.parents as any)) + "/" + id, {
        headers: { "x-api-key": apikey },
        params: {},
        paramsSerializer: (params: any) => pipe(params, resourceParams, QS.stringify),
      })
      .then((res) => {
        dispatch({ type: SUCCESS_ACTION, id, data: res.data.result });
      })
      .catch((_) => {
        dispatch({ type: FAILED_ACTION, id });
      });
  };
};

export const getMany = (resKey: ResourceKey, options: any) => {
  const { name, api, params: resourceParams } = Resources[resKey];
  const [GET_MANY_ACTION, SUCCESS_MANY_ACTION, FAILED_MANY_ACTION] = getManyActionTypes(name);

  return (dispatch: Dispatch) => {
    dispatch({ type: GET_MANY_ACTION });
    axios
      .get(typeof api === "string" ? api : api(options.parents), {
        headers: { "x-api-key": apikey },
        params: {},
        paramsSerializer: (params: any) => pipe(params, resourceParams, QS.stringify),
      })
      .then((res) => {
        dispatch({ type: SUCCESS_MANY_ACTION, data: res.data.result });
      })
      .catch((_) => {
        console.error(_);

        dispatch({ type: FAILED_MANY_ACTION });
      });
  };
};
