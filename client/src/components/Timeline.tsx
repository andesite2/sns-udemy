import React, { useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { PostType } from "@/types";
import Post from "./Post";

const Timeline = () => {
    const [postText, setPostText] = React.useState<string>("");
    const [latestPosts, setLatestPosts] = React.useState<PostType[]>([]);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const newPost = await apiClient.post("/posts/post", {
                content: postText,
            });
            setLatestPosts((prevPost) => [newPost.data, ...prevPost]);
            setPostText("");
        } catch (err) {
            alert("ログインしてください");
        }
    };

    useEffect(() => {
        const fetchLatestPosts = async () => {
            try {
                const res = await apiClient.get("/posts/get_latest_post");
                setLatestPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchLatestPosts();
    }, []);

    return (
        <div>
            <div className="min-h-screen bg-gray-100">
                <main className="container mx-auto py-4">
                    <div className="bg-white shadow-md rounded p-4 mb-4">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="What's on your mind?"
                                onChange={(e) => setPostText(e.target.value)}
                                value={postText}
                            ></textarea>
                            <button
                                type="submit"
                                className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
                            >
                                投稿
                            </button>
                        </form>
                    </div>
                    {latestPosts.map((post) => (
                        <Post key={post.id} post={post} />
                    ))}
                </main>
            </div>
            ;
        </div>
    );
};

export default Timeline;
