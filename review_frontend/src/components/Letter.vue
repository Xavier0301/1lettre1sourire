<template>
  <div class="">

  </div>
</template>

<script>
export default {
  name: 'Letter',
  props: {
    letter: {
        id, 
        type: String, 
        greeting: String, 
        content: String, 
        signature: String, 
        imageUrl: String, 
    },
    
  }
  data: {

  }
  methods: {
      approve: function() {
          axios.post('/review/approve', {id: letter.id})
      },

      deny: function() {

      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
