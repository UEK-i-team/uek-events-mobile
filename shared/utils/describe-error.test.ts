import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

import { describeError } from "./describe-error";

describe("describeError", () => {
  it("drops request headers with the bearer token from Axios errors", () => {
    const config = {
      method: "get",
      url: "api/schedules/groups/classes/?group_ids=1,2",
      headers: new AxiosHeaders({ Authorization: "Bearer secret-token" }),
    } as InternalAxiosRequestConfig;
    const error = new AxiosError(
      "Request failed with status code 500",
      "ERR_BAD_RESPONSE",
      config,
      undefined,
      { status: 500, statusText: "", headers: {}, config, data: {} },
    );

    const result = describeError(error);

    expect(JSON.stringify(result)).not.toContain("secret-token");
    expect(JSON.stringify(result)).not.toContain("Bearer");
    expect(result).toEqual({
      name: "AxiosError",
      message: "Request failed with status code 500",
      code: "ERR_BAD_RESPONSE",
      status: 500,
      method: "get",
      url: "api/schedules/groups/classes/",
    });
  });

  it("keeps name and message of regular errors", () => {
    expect(describeError(new TypeError("boom"))).toEqual({
      name: "TypeError",
      message: "boom",
    });
  });

  it("stringifies non-error values", () => {
    expect(describeError("offline")).toEqual({ message: "offline" });
  });
});
