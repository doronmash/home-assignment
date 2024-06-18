import React from 'react';
import { IconButton, Tooltip, Badge } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { UserAvatar } from './../UserAvatar';
import { PostData, UserData } from '../../types';

interface PostCardProps {
  post: PostData;
  user: UserData;
  returnCurrentUser: (userId: number) => UserData | undefined;
  handleAddLike: (e: React.MouseEvent, postId: number) => void;
  handleLikeButtonHover: (postId: number) => void;
  setId: (id: number) => void;
  setNewPost: (isNew: boolean) => void;
  openEditor: () => void;
  setIdToDelete: (id: number) => void;
  setOpenPopUp: (open: boolean) => void;
  tooltipContent: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  user,
  returnCurrentUser,
  handleAddLike,
  handleLikeButtonHover,
  setId,
  setNewPost,
  openEditor,
  setIdToDelete,
  setOpenPopUp,
  tooltipContent
}) => {
  return (
    <div className='card boxShadow'>
      <div className='header'>
        <UserAvatar user={returnCurrentUser(post.userId)} />
        <div className='details'>
          <p>{returnCurrentUser(post.userId)?.name}</p>
          <p>{new Date(post.date).toLocaleString()}</p>
        </div>
      </div>
      <div className='main'>
        {post.imageUrl ? (
          <>
            <div><img src={post.imageUrl} title='img' width={'100%'} height={'100%'} /></div>
            <span id='spanIfImageExist'>
              {post.content}
            </span>
          </>
        ) : (
          <span>
            {post.content}
          </span>
        )}
      </div>
      <div className='footer'>
        <div>
          <IconButton disabled={post.userId !== user.id} onClick={() => {
            setId(post.id); setNewPost(false); openEditor()
          }}>
            <EditIcon />
          </IconButton>
          <IconButton disabled={post.userId !== user.id} onClick={(e) => {
            e.preventDefault();
            setIdToDelete(post.id);
            setOpenPopUp(true);
          }}>
            <DeleteIcon />
          </IconButton>
        </div>
        <Tooltip title={tooltipContent} arrow>
          <IconButton
            onClick={(e) => handleAddLike(e, post.id)}
            onMouseEnter={() => handleLikeButtonHover(post.id)}
          >
            <Badge badgeContent={post?.likes || 0} color='primary'>
              <ThumbUpAltIcon color='primary' />
            </Badge>
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default PostCard;
