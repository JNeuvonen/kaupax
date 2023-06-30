import bcrypt from "bcrypt";
import express from "express";
import prisma from "../../prisma/prisma";
import { authMiddleware } from "../middleware/auth";
import { parseAddress } from "../models/listing";
import { findUserFromDatabase } from "../models/user/user";
import { geocodeAddress } from "../services/google";
import { GeocodeAddress } from "../types/google";
import { UpdateRealtorProfileRequest } from "../types/requests/update-realtor-profile";
import { buildAccessToken } from "../utils/functions/auth";
const router = express.Router();

router.get("/user-from-token", authMiddleware, async (req, res) => {
  try {
    const email = req.body.usersEmail;
    const name = req.body.usersName;
    const { type } = req.query;

    if (!type) {
      res.status(400).json({
        message: "Incorrect user type. Must be CLIENT or REALTOR",
      });
      return;
    }

    const userTypeAsString = type as string;

    if (
      userTypeAsString.toUpperCase() !== "CLIENT" &&
      userTypeAsString.toUpperCase() !== "REALTOR"
    ) {
      res.status(400).json({
        message: "Incorrect user type. Must be CLIENT or REALTOR",
      });
      return;
    }

    const user = await findUserFromDatabase({
      email,
      type: userTypeAsString.toUpperCase() as "CLIENT" | "REALTOR",
    });

    if (!user && type === "CLIENT") {
      const firstName = name.split(" ")[0];
      const surname = name.split(" ")[1];

      const newUser = await prisma.client.create({
        data: {
          firstName,
          surname,
          email,
        },
      });

      return res.status(200).json({
        message: "create user",
        payload: newUser,
      });
    }

    if (!user && type === "realtor") {
      const firstName = name.split(" ")[0];
      const surname = name.split(" ")[1];

      const newUser = await prisma.realtor.create({
        data: {
          firstName,
          surname,
          email,
        },
      });

      return res.status(200).json({
        message: "create user",
        payload: newUser,
      });
    }

    res.status(200).json({ payload: user, message: "user found" });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});
router.put("/realtor-update-profile", authMiddleware, async (req, res) => {
  try {
    const payload: UpdateRealtorProfileRequest = req.body;
    const email = req.body.usersEmail;

    const geocodeData: GeocodeAddress | null = await geocodeAddress({
      address: payload.address.description,
    });

    const parsedAddress = parseAddress(payload.address.description);

    if (!parsedAddress) {
      res.status(400).json({
        message: "Incorrect address",
      });
      return;
    }

    const { lng, lat } = geocodeData.results[0].geometry.location;

    const userData = {
      lng,
      lat,
      addressFull: payload.address.description,
      phone: payload.phone,
      licencedAgent: payload.licencedAgent,
      entrepreneur: payload.entrepreneur,
      profilePicture: payload.profilePicUrl,
      company: payload.company,
      verificationSubmitted: true,
      biography: payload.biography,
      firstName: payload.firstName,
      surname: payload.lastName,
    };

    const user = await prisma.realtor.update({
      where: {
        email,
      },
      data: {
        ...userData,
      },
    });

    res.status(200).json({ message: "OK", data: user });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/access-token", async (req, res) => {
  try {
    const { payload } = req.body;

    const token = buildAccessToken({ payload });

    res.status(200).json({
      token: token,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/create-realtor", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Incorrect request body",
      });
      return;
    }

    const userExists = await prisma.realtor.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPw = await bcrypt.hash(password, 5);

    const user = await prisma.realtor.create({
      data: {
        email: email.toLowerCase() as string,
        password: hashedPw,
      },
    });

    const token = buildAccessToken({
      payload: {
        email: user.email,
      },
    });

    res.status(200).json({
      message: "OK",
      accessToken: token,
      user: user,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Incorrect request body",
      });
      return;
    }

    const userExists = await prisma.client.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedPw = await bcrypt.hash(password, 5);

    const user = await prisma.client.create({
      data: {
        email: email.toLowerCase() as string,
        password: hashedPw,
      },
    });

    const token = buildAccessToken({
      payload: {
        email: user.email,
      },
    });

    res.status(200).json({
      message: "OK",
      accessToken: token,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.get("/realtor-profile", authMiddleware, async (req, res) => {
  try {
    const email = req.body.usersEmail;

    const user = await prisma.realtor.findUnique({
      where: {
        email,
      },
      include: {
        Bid: {
          include: {
            Listing: true,
          },
        },
      },
    });

    res.status(200).json({ message: "OK", data: user });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/login-realtor", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Incorrect request body",
      });
      return;
    }

    const user = await prisma.realtor.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        Listing: true,
        Bid: true,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "Incorrect email or password",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Incorrect email or password",
      });
      return;
    }

    const token = buildAccessToken({
      payload: {
        email: user.email,
      },
    });

    res.status(200).json({
      message: "OK",
      accessToken: token,
      user: user,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Incorrect request body",
      });
      return;
    }

    const user = await prisma.client.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      include: {
        Listing: true,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "Incorrect email or password",
      });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({
        message: "Incorrect email or password",
      });
      return;
    }

    const token = buildAccessToken({
      payload: {
        email: user.email,
      },
    });

    res.status(200).json({
      message: "OK",
      accessToken: token,
      user: user,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

export default router;
