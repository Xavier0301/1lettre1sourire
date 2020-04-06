<template>
  <div id="app" class="container">
-    <div id="flash_container" v-bind:class="'alert alert-'+flash_type">
      <h2>{{flash_message}}</h2>
    </div>
    <div id="letter_container" class="row alert">
      <h2>{{letter.greeting}}</h2>
      <br>
      <p>{{letter.content}}<p>
      <br>
      <p id="signature">{{letter.signature}}</p>
      <br>
      <div class="col-sm-8 col-sm-offset-2"><img v-bind:src="letter.imageUrl" class="col-sm-8 col-sm-offset-2" style=/></div>
    </div>
    <div id="buttons" class="row alert">
      <button id="approve" class="btn btn-success col-xs-6 col-sm-3 col-sm-offset-2" v-on:click="approve" :disabled="block_button">
        Approve
      </button>
      <button id="deny" class="btn btn-danger col-xs-6 col-sm-3 col-sm-offset-2" v-on:click="deny" :disabled="block_button">
        Deny
      </button>
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

     block_button: "",
     
     loading_letter: {
            id: -1, 
            type: "",
            greeting: "",
            content: "Loading ...", 
            signature: "", 
            imageUrl: ""
      },

     letter: {},
     

     /*letter: {
            id: -1, 
            type: "",
            greeting: "Bonjour Monnnsieur,",
            content: "J’espère que vous allez bien.", 
            signature: "Anaïs", 
            imageUrl: "https://1lettre1sourire.org/wp-content/uploads/gravity_forms/2-9d8fc8e286f69fec044ad9ec6703f864/2020/03/0A837A40-8802-4136-B888-B1CCFA977B6D.jpeg"
            },
      */
      
      username: "", 
      password: "",

      login_hide: "hide",

      login_error: "",
      login_error_hide: "hide",

   };},

  mounted: function() {
    this.letter = this.loading_letter;

    //this.axios.defaults.baseURL = "http://localhost:3000";
    this.axios.defaults.withCredentials = true;
    this.axios.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";

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
    this.fetchNext();
  },

  methods: {
    fetchNext: function() {
       this.letter = this.loading_letter;
       this.flash_message = "Letter is loading .... ";
       this.flash_type = "info";
       this.block_button = true;
       this.axios.get('/review/fetch')
         .then((response) => {
            if (response.data.exists) {
              this.flash_message = "Load Successful";
              this.flash_type = "success";
              this.letter = response.data;
              this.block_button = false;
            }
            else
            {
              this.flash_message = "Aucune lettre à contrôler";
              this.flash_type = "success";
              this.letter.content = ""

              setTimeout(() => {this.fetchNext();}, 360000);
            }

         })
         .catch((error) => {
            console.log(error);
            this.flash_message = error;
            this.flash_type = "danger";
            this.block_button = false;

         })
       },
    
    sendApprovalResult: function(flag, result) {
          this.block_button = true;
          this.flash_message = "Approval sending ... ";
          this.flash_type = "info";
          this.axios.post('/review/approve', {id: this.letter.id, approve: result, flag: flag})
          .then((response) => {
            this.flash_message = "Approval Success - Loading Next ...";
            this.flash_type = "success";
            this.block_button = false;

         })
         .catch((error) => {
            console.log(error);
            this.flash_message = "Error while approving  : "+error;
            this.flash_type = "danger";
            this.block_button = false;

         })
          this.fetchNext();
      },
    
    approve: function() {
      this.sendApprovalResult("flag", true);
    },

    deny: function() {
      this.sendApprovalResult("flag", false); //TODO need to figure out what is flag
    },

    login: function() {
          this.block_button = true;
          this.axios.post('/login', {username: this.username, password: this.password})
          .then((response) => {
            this.password="";
            this.login_hide = "hide";
            this.block_button = false;
            this.fetchNext();
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

#letter_container {
  background-color: ivory;
}

p#signature {
 font-style: italic;
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
