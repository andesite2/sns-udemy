const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateIdenticon = require("../utils/generateIdenticon");
require("dotenv").config();

// 新規登録
router.post("/register", async (req, res) => {
    const { userName, email, password } = req.body;

    const defaultProfileImage = generateIdenticon(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            userName,
            email,
            password: hashedPassword,
            profile: {
                create: {
                    bio: "aaa",
                    profileImageUrl: defaultProfileImage,
                },
            },
        },
    });
    return res.json({ user });
});

// ログイン
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return res
            .status(401)
            .json({ message: "メールアドレスが間違っています。" });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);
    n;

    if (!isPasswordVaild) {
        return res
            .status(401)
            .json({ message: "パスワードが間違っています。" });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        expiresIn: "1d",
    });

    return res.json({ token });
});

module.exports = router;
