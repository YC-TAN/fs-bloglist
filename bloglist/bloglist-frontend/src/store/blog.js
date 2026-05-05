// NOT in use, written for practice
// tanstack Query is preferred as this store involves async api calls

import { create } from "zustand";
import blogService from '../services/blogs'
import useNotificationStore from "./notification";

const useBlogStore = create((set, get) => ({
    blogs: [],
    actions: {
        initialize: async () => {
            try {
                const blogs = await blogService.getAll();
                set({ blogs});
            } catch (error) {
                const msg = error.response?.data?.error || "Failed to load blogs";
                useNotificationStore.getState().actions.setNotification(msg, 'error');
            }  
        },
        add: async (newBlog) => {
            try {
                const added = await blogService.create(newBlog)
                set(state => ({blogs: state.blogs.concat(added)}))
                useNotificationStore.getState().actions.setNotification(`new blog '${added.title}' added`, 'success')
            } catch (error) {
                const msg = error.response?.data?.error || "Failed to add blog";
                useNotificationStore.getState().actions.setNotification(msg, 'error');
            }           
        },
        like: async (id) => {
            try {
                const blog = get().blogs.find(b => b.id === id)
                const liked = await blogService.update(
                    id, 
                    {...blog, likes: blog.likes + 1}
                )
                set(state => ({blogs: state.blogs.map(b => b.id === id ? liked : b)}))
                useNotificationStore.getState().actions.setNotification(`liked '${blog.title}'`, 'success')
            } catch (error) {
                const msg = error.response?.data?.error || "Failed to like blog";
                useNotificationStore.getState().actions.setNotification(msg, 'error');
            }           
        },
        remove: async (id) => {
            try {
        const blogToRemove = get().blogs.find(b => b.id === id);
        await blogService.remove(id); // Delete from server
        set(state => ({
            blogs: state.blogs.filter(b => b.id !== id)
        }));
        useNotificationStore.getState().actions.setNotification(
            `'${blogToRemove.title}' deleted`, 'success'
        );
    } catch (error) {
        const msg = error.response?.data?.error || "Failed to delete blog";
        useNotificationStore.getState().actions.setNotification(msg, 'error');
    }         
        }
    }
}))

export default useBlogStore;

export const useBlogs = () => useBlogStore(state => state.blogs)
export const useBlogActions = () => useBlogStore(state => state.actions)