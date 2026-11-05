import mongoose, { Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken?: string;
  };
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
  createdAt: { type: Date, default: Date.now },
})

export const UserModel = mongoose.model<IUser>("User", userSchema)

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const createUser = (user: IUser) => UserModel.create(user);

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);
export const updateUserById = (id: string, user: Partial<IUser>) =>
  UserModel.findByIdAndUpdate(id, user);
