import ContentSection from "@/components/ContentSection";
import { useAuth } from "@/context/auth";
import { useLayout } from "@/context/layout";
import styleUtils from "@/styles/utils.module.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import { FormikProvider, useFormik } from "formik";
import Link from "next/link";
import React from "react";
import * as Yup from "yup";
import styles from "./luo-tili.module.css";
import kirjauduStyles from "./kirjaudu.module.css";
import Spinner from "@/components/Spinner";
import { PrimaryButton } from "@/components/MUI/Buttons/primaryButton";

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Salasanan tulee olla vähintään 8 merkkiä")
    .required("Salasana on pakollinen tieto"),

  passwordRepeat: Yup.string(),
  email: Yup.string()
    .email("Väärin kirjoitettu sähköpostiosoite")
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Sähköpostiosoite on väärin kirjoitettu"
    )
    .required("Sähköpostiosoite on pakollinen tieto"),
});

export default function LoginPage() {
  const layout = useLayout();

  const [showPassword, setShowPassword] = React.useState(false);
  const auth = useAuth();

  const [loading, setLoading] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      email: "",
      passwordRepeat: "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      auth.loginManually(values.email, values.password, setLoading);
    },
  });

  React.useEffect(() => {
    layout.setIntendedContent(1200);
  }, [layout]);

  if (loading) {
    return (
      <ContentSection>
        <div
          style={{
            display: "flex",
            height: "80vh",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      </ContentSection>
    );
  }

  return (
    <ContentSection>
      <div className={styles.loginContainer}>
        <div className={styles.contentContainer}>
          <h1
            className={styleUtils.mainHeader + " " + kirjauduStyles.mainHeader}
          >
            Kirjaudu sisään
          </h1>

          <FormikProvider value={formik}>
            <form
              onSubmit={formik.handleSubmit}
              className={kirjauduStyles.dropShadowContainer}
              style={{ marginTop: "24px" }}
            >
              <TextField
                label="Sähköposti"
                variant="outlined"
                id={"email"}
                value={formik.values.email}
                onChange={formik.handleChange}
                style={{ width: "100%" }}
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
              <TextField
                id="password"
                label="Salasana"
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={
                  formik.touched.password &&
                  formik.errors.password !== undefined
                    ? true
                    : false
                }
                helperText={
                  formik.touched.password &&
                  formik.errors.password !== undefined
                    ? formik.errors.password
                    : ""
                }
              />

              <PrimaryButton
                style={{
                  textTransform: "capitalize",
                  borderRadius: "7px",
                  marginTop: "24px",
                }}
                type={"submit"}
              >
                Luo käyttäjätili
              </PrimaryButton>
              <p
                style={{
                  marginTop: "24px",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                Puuttuuko sinulta tili? Luo tili{" "}
                <Link href={"/login/luo-tili"} className={styleUtils.link}>
                  täältä
                </Link>
              </p>
            </form>
          </FormikProvider>
        </div>
      </div>
    </ContentSection>
  );
}
