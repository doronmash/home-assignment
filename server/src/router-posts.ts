import { NextFunction, Request, Response, Router } from "express";
import fsPromises from "fs/promises";
import { IPosts } from "./models";

const postsRouter = Router();

// GET all posts
postsRouter.get('/posts', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const content = await fsPromises.readFile('./db/posts.json', 'utf-8');

        const posts = JSON.parse(content);

        if (content) {
            res.json(posts);
        } else {
            res.json("the file not found");
        }
    } catch (error) {
        res.status(500)
    }
})

// POST add new post
postsRouter.post('/posts/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = req.body;

        const content = await fsPromises.readFile('./db/posts.json', 'utf-8');

        const posts = JSON.parse(content);

        post.id = posts[posts.length - 1].id + 1;

        posts.push(post);

        const contentPosts = JSON.stringify(posts, null, 4);

        await fsPromises.writeFile('./db/posts.json', contentPosts)

        res.status(201).json(post);

    } catch (error) {
        res.status(500)
    }
})

// Edit post by post id
postsRouter.patch('/posts/edit/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toUpdate = req.body;

        const id = req.params.id;

        const content = await fsPromises.readFile('./db/posts.json', 'utf-8');

        const posts = JSON.parse(content);

        const index = posts.findIndex((post: IPosts) => post.id === parseInt(id));

        posts[index].imageUrl = toUpdate.imageUrl;
        
        const date = new Date;

        posts[index].content = toUpdate.content;

        posts[index].date = date.toISOString();

        const updatedPost = posts[index];

        const contentPosts = JSON.stringify(posts, null, 4);

        await fsPromises.writeFile('./db/posts.json', contentPosts)

        res.json(updatedPost);
    } catch (error) {
        res.status(500)
    }
})

// Handle post likes
postsRouter.post('/posts/like', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { postId, userId } = req.body;

        const content = await fsPromises.readFile('./db/posts.json', 'utf-8');
        const posts = JSON.parse(content) as IPosts[];

        const post = posts.find((post: IPosts) => post.id === parseInt(postId, 10));
        if (!post) {
            return res.status(404).json("Error: Post not found.");
        }

        // Ensure likedBy array is initialized
        post.likedBy = post.likedBy || [];

        const userLikedIndex = post.likedBy.indexOf(userId);
        
        // Check if user already liked the post
        if (userLikedIndex === -1) {
            post.likedBy.push(userId);

            post.likes = (post.likes || 0) + 1;
        } else { 
            post.likedBy.splice(userLikedIndex, 1);

            post.likes = (post.likes || 1) - 1;
        }

        const contentPosts = JSON.stringify(posts, null, 4);

        await fsPromises.writeFile('./db/posts.json', contentPosts);

        res.status(201).json("Success: Like status updated.");
    } catch (error) {
        console.error("Error: ", error);

        res.status(500).json("Error: Internal server error.");
    }
});

// GET users who liked a specific post
postsRouter.get('/posts/likedBy/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.id;

        const content = await fsPromises.readFile('./db/posts.json', 'utf-8');

        const posts: IPosts[] = JSON.parse(content) as IPosts[];

        const post = posts.find((post: IPosts) => post.id === parseInt(postId));

        if (!post) {
            res.status(404).json({ error: 'Post not found' });

            return;
        }

        res.status(200).json({ likedBy: post.likedBy });
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE a post
postsRouter.delete('/posts/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const content = await fsPromises.readFile('./db/posts.json', 'utf-8');

        const posts: IPosts[] = JSON.parse(content);

        const index = posts.findIndex((post) => post.id === parseInt(id))

        if (index === -1) {
            res.json("id not found");
            return;
        }

        posts.splice(index, 1);

        const contentPosts = JSON.stringify(posts, null, 4);

        await fsPromises.writeFile('./db/posts.json', contentPosts)

        res.json("success to deleted post " + id);
    } catch (error) {
        res.status(500)
    }
})

export default postsRouter;
