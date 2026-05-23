export interface UserProfileInfo {
  displayName: string;
  preferredName: string;
  email: string;
  age: string;
  height: string;
}

export const emptyUserProfile: UserProfileInfo = {
  displayName: "",
  preferredName: "",
  email: "",
  age: "",
  height: ""
};
