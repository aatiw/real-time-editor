import {Document, Schema, model} from 'mongoose'

export interface UserI extends Document{
    UserId: string
    RoomId: string
    Username: string
}

const userSchema = new Schema<UserI>(
    {
        UserId: {type: String, required: true},
        RoomId: {type: String, required: true, trim: true},
        Username: {type: String, required: true, trim: true}
    },
    {
        timestamps: true
    }
)

export const User = model<UserI>("User", userSchema);