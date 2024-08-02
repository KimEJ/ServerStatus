<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>
            <h1>Login</h1>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                required
                type="password"
              ></v-text-field>
              <v-row justify="space-between">
                <v-col cols="4">
                  <v-btn block @click="login">Login</v-btn>
                </v-col>
                <v-col cols="4">
                  <v-btn block @click="router.push('/register')">Register</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios, setDefaultHeaders } from '@/plugins/axios';

const axios = useAxios()

const email = ref('')
const password = ref('')
const router = useRouter()

function login() {
  console.log('Login')

  axios.post('/auth/login', {
    email: email.value,
    password: password.value
  }).then((res) => {
    console.log(res)
    localStorage.setItem('accessToken', res.data.accessToken)
    localStorage.setItem('refreshToken', res.data.refreshToken)
    // token save to axios
    setDefaultHeaders({ Authorization: `Bearer ${res.data.accessToken}` })
    router.push('/')
  }).catch((err) => {
    console.error(err)
  })
}
</script>
<route lang="yaml">
meta:
  layout: login
</route>