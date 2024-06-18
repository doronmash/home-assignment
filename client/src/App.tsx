import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { Header, PostEditor } from './components';
import { PostData, UserData } from './types';
import { Button, Dialog, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addLikeToPost, deletePost, getLikedUsers, getPosts, getUsers } from './apiUtils';
import './App.css';
import PostCard from './components/PostCard/PostCard';
import DeleteSnackbar from './components/DeleteSnackbar/DeleteSnackbar';
import PostEditorDialog from './components/PostEditorDialog/PostEditorDialog';

function App() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [posts, setPosts] = useState<PostData[] | null>(null);
  const [newPost, setNewPost] = useState(true);
  const [isPostEditorOpen, setIsPostEditorOpen] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [idToDelete, setIdToDelete] = useState(0);
  const [id, setId] = useState(0);
  const [user, setUser] = useState<UserData>({ id: 0, name: '' });
  const [tooltipContent, setTooltipContent] = useState<string>('');

  useEffect(() => {
    loadingUsers();
    loadingPosts();
  }, []);

  const arrayId = useRef<number[]>([]);

  // Function to change the current user to a random user.
  function changeUser(e?: MouseEvent) {
    e?.preventDefault();
    let match = false;

    while (!match) {
      const obj = users[Math.floor(Math.random() * 10)];

      const index = arrayId.current.findIndex((id) => id === obj.id);

      if (index === -1) {
        setUser(obj);

        arrayId.current.push(obj.id);

        match = true;
      }

      if (arrayId.current.length === 10) {
        arrayId.current.splice(0, 9);
      }
    }
  }

  const openEditor = () => setIsPostEditorOpen(true);

  const closeEditor = () => { setNewPost(true); setIsPostEditorOpen(false) };

  const loadingUsers = async () => {
    const response = await getUsers();

    if (!response) {
      return false;
    };

    setUsers(response || []);
    const obj = response[Math.floor(Math.random() * 10)];
    setUser(obj);
    arrayId.current.push(obj.id)
  }

  // Function to load posts from the server
  const loadingPosts = async () => {
    const response = await getPosts();

    if (!response) {
      return false;
    };

    response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setPosts(response);
  }

  // Function to handle adding a like to a post
  const handleAddLike = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, postId: number) => {
    e.preventDefault();

    try {
      await addLikeToPost(postId, user.id);

      await loadingPosts();
    } catch (error) {
      console.error('Error adding like:', error);
    }
  }

  // Function to handle hover over the like button, showing tooltip with users who liked the post
  const handleLikeButtonHover = async (postId: number) => {
    const response = await getLikedUsers(postId);

    if (!response) {
      return false;
    };

    setTooltipContent(response.length > 0 ? `Liked by: ${response.join(', ')}` : '');
  }

  // Function to delete a post
  const confirmDeletePost = async () => {
    try {
      await deletePost(idToDelete);

      await loadingPosts();

      setOpenPopUp(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  // Function to return the current user based on their ID
  const returnCurrentUser = (id: number): UserData => {
    const user = users.find(user => user.id === id);

    return user ? user : { id: 0, name: '' };
  }

  const props = {
    closeEditor: closeEditor,
    user: user,
    loadingPosts: loadingPosts,
    newPost: newPost,
    posts,
    id,
  }

  return (
    <>
      <Header user={user} changeUser={changeUser} openPostEditor={openEditor} />
      <div className='posts-container'>
        <div className='posts-wrapper'>
          {posts && posts.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              user={user}
              returnCurrentUser={returnCurrentUser}
              handleAddLike={handleAddLike}
              handleLikeButtonHover={handleLikeButtonHover}
              setId={setId}
              setNewPost={setNewPost}
              openEditor={openEditor}
              setIdToDelete={setIdToDelete}
              setOpenPopUp={setOpenPopUp}
              tooltipContent={tooltipContent}
            />
          ))}
        </div>
      </div>
      <PostEditorDialog
        isOpen={isPostEditorOpen}
        onClose={closeEditor}
        props={props}
      />
      <DeleteSnackbar
        isOpen={openPopUp}
        onClose={() => setOpenPopUp(false)}
        message='Are you sure you want to delete?'
        action={<React.Fragment>
          <Button color='secondary' size='small' onClick={(e) => {
            e.preventDefault();
            confirmDeletePost();
          }}>
            OK
          </Button>
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={() => { setOpenPopUp(false) }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </React.Fragment>}
      />
    </>
  );
}

export default App;
