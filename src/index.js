// require('dotenv').config({path: '/.env'});
import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config({
    path: './.env'
    //we can remove this and use fisrt line of code
    //node modules dev: added experimeantal modules in package.json
})

connectDB().then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on ${process.env.PORT}`);
    });
}).catch((error) => {
    console.error("MONGO db Connection failes !!!", error);
    process.exit(1);
});




/*function connectDB() {
  // Connect to database
  this is also correct ,use arrow function to fast load
}
connectDB();*/

/*



const app=express();

( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,)
        app.on("error", (error) => {
            console.error(`Express error: ${error}`);
            throw error;
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`);
        });
    }catch(error){
        console.error(error);
        throw error
    }
});


*/

