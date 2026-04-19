import { listEntity } from '../mocks/database'

export async function fetchOperationLogs() {
  const list = await listEntity('operationLogs')
  return list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

export async function fetchLoginLogs() {
  const list = await listEntity('loginLogs')
  return list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}
