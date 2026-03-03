import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
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

const getAllPosts = async ({
    search,
    tags,
    isFeatured,
    status,
    authorId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}: {
    search: string | undefined,
    tags: string[] | [],
    isFeatured: boolean | undefined,
    status: PostStatus | undefined,
    authorId: string | undefined,
    page: number,
    limit: number,
    skip: number,
    sortBy: string 
    sortOrder: string 
}) => {
    const andConditions: PostWhereInput[] = []

    if (search) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    content: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    tags: {
                        has: search
                    }
                }
            ]
        })
    }

    if (tags.length > 0) {
        andConditions.push({
            tags: {
                hasEvery: tags as string[]
            }
        })
    }

    if (typeof isFeatured === 'boolean') {
        andConditions.push({
            isFeature: isFeatured
        })
    }

    if (status) {
        andConditions.push({
            status
        })
    }

    if (authorId) {
        andConditions.push({
            AuthorId: authorId
        })
    }

    const allPost = await prisma.post.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy:  {
            [sortBy]: sortOrder
        }
    });

    const total = await prisma.post.count({
        where: {
            AND: andConditions
        }
    })
    return {
        data: allPost,
        pagenation: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
          
        }
    };
}


const getPostById = async (postid: string)=>{
    try{

        return await prisma.$transaction(async (tx)=>{

            const viewCount = await tx.post.update({
            where: {
                id: postid
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })

    const postdata = await tx.post.findUnique({
        where: {
            id: postid
        },
        include: {
            comments: {
                where: {
                    ParentId: null
                },
                orderBy: {
                    createdAt: "desc"

                },
                include: {
                    replay: {
                        include: {
                            replay: true
                        }
                    }
                }
            }
        }
    })
    

    return postdata
        })


    }catch(error){
        console.error("Error fetching post by ID:", error)
    }
}


export const postService = {
    createPost,
    getAllPosts,
    getPostById
}