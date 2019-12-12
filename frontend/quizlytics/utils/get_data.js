import { fetch_get, api_path } from '../utils/api_path'

export const get_all_from_api = async (ctx, url, token) => {
  let next_url = url;
  let all_data = []
  while (next_url != null) {
    const api_data = await fetch_get(
      ctx,
      next_url,
      token,
    )
    next_url = api_data.next
    all_data = all_data.concat(api_data.results)
  }
  return all_data
}

export const get_user_id_from_api = async (ctx, token) => {
  const api_data = await fetch_get(
    ctx,
    api_path['users'],
    token
  )
  return api_data.results[0]['id']
}