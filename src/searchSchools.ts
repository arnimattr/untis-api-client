import { findSchemaError } from "@arnim279/schema-validator";
import { RPCClient, RPCError } from "@lib/jsonrpc";
import * as data from "./data";
import { ErrorCode, searchSchool } from "./requests";

const rpcClient = new RPCClient("https://mobile.webuntis.com/ms/schoolquery2");

async function findSchools(query: searchSchool.params): Promise<data.school[]> {
  let response;
  try {
    response = await rpcClient.request(searchSchool.method, query);
  } catch (e) {
    if (e instanceof RPCError && e.code == ErrorCode.TooManyResults) return [];
    else {
      //log error
    }
  }

  let err = findSchemaError(response, searchSchool.resultSchema);
  if (err !== undefined) {
    // log error
    return [];
  }

  let { schools } = response as searchSchool.result;
  return schools;
}

/**
 * Searches all Schools by their name and returns a list of matching schools.
 * @param name the name to look for
 * @returns a list of matching schools. if there are too many results, the list is empty
 */
export function searchSchoolsByName(name: string): Promise<data.school[]> {
  return findSchools([{ search: name }]);
}

/**
 * Finds a school by its id.
 * @param id the school's id
 * @returns the school or null if the id is invalid.
 */
export async function getSchoolById(id: number): Promise<data.school | null> {
  let schools = await findSchools([{ schoolid: id }]);

  if (schools.length !== 1) return null;
  return schools[0]!;
}
