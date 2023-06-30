import InputAutoComplete from "@/components/MUI/autocomplete";
import Nav from "@/components/PreLoggedIn/nav";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { useToast } from "@/context/toast";
import {
  getPlacesAutoCompleteUrl,
  updateRealtorProfileUrl,
} from "@/services/endpoints";
import { getReq, putReq } from "@/services/util";
import styleUtils from "@/styles/utils.module.css";
import { singleUploadFile } from "@/utils/functions";
import useToastProps from "@/utils/hooks/useToastProps";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { UploadFromCloud } from "@/utils/icons";
import { Realtor } from "@/utils/types/realtor";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import styles from "./addInformation.module.css";

const validationSchema = Yup.object({
  obfuscated: Yup.string().required("Katuosoite on pakollinen tieto"),
  phone: Yup.string().required("Puhelinnumero on pakollinen tieto"),
  company: Yup.string().nullable().default(""),
  licencedAgent: Yup.boolean().required("Tieto on pakollinen"),
  entrepreneur: Yup.boolean().required("Tieto on pakollinen"),
  experienceInYears: Yup.string().required("Tieto on pakollinen"),
  biography: Yup.string().nullable().default(""),
  languages: Yup.array()
    .of(Yup.string().required("Kieli on pakollinen tieto"))
    .min(1, "Vähintään yksi kieli on pakollinen tieto")
    .max(7, "Sinun ei tarvitse lisätä näin montaa kieltä"),
  firstName: Yup.string().required("Etunimi on pakollinen tieto"),
  lastName: Yup.string().required("Sukunimi on pakollinen tieto"),
});

export default function AddInformation({ user }: { user: Realtor }) {
  //FORM STATE
  const [address, setAddress] = useState("");
  const [phone] = useState("");
  const [company] = useState("");
  const [licencedAgent, setLicencedAgent] = useState(false);
  const [entrepreneur, setEntrepreneur] = useState(false);
  const [experienceInYears, setExperienceInYears] = useState("");
  const [biography, setBiography] = useState("");
  const [addressOptions, setAddressOptions] = useState([]);
  const fileInputRef = useRef(null);
  const dragAreaRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [firstName] = useState("");
  const [lastName] = useState("");

  //OPTIONS
  const [yearsOfExperienceOptions] = useState([
    {
      label: "Alle 1 vuosi",
      value: 0,
    },
    {
      label: "1-2 vuotta",
      value: 1,
    },
    {
      label: "2-3 vuotta",
      value: 2,
    },
    {
      label: "3-4 vuotta",
      value: 3,
    },
    {
      label: "4-5 vuotta",
      value: 4,
    },
    {
      label: "5-7 vuotta",
      value: 5,
    },
    {
      label: "7-10 vuotta",
      value: 6,
    },
    {
      label: "10-15 vuotta",
      value: 7,
    },
    {
      label: "15-20 vuotta",
      value: 8,
    },
    {
      label: "Yli 20 vuotta",
      value: 9,
    },
  ]);

  //UTIL
  const toastProps = useToastProps();
  const auth = useAuth();
  const toast = useToast();

  useEffect(() => {
    setTimeout(() => {
      const placesInputField = document.getElementById("obfuscated");
      placesInputField?.addEventListener("input", async (event) => {
        const target = event?.target as HTMLTextAreaElement;

        if (target.value.length > 2) {
          const url = getPlacesAutoCompleteUrl(target.value);
          const { res, status } = await getReq({ url });

          if (status === 200) {
            setAddressOptions(res.data.predictions);
          }
        }
      });
    }, 100);
  }, []);

  const { width } = useWindowDimensions();

  const onDragOver = (e: any) => {
    e.preventDefault();

    if (!dragAreaRef.current) return;

    const dragAreaElem = dragAreaRef.current as HTMLDivElement;

    dragAreaElem.style.backgroundColor = "#e3e3e3";
  };

  const handleFileUploadByDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    setIsLoading(true);
    e.preventDefault();

    const files = e.dataTransfer.files;
    uploadFile(files);
  };

  const uploadFile = async (files: FileList) => {
    setIsLoading(true);

    const data = await singleUploadFile(files, auth);

    if (data && data.message) {
      setImageUrl(data.message);
      setIsLoading(false);
      toastProps.openToast({
        message: `Kuva lisätty`,
        severity: "success",
      });
    } else {
      setIsLoading(false);
      toastProps.openToast({
        message: `Kuvan lisääminen epäonnistui`,
        severity: "success",
      });
    }
  };

  const onDragEnd = (e: any) => {
    e.preventDefault();

    if (!dragAreaRef.current) return;

    const dragAreaElem = dragAreaRef.current as HTMLDivElement;

    dragAreaElem.style.backgroundColor = "white";
  };

  const handleFileUploadByFileExplorer = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files === null) return;

    const files = e.target.files as FileList;
    uploadFile(files);
  };

  const formik = useFormik({
    initialValues: {
      address,
      phone,
      company,
      licencedAgent,
      entrepreneur,
      experienceInYears,
      biography,
      firstName,
      lastName,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body = {
        phone: values.phone,
        address: address,
        company: values.company,
        licencedAgent: licencedAgent,
        entrepreneur: entrepreneur,
        biography: biography,
        profilePicUrl: imageUrl,
        firstName: values.firstName,
        lastName: values.lastName,
      };
      submit(body);
    },
  });

  const submit = async (body: {
    phone: string;
    address: string;
    company: string;
    licencedAgent: boolean;
    entrepreneur: boolean;
    biography: string;
    profilePicUrl: string;
    firstName: string;
    lastName: string;
  }) => {
    const url = updateRealtorProfileUrl();
    const { status, res } = await putReq({
      url,
      payload: body,
      token: auth.accessToken as string,
    });

    if (status === 200) {
      toastProps.openToast({
        message: `Tiedot päivitetty`,
        severity: "success",
      });
      auth.modifyUser(res.data);
      toast.toastProps.openToast({
        message: `Tilisi tiedot on päivitetty`,
        severity: "success",
      });
    } else {
      toast.toastProps.openToast({
        message: `Tietojen päivitys epäonnistui`,
        severity: "error",
      });
    }
  };

  const renderDragAndDropArea = () => {
    if (isLoading) {
      return (
        <div
          className={styles.dragAndDropArea}
          style={{ width: 200, height: 200 }}
        >
          <Spinner />
        </div>
      );
    }
    if (imageUrl) {
      return (
        <div
          className={styles.dragAndDropArea}
          onClick={() => {
            if (!fileInputRef.current) return;
            const fileInput = fileInputRef.current as HTMLInputElement;
            fileInput.click();
          }}
          style={{ width: 200, height: 200 }}
        >
          <img
            src={imageUrl}
            style={{ width: "100%", height: "auto", maxHeight: "200px" }}
            alt={"profiilikuva"}
          />
          <input
            type="file"
            id="myfile"
            name="myfile"
            accept="image/*"
            className={styles.fileInputHidden}
            ref={fileInputRef}
            onChange={handleFileUploadByFileExplorer}
          />
        </div>
      );
    }
    return (
      <div
        className={styles.dragAndDropArea}
        style={{ width: 200, height: 200 }}
        onClick={() => {
          if (!fileInputRef.current) return;
          const fileInput = fileInputRef.current as HTMLInputElement;
          fileInput.click();
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragEnd}
        onDrop={handleFileUploadByDrop}
        ref={dragAreaRef}
      >
        <input
          type="file"
          id="myfile"
          name="myfile"
          accept="image/*"
          className={styles.fileInputHidden}
          ref={fileInputRef}
          onChange={handleFileUploadByFileExplorer}
        />
        <div
          style={{
            opacity: "0.3",
          }}
        >
          <UploadFromCloud fill={"black"} width={"50px"} />
        </div>
      </div>
    );
  };

  return (
    <>
      <Nav />

      <div className={styles.container} style={{ marginTop: "90px" }}>
        <div className={styles.contentContainer}>
          <h1 className={styleUtils.mainHeader + " " + styles.mainHeader}>
            Hienoa, että liityit mukaan! Täytä vielä muutama tieto ja olet
            valmis.
          </h1>

          <p style={{ marginTop: 10 }} className={styleUtils.paragraph}>
            * Merkityt kentät ovat pakollisia. Muut kentät ovat vapaaehtoisia,
            mutta niiden täyttäminen auttaa sinua löytämään asiakkaita.
          </p>
          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.formDiv}>
                <TextField
                  id="firstName"
                  label="* Etunimi"
                  onChange={formik.handleChange}
                  variant="filled"
                  error={
                    formik.touched.firstName &&
                    formik.errors.firstName !== undefined
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.firstName &&
                    formik.errors.firstName !== undefined
                      ? formik.errors.firstName
                      : ""
                  }
                />

                <TextField
                  id="lastName"
                  label="* Sukunimi"
                  onChange={formik.handleChange}
                  variant="filled"
                  error={
                    formik.touched.lastName &&
                    formik.errors.lastName !== undefined
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.lastName &&
                    formik.errors.lastName !== undefined
                      ? formik.errors.lastName
                      : ""
                  }
                />
                <div style={{ marginBottom: "-22px" }}>
                  <InputAutoComplete
                    textfieldInError={
                      formik.touched.address &&
                      formik.errors.address !== undefined
                    }
                    options={addressOptions}
                    value={address}
                    setValue={setAddress}
                    inputLabel={"* Katuosoite"}
                    helperText={
                      formik.touched.address &&
                      formik.errors.address !== undefined
                        ? "Katuosoite on pakollinen tieto"
                        : ""
                    }
                    getOptionLabel={(option: any) => {
                      return option
                        ? option.description === undefined
                          ? option
                          : option.description
                        : "";
                    }}
                    noOptionsText="Ei sijainteja"
                    id="obfuscated"
                    textfieldVariant="filled"
                    formikSetFieldValue={(field: any, value: any) => {
                      formik.setFieldValue(field, value?.description || "");
                    }}
                    renderOptionCallback={(props, option) => {
                      return (
                        <li {...props}>
                          <Grid
                            container
                            alignItems="center"
                            className={styles.addressOptionGrid}
                          >
                            {width > 800 && (
                              <Grid item sx={{ display: "flex", width: 44 }}>
                                <LocationOnIcon
                                  sx={{ color: "text.secondary" }}
                                />
                              </Grid>
                            )}
                            <Grid item xs>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                className={styles.addressOptionText}
                              >
                                {option.description}
                              </Typography>
                            </Grid>
                          </Grid>
                        </li>
                      );
                    }}
                  />
                </div>

                <TextField
                  id="phone"
                  label="* Puhelinnumero"
                  onChange={formik.handleChange}
                  variant="filled"
                  error={
                    formik.touched.phone && formik.errors.phone !== undefined
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.phone && formik.errors.phone !== undefined
                      ? formik.errors.phone
                      : ""
                  }
                />
                <TextField
                  id="company"
                  label="Yritys"
                  onChange={formik.handleChange}
                  variant="filled"
                  error={
                    formik.touched.company &&
                    formik.errors.company !== undefined
                      ? true
                      : false
                  }
                  helperText={
                    formik.touched.company &&
                    formik.errors.company !== undefined
                      ? formik.errors.company
                      : ""
                  }
                />

                <FormControl
                  error={
                    formik.touched.experienceInYears &&
                    formik.errors.experienceInYears !== undefined
                      ? true
                      : false
                  }
                >
                  <InputLabel id="years-of-exp-label">
                    * Alan kokemus vuosissa
                  </InputLabel>
                  <Select
                    labelId="years-of-exp-label"
                    id="experienceInYears"
                    label="Age"
                    variant="filled"
                    value={experienceInYears}
                    onChange={(e) => {
                      formik.setFieldValue("experienceInYears", e.target.value);
                      setExperienceInYears(e.target.value);
                    }}
                  >
                    {yearsOfExperienceOptions.map((item) => {
                      return (
                        <MenuItem key={item.label} value={item.label}>
                          {item.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>

                <div
                  style={{
                    display: "flex",
                    columnGap: "32px",
                    flexWrap: "wrap",
                    rowGap: "16px",
                  }}
                >
                  <div>
                    <div className={styleUtils.paragraph}>Oletko yrittäjä?</div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={() => {
                              setEntrepreneur(!entrepreneur);
                            }}
                          />
                        }
                        label={<div>{entrepreneur ? "Kyllä" : "En"}</div>}
                      />
                    </FormGroup>
                  </div>

                  <div>
                    <div className={styleUtils.paragraph}>
                      Oletko suorittanut LKV -tutkinnon?
                    </div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={() => {
                              setLicencedAgent(!licencedAgent);
                            }}
                          />
                        }
                        label={<div>{licencedAgent ? "Kyllä" : "En"}</div>}
                      />
                    </FormGroup>
                  </div>
                </div>
                <div>
                  <div className={styleUtils.mainHeader}>Profiilikuva</div>
                  <div>
                    <p className={styleUtils.paragraph}>
                      Voit laittaa profiilikuvan tähän osioon
                    </p>
                    {renderDragAndDropArea()}
                  </div>

                  <div
                    className={styleUtils.mainHeader}
                    style={{ marginTop: "16px" }}
                  >
                    Kuvaus
                  </div>

                  <p className={styleUtils.paragraph}>
                    Voit kertoa työtaustastasi tai itsestäsi muuten täällä. Tämä
                    teksti näkyy käyttäjille joiden kohteisiin teet tarjouksia.
                  </p>
                  <div>
                    <textarea
                      className={styles.textarea}
                      onChange={(e) => setBiography(e.target.value)}
                      placeholder={`Hei! Olen ${user.firstName}, kokenut ja ammattitaitoinen kiinteistönvälittäjä. Minulla on yli 3 vuoden kokemus alalta ja olen auttanut lukuisia asiakkaita löytämään unelmiensa kodin tai sijoituskohteen. Erikoisosaamiseni kattaa [alueet tai kiinteistötyypit], ja vahvuuteni on kuunnella asiakkaitani tarkasti tarjotakseni heille juuri heidän tarpeitaan vastaavia ratkaisuja. Tavoitteenani on tehdä kiinteistökaupoista sujuva ja miellyttävä kokemus jokaiselle osapuolelle. Ota yhteyttä minuun, niin autan sinua kaikissa kiinteistöasioissa – olipa kyseessä sitten asunnon myynti, ostaminen tai vuokraaminen.
                 `}
                      style={{
                        resize: "none",
                        background: "inherit",
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className={styles.submitFooter}>
                <Button
                  variant={"contained"}
                  type={"submit"}
                  style={{
                    fontSize: "22px",
                    textTransform: "capitalize",
                    padding: "4px 20px",
                  }}
                >
                  Lähetä
                </Button>
              </div>
            </form>
          </FormikProvider>
        </div>
      </div>
    </>
  );
}
