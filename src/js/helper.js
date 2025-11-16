import { TIMEOUT_SECONDS, BEAR_TOKEN } from "./config";

const timeout = function (sec) {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(`Request took too long! Timeout after ${sec} seconds`)
        ),
      sec * 1000
    )
  );
};

export const getJSON = async function (url) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEAR_TOKEN}`,
    },
  };
  try {
    if (!Array.isArray(url)) {
      const res = await Promise.race([
        fetch(url, options),
        timeout(TIMEOUT_SECONDS),
      ]);
      const data = await res.json();

      if (!res.ok)
        throw new Error(`${data.message}, status code:(${res.status})`);

      return data;
    } else {
      const responses = await Promise.race([
        await Promise.allSettled(url.map((url) => fetch(url, options))),
        timeout(TIMEOUT_SECONDS),
      ]);

      responses.forEach((res) => {
        if (!res.value.ok)
          throw new Error(
            `there is a problem ☹ (status code: ${res.value.status})`
          );
      });

      const dataList = await Promise.allSettled(
        responses.map(async (res) => await res.value.json())
      );
      return dataList;
    }
  } catch (err) {
    throw err;
  }
};
