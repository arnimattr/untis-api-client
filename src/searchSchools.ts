import { RPCClient, RPCError } from "lib/jsonrpc/mod.ts";
import { ErrorCode, searchSchool } from "webuntis/requests";
import { School } from "./wrappers/mod.ts";

const rpcClient = new RPCClient("https://mobile.webuntis.com/ms/schoolquery2");

async function findSchools(query: searchSchool.params): Promise<School[]> {
  let { schools } = await rpcClient
    .request<searchSchool.result>(searchSchool.method, query)
    .catch((e) => {
      if (e instanceof RPCError && e.code == ErrorCode.TooManyResults) {
        return { schools: [] };
      }
      throw e;
    });

  return schools.map(School.from);
}

/**
 * Searches all Schools by their name and returns a list of matching schools.
 * @param name the name to look for
 * @returns a list of matching schools. If there are too many results, the list is empty
 */
export function searchSchoolsByName(name: string): Promise<School[]> {
  return findSchools([{ search: name }]);
}

/**
 * Finds a school by its id.
 * @param id the school's id
 * @returns the school or null if the id is invalid.
 */
export async function getSchoolById(id: number): Promise<School | null> {
  let schools = await findSchools([{ schoolid: id }]);

  if (schools.length !== 1) return null;
  return schools[0]!;
}

/**
 * Finds a school by its login name.
 * @param loginName the school's login name
 * @returns the school or null if the login name is invalid.
 */
export async function getSchoolByLoginName(
  loginName: string
): Promise<School | null> {
  let schools = await findSchools([{ schoolname: loginName }]);

  if (schools.length !== 1) return null;
  return schools[0]!;
}
