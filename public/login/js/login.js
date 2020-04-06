 function funcLogin() {
   var url = 'http://localhost:3000/login';


//    fetch(url)
//     .then(function(response) {
//       if (response.status !== 401) {
//         console.log("in if");
//         throw new Error("Not 200 response")
//     } else {
//       console.log("in else");
//       console.log(response);
//     }
// }).catch(function(err) {
//     console.log(err);
//     console.log("in catch");
// });

    // fetch(url)
    //   .then(function(resp){
    //     if(resp.status !== 401){
    //       return funcLogin();
    //     }else{
    //       console.log(xd);
    //     }
    //   });


    let data = {
      password: document.getElementById("password").value,
      username: document.getElementById("username").value
    }

    let fetchData = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers()
    }

    fetch(url, fetchData)
      .then(function(response){
        console.log(fetchData);
        console.log(response);
        if(response.status !== 200){
          console.log("error not 200")
        } else {
          console.log("welcome")
        }
      });


}
