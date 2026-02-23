import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id"| "createdAt"| "updatedAt"| "AuthorId">, userId: string)=>{
    const result = await prisma.post.create({
        data: {
            ...data,
            AuthorId: userId
        }


    })

    return result

}

const getAllPosts = async (payload: { search?: string }) => {

    const result = await prisma.post.findMany({
        where: payload.search   // ✅ FIXED: search থাকলে তবেই where ব্যবহার করবে
            ? {
                OR: [
                    {
                        title: {
                            contains: payload.search,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: payload.search,
                            mode: "insensitive"
                        }
                    },
                    {
                        tags: {
                            has: payload.search
                        }
                    }
                ]
            }
            : {},  // ✅ FIXED: search না থাকলে সব পোস্ট রিটার্ন করবে
    })

    return result
}

export const postService = {
    createPost,
    getAllPosts
}