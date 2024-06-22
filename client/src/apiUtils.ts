import { UserData, PostData } from "./types";

const baseURL = "http://localhost:3000/api";

// Generic function that performs api call
export const makeApiCall = async <T>(url: string, method: string, body?: any): Promise<T | undefined> => {
    try {
        const config: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${baseURL}/${url}`, config);

        if (response.ok) {
            const result = await response.json() as T;

            return result;
        } else {
            throw new Error(`Failed to ${method} ${url}`);
        }
    } catch (error) {
        console.error(`Error in ${method} request to ${url}:`, error);

        return undefined;
    }
};

// API call return all users
export const addLikeToPost = async (postId: number, userId: number): Promise<void> => {
    const data = { postId, userId };

    await makeApiCall<void>(`posts/like`, "POST", data);
};

// API call delete post by post ID
export const deletePost = async (postId: number): Promise<boolean> => {
    const response = await makeApiCall<boolean>(`posts/${postId}`, "DELETE");
    
    return !!response;
};

// API calll return id of all users that like the post and convert them to user names.
export const getLikedUsers = async (postId: number): Promise<string[]> => {
    try {
        const response = await makeApiCall<{ likedBy: number[] }>(`posts/likedBy/${postId}`, 'GET');

        if (response && response.likedBy) {
            const userIds: number[] = response.likedBy;

            const usersData: UserData[] = await Promise.all(userIds.map(userId => getUser(userId)));

            const userNames: string[] = usersData.map(user => user.name);

            return userNames;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching liked users:', error);

        return [];
    }
};

// API call return all users
export const getUsers = async (): Promise<UserData[]> => {
    const response = await makeApiCall<UserData[]>(`users`, "GET");

    return response || [];
};

// API call return user by user ID
export const getUser = async (userId: number): Promise<UserData | undefined> => {
    const response = await makeApiCall<UserData>(`users/${userId}`, "GET");

    return response;
};

// API call return all posts
export const getPosts = async (): Promise<PostData[]> => {
    const response = await makeApiCall<PostData[]>(`posts`, "GET");

    return response || [];
};
