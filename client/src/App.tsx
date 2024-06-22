import React, { MouseEvent, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { fetchUsers, fetchPosts, likePost, fetchLikedUsers, removePost, getRandomUser } from './utils';
import { Header } from './components';
import { PostData, UserData } from './types';
import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PostCard from './components/PostCard/PostCard';
import DeleteSnackbar from './components/DeleteSnackbar/DeleteSnackbar';
import PostEditorDialog from './components/PostEditorDialog/PostEditorDialog';
import './App.css';

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

// Mutable object that will persist across renders without causing re-renders when it changes
  const usersSelected = useRef<number[]>([]);

// Load users and posts on initial component mount
  useEffect(() => {
    loadingUsers();
    loadingPosts();
  }, []);

// Callback to change the current user
  const changeUser = useCallback((e?: MouseEvent) => {
    e?.preventDefault();

    const newUser = getRandomUser(users, usersSelected.current);

    setUser(newUser);

    usersSelected.current.push(newUser.id);
  }, [users]);

// Opens the post editor dialog
  const openEditor = () => setIsPostEditorOpen(true);
  
// Closes the post editor dialog and resets state for a new post
  const closeEditor = () => { setNewPost(true); setIsPostEditorOpen(false) };

// Function to load users from API
  const loadingUsers = useCallback(async () => {
    const response = await fetchUsers();

    if (!response) {
      return false;
    }

    setUsers(response);

    const initialUser = getRandomUser(response, usersSelected.current);

    setUser(initialUser);

    usersSelected.current.push(initialUser.id);
  }, []);

// Function to load posts from API
  const loadingPosts = useCallback(async () => {
    const allPosts = await fetchPosts();

    if (!allPosts) {
      return false;
    }

    setPosts(allPosts);
  }, []);

// Function to handle adding a like to a post
  const handleAddLike = useCallback(async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, postId: number) => {
    e.preventDefault();

    try {
      await likePost(postId, user.id);

      await loadingPosts();
    } catch (error) {
      console.error('Error adding like:', error);
    }
  }, [user.id, loadingPosts]);

// Function to handle hover over the like button, showing tooltip with users who liked the post
  const handleLikeButtonHover = useCallback(async (postId: number) => {
    const response = await fetchLikedUsers(postId);

    if (!response) {
      return false;
    }

    setTooltipContent(response.length > 0 ? `Liked by: ${response.join(', ')}` : '');
  }, []);

// Function to confirm deletion of a post
  const confirmDeletePost = useCallback(async () => {
    try {
      await removePost(idToDelete);

      await loadingPosts();

      setOpenPopUp(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }, [idToDelete, loadingPosts]);

// Function to return the current user based on their ID
  const returnCurrentUser = useCallback((id: number): UserData => {
    const user = users.find(user => user.id === id);

    return user ? user : { id: 0, name: '' };
  }, [users]);

// Memoized value for sorted posts
  const sortedPosts = useMemo(() => {
    if (!posts) return null;

    return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [posts]);

// Memoized props object for PostEditorDialog
  const memoizedProps = useMemo(() => ({
    closeEditor,
    user,
    loadingPosts,
    newPost,
    posts,
    id,
  }), [closeEditor, user, loadingPosts, newPost, posts, id]);

  return (
    <>
      <Header user={user} changeUser={changeUser} openPostEditor={openEditor} />
      <div className='posts-container'>
        <div className='posts-wrapper'>
          {sortedPosts && sortedPosts.map((post, index) => (
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
        props={memoizedProps}
      />
      <DeleteSnackbar
        isOpen={openPopUp}
        onClose={() => setOpenPopUp(false)}
        message='Are you sure you want to delete?'
        action={
          <React.Fragment>
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
          </React.Fragment>
        }
      />
    </>
  );
}

export default App;
