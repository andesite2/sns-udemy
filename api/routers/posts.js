const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();

// 呟き投稿
router.post("/post", isAuthenticated, async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: "呟きが空です。" });
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                content,
                authorId: req.userId,
            },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "エラーが発生しました。" });
    }
});

// ログイン
router.get("/get_latest_post", async (req, res) => {
    try {
        const latestPost = await prisma.post.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        res.status(200).json(latestPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "エラーが発生しました。" });
    }
});

// ユーザーの呟きを取得
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const posts = await prisma.post.findMany({
            where: { authorId: parseInt(userId) },
            orderBy: { createdAt: "desc" },
            include: {
                author: true,
            },
        });
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "エラーが発生しました。" });
    }
});

module.exports = router;
