import { api } from './client'

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface TokenResponse {
  accessToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export async function createUser(input: CreateUserInput): Promise<UserResponse> {
  const { data } = await api.post<UserResponse>('/users', input)
  return data
}

export async function login(input: LoginInput): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/login', input)
  return data
}

export async function getMe(signal?: AbortSignal): Promise<UserResponse> {
  const { data } = await api.get<UserResponse>('/auth/me', { signal })
  return data
}
