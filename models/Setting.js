const { Schema, model, models } = require("mongoose");

const settingSchema = new Schema({
    name: {type:String, required:true, unique:true},
    value: {type:String},
},{
    timestamps: true,
});

export const Setting = models?.Setting || model('Setting',settingSchema);

