import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import { IAccount } from "@/types/auth";

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    picture: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admins"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isVerified: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    emailVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: process.env.NEXT_PUBLIC_CLUSTER_ACCOUNTS,
  },
);

accountSchema.pre<IAccount>("save", async function (this: IAccount) {
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    // Ensure password is defined before hashing
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (error) {
    throw error;
  }
});

accountSchema.methods.comparePassword = async function (
  this: IAccount,
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const modelName = process.env.NEXT_PUBLIC_CLUSTER_ACCOUNTS as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AccountModel: any =
  mongoose.models[modelName] ||
  mongoose.model<IAccount>(modelName, accountSchema);

export const Account = AccountModel as mongoose.Model<IAccount>;
