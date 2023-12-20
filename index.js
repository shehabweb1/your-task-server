const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000;

app.use(cors())
 




app.get('/', function(req, res){
    res.send("Server is running")
});
 
app.listen(port, () => {
  console.log(`web server listening on port ${port}`)
})