import bcrypt from "bcrypt";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../../prisma/prisma";
import newListingTemplate from "../email/templates/newListing";
import { authMiddleware } from "../middleware/auth";
import { sendEmail } from "../models/email";
import { parseAddress } from "../models/listing";
import { realtorHasAlreadyBid } from "../models/listing/bid";
import { findUserFromDatabase } from "../models/user/user";
import { geocodeAddress } from "../services/google";
import { GeocodeAddress } from "../types/google";
import { generateRandomPassword } from "../utils/functions/auth";

const router = express.Router();

//LISTING PAYLOAD TYPE
interface CreateListingPayload {
  apartmentType: string;
  startOfSale: string;
  surfaceArea: number;
  address: string;
  quality: number;
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  locality: string;
  usersEstimateOfPrice: number;
  numberOfRooms: number;
}

router.post("/create-listing", async (req, res) => {
  try {
    const payload: CreateListingPayload = req.body;
    let user = await findUserFromDatabase({
      email: payload.email,
      type: "CLIENT",
    });

    const randomPass = generateRandomPassword(12);

    if (!user) {
      const hashedPw = await bcrypt.hash(randomPass, 5);

      user = await prisma.client.create({
        data: {
          email: payload.email,
          password: hashedPw,
          firstName: payload.givenName,
          surname: payload.surname,
          phone: payload.phone,
        },
      });
    }

    const listingData: any = {};

    const geocodeData: GeocodeAddress | null = await geocodeAddress({
      address: payload.address,
    });

    if (geocodeData === null) {
      res.status(400).json({ message: "bad request" });
      return;
    }

    const parsedAddress = parseAddress(payload.address);

    if (!parsedAddress) {
      res.status(400).json({ message: "bad request" });
      return;
    }

    const { lng, lat } = geocodeData.results[0].geometry.location;

    const uuid = uuidv4();
    const uuidParts = uuid.split("-")[0] + uuid.split("-")[1];

    listingData["lng"] = lng;
    listingData["lat"] = lat;
    listingData["street"] = parsedAddress.street;
    listingData["city"] = parsedAddress.city;
    listingData["country"] = "Finland";
    listingData["surfaceArea"] = payload.surfaceArea;
    listingData["addressFull"] = payload.address;
    listingData["listingType"] = payload.apartmentType;
    listingData["condition"] = payload.quality;
    listingData["uuid"] = uuidParts;
    listingData["listersEmail"] = payload.email;
    listingData["listersPhone"] = payload.phone;
    listingData["locality"] = payload.locality;
    listingData["usersEstimateOfPrice"] = payload.usersEstimateOfPrice;
    listingData["numberOfRooms"] = payload.numberOfRooms;

    await prisma.listing.create({
      data: {
        ...listingData,
        Client: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const template = newListingTemplate({
      address: payload.address,
      email: payload.email,
      password: randomPass,
    });
    sendEmail({
      html: template,
      subject: `Etsi paras kiinteistönvälittäjä asunnollesi ${payload.address.replace(
        ", Finland",
        ""
      )} - Kilpailuta välittäjät Kaupaxin avulla`,
      to: payload.email,
    });

    if (!user.phone) {
      await prisma.client.update({
        where: {
          id: user.id,
        },
        data: {
          phone: payload.phone,
        },
      });
    }

    res.status(200).json({ message: "OK", uuid: uuidParts });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/:uuid/remove-picture", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;
    const index = Number(req.query.index);
    const email = req.body.usersEmail;

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: String(uuid),
      },
    });

    if (!index && index !== 0) {
      res.status(400).json({
        message: "incorrect input params",
      });

      return;
    }

    if (!listing) {
      res.status(400).json({
        message: "listing wasnt found",
      });

      return;
    }

    if (listing.listersEmail !== email) {
      res.status(403).json({
        message: "unauthorized action",
      });

      return;
    }

    const listingPictures = listing.Picture.filter((item, i: number) => {
      if (i !== index) {
        return item;
      }
    });

    await prisma.listing.update({
      where: {
        uuid: String(uuid),
      },
      data: {
        Picture: listingPictures,
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/:uuid/add-picture", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;
    const { arrOfUrls } = req.body;

    if (!uuid) {
      res.status(400).json({
        message: "no uuid provided",
      });
      return;
    }
    const email = req.body.usersEmail;

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: String(uuid),
      },
    });

    if (listing.listersEmail !== email) {
      res.status(403).json({
        message: "unauthorized action",
      });

      return;
    }

    const listingPictures = listing.Picture;

    arrOfUrls.forEach((item) => {
      listingPictures.push(item);
    });

    await prisma.listing.update({
      where: {
        uuid: String(uuid),
      },
      data: {
        Picture: listingPictures,
        pictureAdded: true,
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(400).json({
      message: "bad request",
    });
  }
});

router.get("/:uuid/detailed", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      res.status(400).json({
        message: "No UUID provided",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: req.params.uuid,
      },
      include: {
        Bid: {
          include: {
            Realtor: true,
            Message: true,
          },
        },
      },
    });

    if (!listing) {
      res.status(404).json({
        message: "Listing not found",
      });
      return;
    }

    res.status(200).json({
      message: "OK",
      payload: listing,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.get("/:uuid", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      res.status(400).json({
        message: "No UUID provided",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: req.params.uuid,
      },
      include: {
        Bid: true,
      },
    });

    if (!listing) {
      res.status(404).json({
        message: "Listing not found",
      });
      return;
    }

    res.status(200).json({
      message: "OK",
      payload: listing,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/bid/:uuid", authMiddleware, async (req, res) => {
  try {
    const email = req.body.usersEmail;

    const user = await findUserFromDatabase({ email, type: "REALTOR" });

    if (!user) {
      res.status(401).json({ message: "No user found" });
      return;
    }

    console.log(user);

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: req.params.uuid,
      },
      include: {
        Bid: true,
      },
    });

    const { price, comission } = req.body;

    if (!listing) {
      res.status(404).json({
        message: "Listing not found",
      });
      return;
    }

    if (!price || !comission) {
      res.status(400).json({
        message: "Bad request. Missing parameter",
      });
      return;
    }

    const bidData = {
      price: Number(req.body.price),
      message: req.body.message,
      comission: Number(req.body.comission),
    };

    const bidFound = realtorHasAlreadyBid(listing as any, user);

    if (bidFound) {
      //update existing instead of creating new
      const bid = await prisma.bid.update({
        where: {
          id: bidFound.id,
        },
        data: {
          ...bidData,
          offerUpdated: new Date(),
        },
      });

      return res.status(200).json({
        message: "OK",
        payload: bid,
      });
    }

    const bid = await prisma.bid.create({
      data: {
        ...bidData,
        offerUpdated: new Date(),
        Listing: {
          connect: {
            id: listing.id,
          },
        },
        Realtor: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.status(200).json({
      message: "OK",
      payload: bid,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.get("/get/all", async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        Bid: true,
      },
    });

    res.status(200).json({
      payload: listings,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.delete("/:uuid", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;
    const { usersEmail } = req.body;

    if (!uuid) {
      return res.status(400).json({
        message: "No UUID provided",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: uuid as string,
      },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    if (!usersEmail) {
      return res.status(400).json({
        message: "No users email provided",
      });
    }

    if (listing.listersEmail !== usersEmail) {
      return res.status(401).json({
        message: "Unauthorized to remove listing",
      });
    }

    await prisma.listing.delete({
      where: {
        uuid: uuid as string,
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.put("/:uuid/saw", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({
        message: "No UUID provided",
      });
    }

    await prisma.listing.update({
      where: {
        uuid: uuid,
      },
      data: {
        congratulationsMessageSent: true,
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/bid/:uuid/restart-bidding", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;
    const listing = await prisma.listing.findUnique({
      where: {
        uuid: uuid,
      },
      include: {
        Bid: true,
      },
    });

    listing.Bid.forEach(async (item) => {
      if (item.bidAccepted) {
        await prisma.bid.update({
          where: {
            id: item.id,
          },
          data: {
            bidAccepted: false,
          },
        });
      }
    });

    await prisma.listing.update({
      where: {
        uuid: uuid,
      },
      data: {
        acceptedBidId: null,
        isActive: true,
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/:uuid/accept", authMiddleware, async (req, res) => {
  try {
    const { uuid } = req.params;
    const { bidId } = req.query;

    if (!uuid) {
      return res.status(400).json({
        message: "No UUID provided",
      });
    }

    if (!bidId) {
      return res.status(400).json({
        message: "No bid ID provided",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        uuid: uuid,
      },
      include: {
        Bid: true,
      },
    });

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    const { usersEmail } = req.body;

    if (!usersEmail) {
      return res.status(400).json({
        message: "No email provided",
      });
    }

    if (listing.listersEmail !== usersEmail) {
      return res.status(401).json({
        message: "Not authorized to accept bid",
      });
    }

    const bid = listing.Bid.find((bid) => bid.id === Number(bidId));

    if (!bid) {
      return res.status(404).json({
        message: "Bid not found",
      });
    }

    const returnedListing = await prisma.listing.update({
      where: {
        uuid: uuid,
      },
      data: {
        isActive: false,
        acceptedBidId: Number(bidId),
      },
      include: {
        Bid: true,
      },
    });

    await prisma.bid.update({
      where: {
        id: Number(bidId),
      },
      data: {
        bidAccepted: true,
      },
    });

    res.status(200).json({
      message: "OK",
      payload: returnedListing,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.get("/users/get", authMiddleware, async (req, res) => {
  try {
    const { usersEmail } = req.body;

    const usersListings = await prisma.listing.findMany({
      where: {
        listersEmail: usersEmail,
      },
      include: {
        Bid: true,
      },
    });

    res.status(200).json({
      message: "OK",
      payload: usersListings,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.delete("/bid/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "No UUID provided",
      });
      return;
    }

    await prisma.bid.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.put("/bid/:id/accept", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "No UUID provided",
      });
      return;
    }

    const bid = await prisma.bid.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Listing: true,
      },
    });

    if (bid.bidAccepted) {
      return res.status(400).json({
        message: "Bid is already accepted",
      });
    }

    if (bid.Listing.listersEmail !== req.body.usersEmail) {
      return res.status(401).json({
        message: "Not authorized to accept bid",
      });
    }

    await prisma.bid.update({
      where: {
        id: Number(id),
      },
      data: {
        bidAccepted: true,
        bidPending: false,
      },
    });

    await prisma.listing.update({
      where: {
        uuid: bid.Listing.uuid,
      },
      data: {
        isActive: false,
        acceptedBidId: Number(id),
      },
    });

    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

router.post("/bid/:id/add-message", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "No UUID provided",
      });
      return;
    }

    const bid = await prisma.bid.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Listing: true,
        Realtor: true,
      },
    });

    if (
      bid.Listing.listersEmail !== req.body.usersEmail &&
      bid.Realtor.email !== req.body.usersEmail
    ) {
      return res.status(401).json({
        message: "Not authorized to add message",
      });
    }

    await prisma.message.create({
      data: {
        ...req.body.messageData,
        Bid: {
          connect: {
            id: Number(id),
          },
        },
      },
    });

    res.status(200).json({
      message: "OK",
      payload: bid,
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      message: "bad request",
    });
  }
});

export default router;
