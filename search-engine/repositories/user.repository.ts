import { User } from '../models/user.model';
const MongooseRepository = require('mongoose-repository');

export class UserRepository extends MongooseRepository {
    constructor(mongoose, modelName) {
        super(mongoose, modelName);
        mongoose.connect('mongodb://localhost:27017/search-engine');
      }

  public insertOrUpdateUser(profile: any) {

    const today = new Date();

    const dateTime = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    User.find({name : profile.displayName}, function(err, docs) {
        if (docs.length == 0){
            const newUser = new User({
                userId: profile.id,
                name: profile.displayName,
                dateTime,
            });
            newUser.save(function(err){
                if (err) { console.log(err); return; }
            });
        } else {
            User.updateOne({userId: profile.id}, {dateTime: dateTime}, function(err, result) {
                if (err) { console.log(err); return; }
            });
        }
    });
}
}
