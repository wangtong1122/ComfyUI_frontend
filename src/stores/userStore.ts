import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

import { api } from '@/scripts/api'
import type { User as UserConfig } from '@/types/apiTypes'

export interface User {
  userId: string
  username: string
}

export const useUserStore = defineStore('user', () => {
  /**
   * The user config. null if not loaded.
   */
  const userConfig = ref<UserConfig | null>(null)
  /**
   * The current user id. null if not logged in or in single user mode.
   */
  const currentUserId = ref<string | null>(null)
  // 默认单用户 {"storage": "server", "migrated": true}
  // 多用户返回 {"storage": "server","users": {"wxb_023192a5-34e5-4b45-8620-a1962b1eb71c": "wxb","lxy_2f5972c8-6e9c-4073-8eb0-9cb91eea93da": "lxy"}
  // 接口调用 Header comfy-user:wxb_023192a5-34e5-4b45-8620-a1962b1eb71c
  const isMultiUserServer = computed(
    () => userConfig.value && 'users' in userConfig.value
  )
  const needsLogin = computed(
    () => !currentUserId.value && isMultiUserServer.value
  )
  const users = computed<User[]>(() =>
    Object.entries(userConfig.value?.users ?? {}).map(([userId, username]) => ({
      userId,
      username
    }))
  )
  const currentUser = computed<User | null>(
    () =>
      users.value.find((user) => user.userId === currentUserId.value) ?? null
  )
  const initialized = computed(() => userConfig.value !== null)

  /**
   * Initialize the user store.
   */
  async function initialize() {
    userConfig.value = await api.getUserConfig()
    currentUserId.value = localStorage['Comfy.userId']
  }

  /**
   * Create a new user.
   *
   * @param username - The username.
   * @returns The new user.
   */
  async function createUser(username: string): Promise<User> {
    const resp = await api.createUser(username)
    const data = await resp.json()
    if (resp.status >= 300) {
      throw new Error(
        data.error ??
          'Error creating user: ' + resp.status + ' ' + resp.statusText
      )
    }
    return {
      userId: data,
      username
    }
  }

  /**
   * Login the current user.
   *
   * @param user - The user.
   */
  async function login({
    userId,
    username
  }: {
    userId: string
    username: string
  }) {
    currentUserId.value = userId
    localStorage['Comfy.userId'] = userId
    localStorage['Comfy.userName'] = username
  }

  watchEffect(() => {
    if (isMultiUserServer.value && currentUserId.value) {
      api.user = currentUserId.value
    }
  })

  /**
   * Logout the current user.
   */
  async function logout() {
    delete localStorage['Comfy.userId']
    delete localStorage['Comfy.userName']
  }

  return {
    users,
    currentUser,
    isMultiUserServer,
    needsLogin,
    initialized,
    initialize,
    createUser,
    login,
    logout
  }
})
