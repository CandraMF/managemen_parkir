<template>
  <v-app>
    <v-content>
      <TeachersTable />
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import TeachersTable from "../component/TeachersTable";

export default {
  name: "Teacher",

  components: {
    TeachersTable,
  },
  data: () => ({
    //
  }),
};
</script>
