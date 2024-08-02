<template>
  <v-navigation-drawer
        v-model="drawer"
        :rail="rail"
        permanent
        @click="rail = false"
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="John Leider"
          nav
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-server"
            title="Server List"
            value="node_list"
            @click="to('node_list')"
          ></v-list-item>
          <!-- <v-list-item prepend-icon="mdi-home-city" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-server" title="Server List" value="node_list"></v-list-item>
          <v-list-item prepend-icon="mdi-account-group-outline" title="Users" value="users"></v-list-item> -->
        </v-list>
        <!-- logout button(bottom) -->
         <v-divider></v-divider>
        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="logout"
        ></v-list-item>

    </v-navigation-drawer>
  </template>
  
  <script setup lang="ts">
    //
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    
    const router = useRouter()


    const drawer = ref(true)

    const rail = ref(false)
    function logout () {
      console.log('Logout')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      router.push('/login')
    }

    function to (e) {
      console.log(e)
      router.push(`/${e}`)
    }

  </script>
  