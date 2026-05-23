export interface UserProfileInfo {
  displayName: string;
  preferredName: string;
  email: string;
  age: string;
  height: string;
  weight: string;
}

export const emptyUserProfile: UserProfileInfo = {
  displayName: "",
  preferredName: "",
  email: "",
  age: "",
  height: "",
  weight: ""
};
