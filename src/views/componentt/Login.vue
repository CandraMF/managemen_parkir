<template>
  <v-app>
    <div class="container">
      <div class="img">
        <img src="../assets/vehicle.svg" />
      </div>
      <div class="login-container">
        <form to="/">
          <img class="avatar" src="../assets/avatar.svg" />
          <h2>Welcome</h2>
          <div>
            <v-text-field
              label="Username"
              prepend-icon="mdi-account"
            ></v-text-field>
          </div>
          <div>
            <v-text-field
              label="Password"
              prepend-icon="mdi-lock"
            ></v-text-field>
          </div>
          <a class="a" href="#">Forgot Password?</a>
          <div class="text-center">
            <v-btn class="btn py-2" rounded dark
            to="/"> Login </v-btn>
          </div>
        </form>
      </div>
    </div>
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
</style>
<script type="text/javascript">
export default {
  props: {
    source: String,
  },
};
</script>