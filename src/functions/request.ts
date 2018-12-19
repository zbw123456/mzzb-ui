export default async function request(input: RequestInfo, init?: RequestInit) {
  const resp = await fetch(input, init);
  if (resp.ok) {
    return resp.json();
  } else {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }
}
