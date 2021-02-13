<template>
  <v-app class="px-5 py-5 mt-12 background-main"> 
      <h2>Data User</h2>
      <div class="py-5 px-5 mt-3 white">
        <v-row class="mt-2">
          <v-col lg="6" md="6" sm="12">
            <v-text-field
              filled
              rounded
              placeholder="Search"
              v-model="search"
              prepend-inner-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-data-table
          :headers="superadmin? superHeaders : adminHeaders"
          :items="user"
          :search="search"
          sort-by="id"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar class="toolbar-display" flat>
              <v-spacer></v-spacer>

              <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    v-if="superadmin"
                  >
                    TAMBAH
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-form
                      v-model="valid"
                      ref="form"
                      lazy-validation
                      style="width: 100% !important"
                      >
                      <v-col cols="12">
                        <v-text-field v-if="formTitle != 'Tambah user'" v-model="editedItem.id" type="phone" label="ID" disabled outlined></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.name" :rules="nameRules" label="Nama user" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.email" :rules="emailRules" type="email" label="Email" outlined></v-text-field>
                      </v-col>
                      <v-col cols="12" v-if="formTitle != 'Edit Data user'">
                        <v-select :items="role" :rules="roleRules" outlined v-model="editedItem.role" placeholder="Role">
                          <option value="super">Super Admin</option>
                          <option value="admin">Admin</option>
                        </v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-if="formTitle != 'Edit Data user'" 
                          :rules="passwordRules"
                          :type="show ? 'text' : 'password'"
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append="show = !show"
                          v-model="editedItem.password" label="Password" outlined></v-text-field>
                      </v-col>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <!-- <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil 
            </v-icon>
            <v-icon small class="mr-2" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template> -->
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil 
            </v-icon>
            <v-icon small class="mr-2" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:[`item.roles`] ="{ item }">
            <v-col >
              <v-select :items="role" :rules="roleRules" :value="item.role" placeholder="Role" @change="changeRole(item.id, item.role)"/>
            </v-col>
          </template>
        </v-data-table>
      </div> 
      <router-view></router-view> 
  </v-app>
</template>

<script>
import UsersService from "../services/UsersService";
export default {
  name: "User",

  components: {},

  data: () => ({
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length > 2) || 'Name must be more than 2 characters'
    ],
    emailRules: [
      v => !!v || 'Email is required',
    ],
    roleRules: [
      v => !!v || 'Role is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be more or equal to 8 characters'
    ],
    valid: false,
    show: false,
    superadmin: false,
    items: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    role: [
      "admin",
      "super",
    ],

    jenis: ['motor', 'mobil'],
  
    IdentitasKendaraan: [
    ],
    DataParkir: [
    ],

    search: "",
    dialog: false,
    dialogDelete: false,
    dialogDetails: false,

    adminHeaders: [
      { text: "Id", align: "start", value: "id" },
      {
        text: "Nama user",
        sortable: true,
        value: "name",
      },
      { text: "Email", value: "email" },
    ],

    superHeaders: [
      { text: "Id", align: "start", value: "id" },
      {
        text: "Nama user",
        sortable: true,
        value: "name",
      },
      { text: "Email", value: "email" },
      { text: "Actions", value: "actions", sortable: "false" },
      { text: "Roles", value: "roles", sortable: "false" },
    ],
    
    user: [],
    editedIndex: -1,
    editedItem: {
      id: "",
      name: "",
      email: "",
      role: "",
      password: "",
    },
    defaultItem: {
      id: "",
      name: "",
      email: "",
      role: "",
      password: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Tambah user" : "Edit Data user";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogDetails(val) {
      val || this.closeDetails();
    },
  },

  mounted() {
    UsersService.getAll()
      .then((res) => {
        this.user = res.data.data;
      })
      .catch((err) => {
        console.log(err);
      });


      if(this.$session.get("role") == "super") {
        this.superadmin = true
      }

      console.log(this.$session.get("role"))
  },

  methods: {
    initialize() {
      UsersService.getAll()
        .then((res) => {
          this.user = res.data.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getColor(status) {
      if (status == "Selesai") return "green";
      else if (status == "Aktif") return "blue";
    },

    editItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    detailsItem(item) {
      this.IdentitasKendaraan = item.kendaraans
      this.DataParkir = item.parkirs
      this.dialogDetails = true;
    },

    deleteItem(item) {
      this.editedIndex = this.user.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      UsersService.delete(this.user[this.editedIndex].id) 
        .then(res => {
          this.$swal({
            title: 'Berhasil',
            text: res.messages,
            icon: 'success',  
            showConfirmButton: false,
            timer: 1000               
          })
          this.user.splice(this.editedIndex, 1);
          this.closeDelete();
        }).catch(err => {
          this.$swal({
            title: 'Gagal',
            text: err.response.messages,
            icon: 'error',                    
            showConfirmButton: false,
            timer: 1000
          })
        })
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });

      // this.$refs.form.reset()
      this.$refs.form.resetValidation()
    },

    closeDetails() {
      this.dialogDetails = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if(this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          console.log(this.editedItem)
          UsersService.edit(this.editedItem)
            .then(res => {
              this.$swal({
                title: 'Berhasil',
                text: res.messages,
                icon: 'success',  
                showConfirmButton: false,
                timer: 1000               
              })
              this.close();

            }).catch(err => {
              this.$swal({
                title: 'Gagal',
                text: err.messages,
                icon: 'error',                    
                showConfirmButton: false,
                timer: 1000
              })
            })
  
          Object.assign(this.user[this.editedIndex], this.editedItem);
  
        } else {
  
          // this.editedItem.createdAt = new Date().getFullYear()+"-"+ new Date().getMonth()+"-"+ new Date().getDate()+"T"+ new Date().getHours()+":"+ new Date().getMinutes()+":"+ new Date().getSeconds()+".000Z"
          this.user.push(this.editedItem);
  
          UsersService.add(this.editedItem)
            .then(res => {
              this.$swal({
                title: 'Berhasil',
                text: res.messages,
                icon: 'success',  
                showConfirmButton: false,
                timer: 1000               
              })
              this.close();
              this.initialize()
            }).catch(err => {
              this.$swal({
                title: 'Gagal',
                text: err.messages,
                icon: 'error',                    
                showConfirmButton: false,
                timer: 1000
              })
              this.user.splice(this.editedIndex, 1);
            })
  
        }
        
      }
      
    },

    changeRole(id, roleuser) {

      let thisrole = ''
      if (roleuser == 'admin') {
        thisrole = 'super'
      } else {
        thisrole = 'admin'
      }

      UsersService.editRole(id, thisrole)
        .then((res) => {
          this.$swal({
              title: 'Berhasil',
              text: res.messages,
              icon: 'success',  
              showConfirmButton: false,
              timer: 1000               
            })
            this.close();
        })

      this.initialize()

    }
  },
};
</script>
