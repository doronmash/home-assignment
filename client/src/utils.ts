import { UserData, PostData } from './types';
import { getUsers, getPosts, addLikeToPost, deletePost, getLikedUsers } from './apiUtils';

// Function to fetch users from the server
export const fetchUsers = async (): Promise<UserData[] | null> => {
  return await getUsers();
};

// Function to fetch posts from the server
export const fetchPosts = async (): Promise<PostData[] | null> => {
  return await getPosts();
};

// Function to add a like to a post
export const likePost = async (postId: number, userId: number) => {
  return await addLikeToPost(postId, userId);
};

// Function to fetch liked users
export const fetchLikedUsers = async (postId: number): Promise<string[]> => {
  return await getLikedUsers(postId);
};

// Function to delete a post
export const removePost = async (postId: number) => {
  return await deletePost(postId);
};

// Function to get a random user not in usersSelected
export const getRandomUser = (users: UserData[], usersSelected: number[]): UserData => {
  let match = false;
  let usersNumber = users.length;

  while (!match) {
    const obj = users[Math.floor(Math.random() * usersNumber)];
    const index = usersSelected.findIndex((id) => id === obj.id);

    if (index === -1) {
      return obj;
    }

    if (usersSelected.length === usersNumber) {
      usersSelected.splice(0, usersNumber - 1);
    }
  }
};
