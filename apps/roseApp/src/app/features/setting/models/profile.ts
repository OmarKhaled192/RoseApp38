import { User } from "@org/ui";

export interface ProfileModel {
    firstName: string;
    lastName: string;
    photo: string;
    phone: string;
}

export interface ProfilePesponse {
  user: User
}