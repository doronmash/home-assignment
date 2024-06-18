import { AppBar, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { UserData } from "../../types";
import { UserAvatar } from "../UserAvatar";
import { MouseEvent } from "react";
import "./styles.css";

type HeaderProps = {
  openPostEditor: () => void;

  changeUser: (e?: MouseEvent) => void;
  user: UserData;
};


export const Header: React.FC<HeaderProps> = ({ openPostEditor, user, changeUser }) => {
 
  return (
    <AppBar position="static">
      <Toolbar disableGutters className="app-toolbar">
        <Tooltip title="Switch User">
          <IconButton onClick={changeUser}>
            <UserAvatar user={user} className="user-avatar" />
          </IconButton>
        </Tooltip>
        <div>
          <Typography className="app-title main" variant="h6">
            BriefCam Social
          </Typography>
          <Typography className="app-title" variant="subtitle1" lineHeight={1}>
            {user.name}
          </Typography>
        </div>
        <Tooltip title="Add Post">
          <IconButton onClick={openPostEditor}>
            <AddOutlined htmlColor="white" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
