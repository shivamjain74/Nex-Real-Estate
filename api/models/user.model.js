import mongoose from "mongoose";

const userSchema = new mongoose.Schema({  // user Schema
     
username:{
          type:String,
          required:true,
          unique:true,       
        },
email:{
            type:String,
            required:true,
            unique:true,       
          },
password:{
            type:String,
            required:true,      
          },
avatar:{
    type:String,
    default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
},

},
{
    timestamps:true // to store the time 
}

);

const User = mongoose.model('User',userSchema); // .model and .Schema are two methods inside mongodb
// same name 'User' is created in mongodb with Users named

export default User; // to able to use this model anywhere else in the application