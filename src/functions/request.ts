function prepareCookies({ credentials, ...props }: RequestInit) {
  if (!credentials) {
    credentials = 'include'
  }
  return { credentials, ...props }
}

const ContentType = 'Content-Type'
const ContentValue = 'application/json;charset=UTF-8'

const XCsrfHeader = 'X-CSRF-HEADER'
const XCsrfToken = 'X-CSRF-TOKEN'
const XAutoLogin = 'X-AUTO-LOGIN'

function prepareHeaders({ headers, ...prors }: RequestInit) {
  headers = new Headers(headers)
  const xCsrfKey = sessionStorage[XCsrfHeader]
  const xCsrfVal = sessionStorage[XCsrfToken]
  if (xCsrfKey && xCsrfVal) {
    headers.set(xCsrfKey, xCsrfVal)
  }
  if (prors.body) {
    headers.set(ContentType, ContentValue)
  }
  return { headers, ...prors }
}

function checkStatus(response: Response) {
  if (!response.ok) {
    if (response.status === 502) {
      throw new Error(`服务器可能正在重启，请过一分钟再试。`)
    } else {
      throw new Error(`服务器未正确响应: ${response.status}: ${response.statusText}`)
    }
  }
  return response
}

function saveOfToken(response: Response) {
  const headers = response.headers
  sessionStorage[XCsrfHeader] = headers.get(XCsrfHeader)
  sessionStorage[XCsrfToken] = headers.get(XCsrfToken)
  if (headers.has(XAutoLogin)) {
    localStorage[XAutoLogin] = headers.get(XAutoLogin)
  }
  return response
}

function parseToJSON(response: Response) {
  try {
    return response.json()
  } catch (err) {
    throw new Error(`错误的JSON格式, error=${err.message}, text=${response.text()}`)
  }
}

function handleError(error: Error) {
  return { success: false, message: error.message }
}

export default function request(url: string, props: RequestInit = {}) {
  props = prepareCookies(props)
  props = prepareHeaders(props)
  return fetch(url, props)
    .then(checkStatus)
    .then(saveOfToken)
    .then(parseToJSON)
    .catch(handleError)
}
