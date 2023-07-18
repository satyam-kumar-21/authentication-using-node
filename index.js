const app = require('./app');
require('dotenv').config();

const PORT = 9002;

app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
})