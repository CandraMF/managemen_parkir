<template>
  <v-app>
    <Appbar
      v-if="
        CheckIfRoute('Home') ||
        CheckIfRoute('Parking') ||
        CheckIfRoute('Students') ||
        CheckIfRoute('Teacher') ||
        CheckIfRoute('Guest') ||
        CheckIfRoute('User')
      "
    />
    <Login v-if="CheckIfRoute('Login')" />

    <v-main> </v-main>
  </v-app>
</template>

<script>
import Appbar from "./views/component/Appbar";
import Login from "./views/componentt/Login";

export default {
  name: "App",
  methods: {
    CheckIfRoute: function (routeName) {
      console.log(this.$route.name === routeName);
      return this.$route.name === routeName;
    },
  },
  components: {
    Appbar,
    Login,
  },

  data: () => ({
    //
  }),
};
</script>
