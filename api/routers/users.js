const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middlewares/isAuthenticated");
require("dotenv").config();

router.get("/find", isAuthenticated, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });
        if (!user) {
            return res
                .status(404)
                .json({ message: "ユーザーが見つかりません。" });
        }
        res.status(200).json({
            user: {
                id: user.id,
                userName: user.userName,
                email: user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "エラーが発生しました。" });
    }
});

router.get("/profile/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: parseInt(userId) },
            include: {
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!profile) {
            return res
                .status(404)
                .json({ message: "ユーザーが見つかりません。" });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "エラーが発生しました。" });
    }
});

module.exports = router;
