export interface UserProfileInfo {
  displayName: string;
  preferredName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
  avatarType?: "emoji" | "image";
  avatarEmoji?: string;
  avatarImage?: string;
}

export const emptyUserProfile: UserProfileInfo = {
  displayName: "",
  preferredName: "",
  email: "",
  age: "",
  height: "",
  weight: "",
  avatarType: "emoji",
  avatarEmoji: "✨",
  avatarImage: ""
};
