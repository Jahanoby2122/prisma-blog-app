import { Request, Response } from 'express';
import { postService } from './post.services';
import { Post, PostStatus } from '../../../generated/prisma/client';

const createPost = async (req:Request, res:Response) => {
   
    try{

        
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"})
        }

        console.log(req.user)
        

        const result = await postService.createPost(req.body , req.user.id)
        res.status(201).json(result)

    }catch (error){
        console.error("Error creating post:", error)
    }
};


const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];


        // true or false
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined

        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined

        const result = await postService.getAllPosts({ search: searchString, tags, isFeatured, status, authorId })
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}

export const postController = {
    createPost,
    getAllPosts
}