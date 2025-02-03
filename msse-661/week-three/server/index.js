// following Professor Morgan's video
const express = require('express');
const app = express();



// middleware -- defines how things should happen before output executes
app.use(express.static('public'));



app.listen(3000, function(){
    console.log("Server started at http://localhost:%s", 3000);
});




// console message
console.log("Hello Professor Jelena!");