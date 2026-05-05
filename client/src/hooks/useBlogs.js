import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationActions } from '../store/notification';
import blogService from '../services/blogs'

export const useBlogs = (id = null) => {
    const queryClient = useQueryClient();
    const { setNotification } = useNotificationActions();

    const result = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll,
        refetchOnWindowFocus: true,
        retry: 1
    })

    const blog = id && result.data 
        ? result.data.find(b => b.id === id)
        : null

    const newBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: (newBlog) => {
            const blogs = queryClient.getQueryData(['blogs']) || []
            queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
            setNotification(`new blog '${newBlog.title}' added`, 'success')
        },
        onError: (err) => {
            setNotification(err.message, 'error')
        }
    })

    const updateBlogMutation = useMutation({
        mutationFn: blogService.update,
        onSuccess: (updated) => {
            queryClient.invalidateQueries({queryKey: ['blogs']})
            setNotification(`liked '${updated.title}'`, 'success')
        },
        onError: (err) => {
            setNotification(err.message, 'error')
        }
    })

    const removeBlogMutation = useMutation({
        mutationFn: (blog) => blogService.remove(blog.id),
        onSuccess: (data, blog) => {
            queryClient.invalidateQueries({queryKey: ['blogs']})
            setNotification(`'${blog.title}' deleted`, 'success')
        },
        onError: (err) => {
            setNotification(err.message, 'error')
        }
    })

    const commentBlogMutation = useMutation({
        mutationFn: blogService.comment,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['blogs']})
            setNotification(`'comment added`, 'success')
        },
        onError: (err) => {
            setNotification(err.message, 'error')
        }
    })

    return {
        blog,
        blogs: result.data,
        isPending: result.isPending,
        addBlog: (newBlog) => newBlogMutation.mutate({...newBlog, likes: 0}),
        like: (blog) => updateBlogMutation.mutate({
            ...blog,
            likes: blog.likes + 1
        }),
        remove: (blog) => removeBlogMutation.mutate(blog),
        addComment: (id, comment) => commentBlogMutation.mutate({id, comment})
    }
}