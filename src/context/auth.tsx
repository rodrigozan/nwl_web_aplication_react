import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../services/api'

type User = {
  id: string;
  avatar_url: string;
  name: string;
  login: string;
}

type AuthContextDate = {
  user: User | null
  signInUrl: string,
  signOut: () => void
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export const AuthContext = createContext({} as AuthContextDate)

type AuthProvider = {
  children: ReactNode
}

export function AuthProvicer(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)

  const signInUrl = `https://github.com/login/oauth/authorize?scope-user&client_id=dd36cfc17b24dc449821`

  async function signIn(githubeCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubeCode,
    })

    const { token, user } = response.data

    localStorage.setItem('@dowhile:token', token)

    api.defaults.headers.common.authorization = `Bearer ${token}`

    setUser(user)
  }

  async function signOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`

      api.get<User>('profile').then(response => {
        setUser(response.data)
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [urlWithoutCode, githubeCode] = url.split('?code=')

      window.history.pushState({}, '', urlWithoutCode)

      signIn(githubeCode)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}