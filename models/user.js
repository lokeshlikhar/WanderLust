
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const { Schema } = mongoose;


const userSchema = new Schema({ //username and password ..passportlocalmongoose add these automatically
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose.default);
const User = new mongoose.model("User", userSchema);
export default User;
