import ContentSection from "@/components/ContentSection";
import StepperWrapper from "@/components/MuiWrappers/Stepper";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { postReq } from "@/services/util";
import styles from "@/styles/listing.module.css";
import {
  ApartmentsIcon,
  DateIcon,
  DetailsIcon,
  ProfileIcon,
} from "@/utils/icons";
import { Box, Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { useRouter } from "next/router";
import { useState } from "react";
import ApartmentType, { LastStepItems } from "./FormCards/apartmentType";
import ContactCard from "./FormCards/contact";
import ListingDetails from "./FormCards/listingDetails";
import StartOfSale from "./FormCards/startOfSale";

export default function CreateListing({
  setExitAnimation,
}: {
  setExitAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //GLOBAL STATE
  const auth = useAuth();
  const router = useRouter();

  //FORM HELPERS
  const [listingSteps] = useState([
    "Asunnon tyyppi",
    "Myynnin aloitus",
    "Tiedot",
    "Yhteystiedot",
  ]);

  //UTILS
  const [activeStep, setActiveStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState(0);

  //FORM STATE
  const [apartmentType, setApartmentType] = useState<string>("");
  const [startOfSale, setStartOfSale] = useState<string>("");
  const [surfaceArea, setSurfaceArea] = useState<number>(0);
  const [address, setAddress] = useState<string>("");
  const [quality, setQuality] = useState<string>("");
  const [givenName, setGivenName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [usersEstimateOfValue, setUsersEstimateOfValue] = useState<number>(0);
  const [numberOfRooms, setNumberOfRooms] = useState<number | null>(null);

  const [stepIcons] = useState({
    1: <ApartmentsIcon width={26} fill={"white"} />,
    2: <DateIcon width={26} fill={"white"} />,
    3: <DetailsIcon width={26} fill={"white"} />,
    4: <ProfileIcon width={26} fill={"white"} />,
  });

  const incrementStep = async ({
    lastStepItems = null,
  }: {
    lastStepItems: LastStepItems | null;
  }) => {
    setExitAnimation(true);
    if (activeStep === 3) {
      const { givenName, surname, email, phone } =
        lastStepItems as LastStepItems;

      const requestBody = {
        apartmentType: apartmentType,
        startOfSale: startOfSale,
        surfaceArea: surfaceArea,
        address: address,
        quality: quality,
        givenName: givenName,
        surname: surname,
        email: email,
        phone: phone,
        locality: router.query.paikkakunta,
        usersEstimateOfPrice: usersEstimateOfValue,
        numberOfRooms: numberOfRooms,
      };

      setStepsCompleted(0);
      setActiveStep(activeStep + 1);
      setApartmentType("");
      setStartOfSale("");
      setSurfaceArea(0);
      setAddress("");
      setQuality("");
      setGivenName("");
      setSurname("");
      setEmail("");
      setPhone("");
      setUsersEstimateOfValue(0);

      const { res, status } = await postReq({
        token: auth?.accessToken as string,
        url: `${process.env.NEXT_PUBLIC_API_URL}/listing/create-listing`,
        payload: requestBody,
      });

      if (status === 200) {
        router.push(`/ilmoitus/${res.uuid}`);
      }
    } else {
      setStepsCompleted(
        stepsCompleted < activeStep ? activeStep + 1 : stepsCompleted
      );
      setActiveStep(activeStep + 1);
    }
  };

  const decrementStep = () => {
    setActiveStep(activeStep - 1);
  };

  const CardPages = {
    0: (
      <ApartmentType
        selectedApartmentType={apartmentType}
        setApartmentType={setApartmentType}
        incrementStep={incrementStep}
      />
    ),

    1: (
      <StartOfSale
        startOfSale={startOfSale}
        incrementStep={incrementStep}
        setStartOfSale={setStartOfSale}
        decrementStep={decrementStep}
      />
    ),
    2: (
      <ListingDetails
        incrementStep={incrementStep}
        surfaceArea={surfaceArea}
        setSurfaceArea={setSurfaceArea}
        address={address}
        setAddress={setAddress}
        quality={quality}
        setQuality={setQuality}
        decrementStep={decrementStep}
        usersEstimateOfValue={usersEstimateOfValue}
        setUsersEstimateOfValue={setUsersEstimateOfValue}
        numberOfRooms={numberOfRooms}
        setNumberOfRooms={setNumberOfRooms}
      />
    ),
    3: (
      <ContactCard
        incrementStep={incrementStep}
        decrementStep={decrementStep}
        givenName={givenName}
        surname={surname}
        setGivenName={setGivenName}
        setSurname={setSurname}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
      />
    ),
    4: (
      <Box sx={{ width: "400px", height: "400px" }}>
        <Spinner fullScreen={false} size={45} />
      </Box>
    ),
  };

  return (
    <>
      <ContentSection>
        <div className={styles.listingContentContainer}>
          <StepperWrapper
            stepLabels={listingSteps}
            stepIcons={stepIcons}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            stepsCompleted={stepsCompleted}
          />

          <Card
            style={{
              flexWrap: "wrap",
              maxWidth: "max-content",
              margin: "0 auto",
              marginTop: "32px",
            }}
          >
            <CardContent>
              {CardPages[activeStep as keyof typeof CardPages]}
            </CardContent>
          </Card>
        </div>
      </ContentSection>
    </>
  );
}
