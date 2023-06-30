import { Button } from "@/components/MuiWrappers/Buttons";
import TextFieldWrapper from "@/components/MuiWrappers/Input/textfield";
import { useAuth } from "@/context/auth";
import styles from "@/styles/contactDetails.module.css";
import { Box } from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { CardDefaultProps } from "./apartmentType";

const validationSchema = Yup.object({
  givenName: Yup.string()
    .min(2, "Etunimi on liian lyhyt")
    .required("Etunimi on pakollinen tieto"),
  surname: Yup.string()
    .min(2, "Sukunimi on liian lyhyt")
    .required("Sukunimi on pakollinen tieto"),
  email: Yup.string()
    .email("Väärin kirjoitettu sähköpostiosoite")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Sähköpostiosoite on väärin kirjoitettu"
    )
    .required("Sähköpostiosoite on pakollinen tieto"),
  phone: Yup.string().required("Puhelinnumero"),
});

interface CardProps extends CardDefaultProps {
  givenName: string;
  surname: string;
  email: string;
  phone: string;
  setGivenName: React.Dispatch<React.SetStateAction<string>>;
  setSurname: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
}

export default function ContactCard({
  incrementStep,
  decrementStep,
  email,
  phone,
  givenName,
  surname,
  setGivenName,
  setSurname,
  setEmail,
  setPhone,
}: CardProps) {
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      givenName: givenName,
      surname: surname,
      email: auth?.user?.email ? auth.user.email : email,
      phone: phone,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values["email"] = auth?.user?.email ? auth.user.email : values.email;
      setGivenName(values.givenName);
      setSurname(values.surname);
      setEmail(values.email);
      setPhone(values.phone);
      incrementStep({ lastStepItems: values });
    },
  });
  return (
    <Box
      sx={{
        maxWidth: "500px",
      }}
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: "32px",
          }}
        >
          <TextFieldWrapper
            label="Etunimi"
            id="givenName"
            sx={{ width: "100%" }}
            onChangeCallback={formik.handleChange}
            value={formik.values.givenName}
            error={
              formik.touched.givenName && formik.errors.givenName !== undefined
                ? true
                : false
            }
            helperText={
              formik.touched.givenName && formik.errors.givenName !== undefined
                ? formik.errors.givenName
                : ""
            }
          />
          <TextFieldWrapper
            label="Sukunimi"
            id="surname"
            sx={{ width: "100%" }}
            onChangeCallback={formik.handleChange}
            value={formik.values.surname}
            error={
              formik.touched.surname && formik.errors.surname !== undefined
                ? true
                : false
            }
            helperText={
              formik.touched.surname && formik.errors.surname !== undefined
                ? formik.errors.surname
                : ""
            }
          />

          {!auth.user && (
            <TextFieldWrapper
              label="Email"
              id="email"
              sx={{ width: "100%" }}
              onChangeCallback={formik.handleChange}
              value={formik.values.email}
              error={
                formik.touched.email && formik.errors.email !== undefined
                  ? true
                  : false
              }
              helperText={
                formik.touched.email && formik.errors.email !== undefined
                  ? formik.errors.email
                  : ""
              }
            />
          )}
          <TextFieldWrapper
            label="Puhelinnumero"
            id="phone"
            sx={{ width: "100%" }}
            onChangeCallback={formik.handleChange}
            value={formik.values.phone}
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
              Lähetä
            </Button>
          </Box>
        </form>
      </FormikProvider>
    </Box>
  );
}
