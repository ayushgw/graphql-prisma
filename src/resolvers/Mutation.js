import uuidv4 from 'uuid/v4'

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        return prisma.mutation.createUser({ data: args.data }, info)
    },
    async deleteUser(parent, args, { prisma }, info) {
        return await prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        }, info)
    },
    updateUser(parent, args, { prisma }, info) {
        return prisma.mutation.updateUser({
            where: {
                id: args.id
            },
            data: args.data
        }, info)
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some(user => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User doesn\'t exist!')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('No post found!')
        }

        const [post] = db.posts.splice(postIndex, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        }

        return post
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find(post => post.id === id)
        const originalPost = { ...post }

        if (!post) {
            throw new Error('No post found!')
        }

        if (typeof data.title === 'string') {
            post.title = data.title
        }

        if (typeof data.body === 'string') {
            post.body = data.body
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published

            if (!originalPost.published && post.published) {
                // Created Event
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
            else if (originalPost.published && !post.published) {
                // Deleted Event
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost // returning 'originalPost' instead of 'post' on DELETED to prevent exposing updates that user might not want anyone to see
                    }
                })
            }
        } else if (post.published) {
            // Updated Event
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some(user => user.id === args.data.author)
        const isPostValid = db.posts.some(post => post.id === args.data.post && post.published)

        if (!userExists || !isPostValid) {
            throw new Error('Invalid user or post!')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }

        db.comments.push(comment)

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })

        return comment
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

        if (commentIndex === -1) {
            throw new Error('Comment not found!')
        }

        // Splice returns an array containing the deleted items
        const [comment] = db.comments.splice(commentIndex, 1)

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: comment
            }
        })

        return comment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find(comment => comment.id === id)

        if (!comment) {
            throw new Error('No comment found!')
        }

        if (typeof data.text === 'string') {
            comment.text = data.text

            pubsub.publish(`comment ${comment.post}`, {
                comment: {
                    mutation: 'UPDATED',
                    data: comment
                }
            })
        }

        return comment
    }
}

export { Mutation as default }