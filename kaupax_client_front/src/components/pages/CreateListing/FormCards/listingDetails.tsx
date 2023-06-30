import { Button } from "@/components/MuiWrappers/Buttons";
import InputAutoComplete from "@/components/MuiWrappers/Input/autocomplete";
import TextFieldWrapper from "@/components/MuiWrappers/Input/textfield";
import TypographySecondary from "@/components/MuiWrappers/Typography/text-secondary";
import { getReq } from "@/services/util";
import { ERROR_RED } from "@/utils/constants";
import { getPlacesAutoCompleteUrl } from "@/utils/endpoints";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Field, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { CardDefaultProps } from "./apartmentType";
import styles from "@/styles/apartmentDetails.module.css";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";

interface CardProps extends CardDefaultProps {
  surfaceArea: number | null;
  address: string | null;
  setSurfaceArea: React.Dispatch<React.SetStateAction<number>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  quality: string | null;
  setQuality: React.Dispatch<React.SetStateAction<string>>;
  usersEstimateOfValue: number;
  setUsersEstimateOfValue: React.Dispatch<React.SetStateAction<number>>;
  numberOfRooms: number | null;
  setNumberOfRooms: React.Dispatch<React.SetStateAction<number | null>>;
}

const validationSchema = Yup.object({
  address: Yup.string().required("Katuosoite on pakollinen tieto"),
  surfaceArea: Yup.number()
    .min(1, "Pinta-alan on oltava vähintään 1 m²")
    .max(
      999,
      "Pinta-ala on liian suuri. Jos asuntosi on yli 999 m², valitse 999 m² arvoksi."
    )
    .typeError("Pinta-alan on oltava numero")
    .required("Pinta-ala on pakollinen tieto"),
  quality: Yup.string().required("Asunnon kunto on pakollinen tieto"),
  usersEstimateOfValue: Yup.number()
    .min(-1, "Arvio ei voi olla nolla tai negatiivinen")
    .max(5000000, "Arvio ei voi olla yli 5 000 000€"),
  numberOfRooms: Yup.number().required(
    "Huoneiden lukumäärä on pakollinen tieto"
  ),
});

export default function ListingDetails({
  address,
  setSurfaceArea,
  setAddress,
  setQuality,
  surfaceArea,
  quality,
  incrementStep,
  decrementStep,
  usersEstimateOfValue,
  setUsersEstimateOfValue,
  numberOfRooms,
  setNumberOfRooms,
}: CardProps) {
  const [addressOptions, setAddressOptions] = useState([]);

  const { width } = useWindowDimensions();

  const formik = useFormik({
    initialValues: {
      address: address,
      surfaceArea: surfaceArea,
      quality: quality,
      usersEstimateOfValue,
      numberOfRooms,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setAddress(values.address as string);
      setSurfaceArea(values.surfaceArea as number);
      setQuality(values.quality as string);
      incrementStep({ lastStepItems: null });
      setUsersEstimateOfValue(values.usersEstimateOfValue as number);
      setNumberOfRooms(values.numberOfRooms as number);
    },
  });

  const RoomsDropdown = ({
    children,
    form,
    field,
  }: {
    children: React.ReactNode;
    form: any;
    field: any;
  }) => {
    const { name, value }: any = field;
    const { setFieldValue }: any = form;
    return (
      <>
        <TypographySecondary
          props={{
            color:
              formik.touched.numberOfRooms &&
              formik.errors.numberOfRooms !== undefined
                ? ERROR_RED
                : "text.secondary",
          }}
        >
          Huoneiden lukumäärä
        </TypographySecondary>
        <Select
          error={
            formik.touched.numberOfRooms &&
            formik.errors.numberOfRooms !== undefined
              ? true
              : false
          }
          name={name}
          value={value}
          onChange={(e) => {
            setFieldValue(name, e.target.value);
          }}
        >
          {children}
        </Select>
        {formik.touched.numberOfRooms &&
          formik.errors.numberOfRooms !== undefined && (
            <TypographySecondary
              props={{ marginLeft: "10px", fontSize: 18, color: ERROR_RED }}
            >
              Asunnon kunto on pakollinen tieto
            </TypographySecondary>
          )}
      </>
    );
  };

  const QualityDropdown = ({
    children,
    form,
    field,
  }: {
    children: React.ReactNode;
    form: any;
    field: any;
  }) => {
    const { name, value }: any = field;
    const { setFieldValue }: any = form;
    return (
      <>
        <TypographySecondary
          props={{
            color:
              formik.touched.quality && formik.errors.quality !== undefined
                ? ERROR_RED
                : "text.secondary",
          }}
        >
          Asunnon Kunto
        </TypographySecondary>
        <Select
          error={
            formik.touched.quality && formik.errors.quality !== undefined
              ? true
              : false
          }
          name={name}
          value={value}
          onChange={(e) => {
            setFieldValue(name, e.target.value);
          }}
        >
          {children}
        </Select>
        {formik.touched.quality && formik.errors.quality !== undefined && (
          <TypographySecondary
            props={{ marginLeft: "10px", fontSize: 18, color: ERROR_RED }}
          >
            Asunnon kunto on pakollinen tieto
          </TypographySecondary>
        )}
      </>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const placesInputField = document.getElementById("address");
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

  return (
    <>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Typography
            variant={"h5"}
            sx={{ opacity: "0.7" }}
            className={styles.mainTitle}
          >
            Asunnon tiedot
          </Typography>

          <InputAutoComplete
            textfieldInError={
              formik.touched.address && formik.errors.address !== undefined
            }
            inputSxProps={{ marginTop: "32px" }}
            options={addressOptions}
            value={address}
            setValue={setAddress}
            inputLabel={"Katuosoite"}
            helperText={
              formik.touched.address && formik.errors.address !== undefined
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
            id="address"
            textfieldVariant="outlined"
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
                        <LocationOnIcon sx={{ color: "text.secondary" }} />
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

          <TextFieldWrapper
            label="Pinta-ala (m²)"
            id="surfaceArea"
            disableResponsiveness={true}
            type="number"
            sx={{ width: "100%", marginTop: "32px" }}
            onChangeCallback={formik.handleChange}
            value={
              formik.values.surfaceArea === 0 ? "" : formik.values.surfaceArea
            }
            error={
              formik.touched.surfaceArea &&
              formik.errors.surfaceArea !== undefined
                ? true
                : false
            }
            helperText={
              formik.touched.surfaceArea &&
              formik.errors.surfaceArea !== undefined
                ? formik.errors.surfaceArea
                : ""
            }
          />

          <TextFieldWrapper
            label="Toivehinta (€)"
            id="usersEstimateOfValue"
            disableResponsiveness={true}
            type="number"
            sx={{ width: "100%", marginTop: "32px" }}
            onChangeCallback={formik.handleChange}
            value={
              formik.values.usersEstimateOfValue === 0
                ? ""
                : formik.values.usersEstimateOfValue
            }
            error={
              formik.touched.usersEstimateOfValue &&
              formik.errors.usersEstimateOfValue !== undefined
                ? true
                : false
            }
            helperText={
              formik.touched.usersEstimateOfValue &&
              formik.errors.usersEstimateOfValue !== undefined
                ? formik.errors.usersEstimateOfValue
                : ""
            }
          />

          <FormGroup style={{ marginTop: "10px" }}>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="En halua antaa toivehintaa"
            />
          </FormGroup>

          <FormControl sx={{ width: "100%", marginTop: "24px" }}>
            <Field name="numberOfRooms" component={RoomsDropdown}>
              <MenuItem value={1}>Yksi</MenuItem>
              <MenuItem value={2}>Kaksi</MenuItem>
              <MenuItem value={3}>Kolme</MenuItem>
              <MenuItem value={4}>Neljä</MenuItem>
              <MenuItem value={5}>Enemmän kuin neljä</MenuItem>
            </Field>
          </FormControl>
          <FormControl sx={{ width: "100%", marginTop: "24px" }}>
            <Field name="quality" component={QualityDropdown}>
              <MenuItem value={"Uusi"}>Uusi</MenuItem>
              <MenuItem value={"Erinomainen"}>Erinomainen</MenuItem>
              <MenuItem value={"Hyvä"}>Hyvä</MenuItem>
              <MenuItem value={"Tyydyttävä"}>Tyydyttävä</MenuItem>
              <MenuItem value={"Vaatii kevyttä remontointia"}>
                Vaatii kevyttä remontointia
              </MenuItem>
              <MenuItem value={"Vaatii paljon remontointia"}>
                Vaatii paljon remontointia
              </MenuItem>
              <MenuItem value={"Purkukuntoinen"}>Purkukuntoinen</MenuItem>
            </Field>
          </FormControl>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <Button
              variant="outlined"
              onClick={decrementStep}
              className={styles.buttons}
            >
              Takaisin
            </Button>

            <Button
              variant={"contained"}
              type="submit"
              className={styles.buttons}
            >
              Seuraava
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </>
  );
}
