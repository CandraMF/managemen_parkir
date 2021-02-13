<template>
  <v-app>
    <div class="container">
      <div class="img">
        <img src="../assets/vehicle.svg" />
      </div>
      <div class="login-container">
        <v-form
          v-model="valid"
          ref="form"
          lazy-validation>
          <img class="avatar" src="../assets/avatar.svg" />
          <h2>Welcome</h2>
          <div>
            <v-text-field
              label="Email"
              prepend-icon="mdi-account"
              v-model="email"
              required
              :rules="passwordRules"
            ></v-text-field>
          </div>
          <div>
            <v-text-field
              label="Password"
              prepend-icon="mdi-lock"
              v-model="password"
              :rules="passwordRules"
              :type="show ? 'text' : 'password'"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show = !show"
              required
            ></v-text-field>
          </div>
          <a class="a" href="#">Forgot Password?</a>
          <div class="text-center">
            <v-btn class="btn py-2" rounded dark @click="login" @keyup.enter="login"> Login </v-btn>
          </div>
        </v-form>
      </div>
    </div>
    <v-snackbar v-model="snackbar">
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style type="text/css">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
body {
  font-family: "Poppins, sans-serif";
}
.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 7rem;
  padding: 0 2 rem;
}
.img img {
  width: 100%;
  margin-top: 230px;
  margin-left: 20px;
}
.login-container {
  display: flex;
  align-items: center;
  text-align: center;
}
form {
  width: 360px;
}
.avatar {
  width: 20%;
}
form h2 {
  font-size: 2.9rem;
  text-transform: uppercase;
  margin: 15px 0;
  color: #333;
}
.a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}
.a:hover {
  color: black;
}
.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  margin: 1rem 0;
  font-size: 1.2rem;
  outline: none;
  border: none;
  cursor: pointer;
  background-image: linear-gradient(to right, #000, #121212, #000);
  background-size: 200%;
  font-family: "product sans", sans-serif;
  color: #fff;
  transition: 0.5s;
  text-transform: uppercase;
}
.btn:hover {
  background-position: right;
}
@media screen and (max-width: 1000px) {
  .img {
    display: none;
  }
  .container {
    height: 100vh;
    width: fit-content !important;
    align-items: center;
    display: flex;
    text-align: center;
  }
  .form {
    text-align: center;
    align-items: center;
  }
}
</style>

<script>
import AuthService from "../services/AuthService";
export default {
  props: {
    source: String,
  },
  components: {},
  data: () => ({
    snackbar: false,
    message: ``,
    valid: false,
    username: "",
    nameRules: [
      (v) => !!v || "username tidak boleh kosong",
    ],
    password: "",
    show: false,
    emailRules: [
      v => !!v || 'Email is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    email: "",
  }),
  methods: {
    login() {
      if(this.$refs.form.validate()) {
        AuthService.login(this.email, this.password)
          .then((response) => {
            if (response.status === 200) {
              this.$session.start();
              this.$session.set("id", response.data.data.id);
              this.$session.set("name", response.data.data.name);
              this.$session.set("role", response.data.data.role);
              console.log(response.data.message);
  
              this.$swal({
                title: response.data.message,
                text: "Selamat datang",
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
              });
              this.$router.push("/dashboard");
            }
          })
          .catch((err) => {
            this.snackbar = true;
            this.message = err.response.data.message;
          });
      }
    },
  },
};
</script>