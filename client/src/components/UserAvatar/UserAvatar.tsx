import { Avatar, AvatarProps } from "@mui/material";
import { UserData } from "../../types";
import { forwardRef } from "react";

type UserAvatarProps = AvatarProps & {
  user: UserData;
};

// Function to extract initials from a user's name
const getInitials = (name: string): string => {
  return name.split(" ").map((namePart) => namePart.charAt(0)).join("").toUpperCase();
};

// Displays either the user's avatar image or their initials if no image is available
export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ user, ...props }, ref) => {
    if (user.avatar) {
      return <Avatar alt={user.name} src={user.avatar} ref={ref} {...props} />;
    } else {
      const initials = getInitials(user.name);
      return <Avatar ref={ref} {...props}>{initials}</Avatar>;
    }
  }
);
