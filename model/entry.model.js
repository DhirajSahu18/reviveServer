import mongoose, { Schema } from "mongoose";

const EntrySchema = new mongoose.Schema({
    participant : {
        type : Schema.ObjectId,
        ref : 'Participant'
    },
    admin : {
        type : Schema.ObjectId,
        ref : 'User'
    },
} , {timestamps : true})

const virtual = EntrySchema.virtual('id')
virtual.get(function (){
    return this._id;
})
EntrySchema.set('toJSON',{
    virtuals : true,
    versionKey : false,
    transform : function(doc, ret){ delete ret._id}
    
})

const Entry = mongoose.model('Entry' , EntrySchema)
export default Entry