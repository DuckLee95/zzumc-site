export async function fetchMinecraftServerStatus(address) {
  const url = `https://api.mcsrvstat.us/3/${encodeURIComponent(address)}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`服务器状态请求失败: ${res.status}`)
  }

  const data = await res.json()

  return {
    online: Boolean(data.online),
    hostname: data.hostname || address,
    ip: data.ip || '',
    port: data.port || '',
    version:
      data.protocol?.name ||
      data.version ||
      '',
    playersOnline: data.players?.online ?? 0,
    playersMax: data.players?.max ?? 0,
    motd: Array.isArray(data.motd?.clean)
      ? data.motd.clean.join(' ')
      : '',
    icon: data.icon || '',
  }
}

export async function fetchMultipleMinecraftServerStatus(servers) {
  const results = await Promise.allSettled(
    servers.map((server) => fetchMinecraftServerStatus(server.address))
  )

  return servers.map((server, index) => {
    const result = results[index]

    if (result.status === 'fulfilled') {
      return {
        ...server,
        status: result.value,
        error: '',
      }
    }

    return {
      ...server,
      status: null,
      error: '状态获取失败',
    }
  })
}