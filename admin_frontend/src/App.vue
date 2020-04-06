<template>
  <div id="app" class="container">
-    <div id="flash_container" v-bind:class="'alert alert-'+flash_type">
      <h2>{{flash_message}}</h2>
    </div>

    <div class="row alert alert-info" id="batch_download">
      <button id="approve" class="btn btn-success btn-lg col-xs-12 col-sm-6 col-sm-offset-3" v-on:click="goBatchDl">
        Batch Download Letters
      </button>
    </div>
        <div class="row alert alert-info" id="go_review">
      <button id="approve" class="btn btn-lg btn-primary col-xs-12 col-sm-6 col-sm-offset-3" v-on:click="goReview">
        Go to review mode
      </button>
    </div>

    <div class="row alert alert-info" id="batch_download">
        <h1>Enregistrez un nouvel utilisateur</h1>
        <div class="form-group col-sm-12 col-md-4">
          <label for="register_pseudo">pseudo utilisateur : </label>
          <input type="text" class="form-control" placeholder="Username" name="username" v-model="register_username" id="register_pseudo">
          <br>
        </div>
        <div class="form-group col-sm-12 col-md-4">
          <label for="register_pass">mot de passe utilisateur : </label>
          <input type="text" class="form-control" placeholder="Password" v-model="register_password" name="password" id="register_pass">
        </div>
          <div class="form-group col-sm-12 col-md-4">
          <label for="pass">Administrateur ? </label>
          <input type="checkbox" class="form-control" v-model="register_is_admin" name="password" id="pass">
        </div>
      <button id="approve" class="btn btn-lg btn-warning col-xs-12 col-sm-6 col-sm-offset-3" v-on:click="registerUser" :disabled="block_button">
        Ajoutez Utilisateur
      </button>
    </div>

    <div class="row alert alert-info" id="user_list">
        <h1>Liste des utilisateurs</h1>
          <div class="row" v-for="user in users" v-bind:key="user.username">
            <div class="col-xs-4"><p>{{user.username}}</p></div>
            <div class="col-xs-4"><strong v-if="user.isAdmin">ADMIN</strong></div>
            <button id="approve" class="btn btn-lg btn-danger col-xs-4" v-on:click="removeUser(user.username)" :disabled="block_button">
            Remove
            </button>
            <hr>
        </div>
    </div>

    <div id="login_overlay" v-bind:class="login_hide">
      <div id="login_form" class="row alert alert-info col-xs-12 
      col-xs-offset-0 col-sm-6 col-sm-offset-3">
        <form>
        <div class="alert alert-danger" v-bind:class="login_error_hide">
          {{login_error}}
        </div>

        <p>Bienvenue !</p>

        <div class="form-group col-sm-12">
          <label for="pseudo">Votre pseudo : </label>
          <input type="text" class="form-control" placeholder="Username" name="username" v-model="username" id="pseudo">
          <br>
        </div>
        
        <div class="form-group col-sm-12">
          <label for="pass">Votre mot de passe : </label>
          <input type="password" class="form-control" placeholder="Password" v-model="password" name="password" id="pass">
        </div>

        <input type="submit" class="btn btn-success" v-on:click="login" :disabled="block_button" value="S'identifier">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: function() {return {
     flash_message: "Letter is loading .... ",
     flash_type: "info",

     block_button: false,  

      username: "", 
      password: "",

      users: {}, 

      login_hide: "",

      login_error: "",
      login_error_hide: "hide",

      register_username: "",
      register_password: "",
      register_is_admin: false,
   };},

  mounted: function() {
    this.letter = this.loading_letter;

    //this.axios.defaults.baseURL = "http://localhost:3000";
    this.axios.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
    this.axios.defaults.withCredentials = true;
    this.axios.interceptors.response.use(
       (response) => { 
         if (401 === response.status) {
           this.showLogin();
         }
         return response;
       }, 
       (error)    => {
         if (error.response != undefined && 401 === error.response.status) {
           this.showLogin();
         }
         return Promise.reject(error);
       });
      this.listUser();
  },

  methods: {
    registerUser: function() {
       this.letter = this.loading_letter;
       this.flash_message = "enregistrement en cours .... ";
       this.flash_type = "info";
       this.block_button = true;
       
       this.axios.post('/user/register', {username: this.register_username, password: this.register_password, admin: this.register_is_admin})
         .then((response) => {
              this.flash_message = "enregistrement réussi";
              this.flash_type = "success";
              this.block_button = false;
              this.listUser();

         })
         .catch((error) => {
            console.log(error);
            this.flash_message = error;
            if (error.response) {
               this.flash_message = this.flash_message + " ( " + error.response.data + " )"
            }
            this.flash_type = "danger";
            this.block_button = false;
         })
       },
       
    listUser: function() {
       this.flash_message = "chargement en cours .... ";
       this.flash_type = "info";
       this.block_button = true;
       
       this.axios.get('/user/list')
         .then((response) => {
              this.users=response.data;
              this.flash_message = "OK";
              this.flash_type = "success";
              this.block_button = false;

         })
         .catch((error) => {
            console.log(error);
            this.flash_message = error;
            if (error.response) {
               this.flash_message = this.flash_message + " ( " + error.response.data + " )"
            }
            this.flash_type = "danger";
            this.block_button = false;
         })
       },
    removeUser: function(id) {
       this.flash_message = "suppression en cours .... ";
       this.flash_type = "info";
       this.block_button = true;
       
       this.axios.post('/user/remove', {username: id})
         .then((response) => {
              this.flash_message = "suppression réussi";
              this.flash_type = "success";
              this.block_button = false;
              this.listUser();

         })
         .catch((error) => {
            console.log(error);
            this.flash_message = error;
            if (error.response) {
               this.flash_message = this.flash_message + " ( " + error.response.data + " )"
            }
            this.flash_type = "danger";
            this.block_button = false;
         })
       },

      login: function() {
          this.block_button = true;
          this.axios.post('/login', {username: this.username, password: this.password})
          .then((response) => {
            this.password="";
            this.login_hide = "hide";
            this.block_button = false;
            this.flash_message = "Connexion Réussie";
            this.flash_type = "success";
         })
         .catch((error) => {
            console.log(error);
            this.flash_message = error;
            this.flash_type = "danger";
           
            if (401 === error.response.status) {
              this.login_error = error.response.data;
            }
            else
            {
              this.login_error = error;
            }
            this.block_button = false;
            this.login_error_hide = "";
         })
      },
      showLogin: function() {
          this.login_hide = "";
      },
      goReview: function() {
          window.location.href = '/review';
      },
      goBatchDl: function() {
          window.location.href = '/admin/batchDownload';
      },

  },
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body{

  background-color: lightgray;
}

#login_overlay {
  background-color: rgba(127,127,127,0.6);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.85);
  z-index: 2; 
}

#login_form {
  position: fixed;
  margin-top: 20%;
}
.hide .hide > * {
  display: none;
}
</style>
