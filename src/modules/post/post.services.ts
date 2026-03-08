import { promise } from "better-auth";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
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
                 await tx.post.update({
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
                    ParentId: null,
                    status: CommentStatus.APPROVED
                },
                orderBy: {
                    createdAt: "desc"

                },
                include: {
                    replay: {
                        where: {
                            status: CommentStatus.APPROVED

                        },
                        orderBy: {
                            createdAt: "asc"
                        },
                        include: {
                            replay:{
                                where: {
                                    status: CommentStatus.APPROVED
                                }
                            }
                        }
                    }
                }
            },
            _count: {
                select: {
                    comments: true
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


const getMyPosts = async (authorId: string)=>{

    const result = await prisma.post.findMany({
        where: {
            AuthorId: authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            _count: {
               select: {
                    comments: true
               }
            }
        }
    })

    return result

}


const updatePost = async (postId: string, data: Partial<Post>, AuthorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            AuthorId: true
        }
    })

    if (!isAdmin && (postData.AuthorId !== AuthorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    if (!isAdmin) {
        delete data.isFeature
    }

    const result = await prisma.post.update({
        where: {
            id: postData.id
        },
        data
    })

    return result;

}


const deletePost = async (postId: string, AuthorId: string, isAdmin: boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        },
        select: {
            id: true,
            AuthorId: true
        }
    })

    if (!isAdmin && (postData.AuthorId !== AuthorId)) {
        throw new Error("You are not the owner/creator of the post!")
    }

    return await prisma.post.delete({
        where: {
            id: postId
        }
    })

}


const getStats = async () => {
    return await prisma.$transaction(async (tx) => {
        const [totalPost, publishPost, draftPost, archivePost, totalComment, approveComment, rejectCommnet, totalUser, adminCount, userCount, totalViews] =
            await Promise.all([
                tx.post.count(),
                tx.post.count({ where: { status: PostStatus.PUBLISH } }),
                tx.post.count({ where: { status: PostStatus.DRAFT } }),
                tx.post.count({ where: { status: PostStatus.ARCHIVE } }),
                tx.comment.count(),
                tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
                tx.comment.count({where:{status: CommentStatus.REJECT}}),
                tx.user.count(),
                tx.user.count({where: {role: "ADMIN"}}),
                tx.user.count({where: {role: "USER"}}),
                tx.post.aggregate({_sum: {views: true}})
            ]);





        return {
            totalPost,
            publishPost,
            draftPost,
            archivePost,
            totalComment,
            approveComment,
            rejectCommnet,
            totalUser,
            adminCount,
            userCount,
            totalViews:totalViews._sum.views
        };
    });
};




export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats

}