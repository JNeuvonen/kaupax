import SnackBar from "@/components/MuiWrappers/snackbar";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/context/auth";
import { useLayout } from "@/context/layout";
import { postReq } from "@/services/util";
import styles from "@/styles/apartmentDetailsTab.module.css";
import { addS3UrlToListing, removeS3UrlFromListing } from "@/utils/endpoints";
import { bulkUploadFiles } from "@/utils/functions";
import useToastProps from "@/utils/hooks/useToastManager";
import { UploadFromCloud } from "@/utils/icons";
import { ListingDetailed } from "@/utils/types/listing";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";

interface Props {
  listing: ListingDetailed;
  refetchListing: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<
    QueryObserverResult<
      {
        status: number;
        res: any;
      },
      unknown
    >
  >;
}
export default function ApartmentDetails({ listing, refetchListing }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const toastProps = useToastProps();
  const dragAreaRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setMaxWidth = useLayout().setLayoutMaxWidth;

  useEffect(() => {
    setMaxWidth("1200px");

    return () => {
      setMaxWidth("1500px");
    };
  }, [setMaxWidth]);

  const handleFileUploadByDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    setIsLoading(true);
    bulkUploadFiles(
      files,
      toastProps,
      auth,
      addS3UrlToListing(listing.uuid),
      auth.accessToken as string,
      () => {
        refetchListing();
        setIsLoading(false);
      }
    );

    if (!dragAreaRef.current) return;

    const dragAreaElem = dragAreaRef.current as HTMLDivElement;

    dragAreaElem.style.backgroundColor = "white";
  };

  const deleteImageCallback = async (index: number) => {
    const { status } = await postReq({
      url: removeS3UrlFromListing(listing.uuid),
      token: auth.accessToken as string,
      queryParams: [{ key: "index", value: String(index) }],
    });

    if (status === 200) {
      refetchListing();
    }
  };

  const handleFileUploadByFileExplorer = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files === null) return;

    const files = e.target.files as FileList;
    setIsLoading(true);
    bulkUploadFiles(
      files,
      toastProps,
      auth,
      addS3UrlToListing(listing.uuid),
      auth.accessToken as string,
      () => {
        refetchListing();
        setIsLoading(false);
      }
    );
  };

  const onDragOver = (e: any) => {
    e.preventDefault();

    if (!dragAreaRef.current) return;

    const dragAreaElem = dragAreaRef.current as HTMLDivElement;

    dragAreaElem.style.backgroundColor = "#e3e3e3";
  };

  const onDragEnd = (e: any) => {
    e.preventDefault();

    if (!dragAreaRef.current) return;

    const dragAreaElem = dragAreaRef.current as HTMLDivElement;

    dragAreaElem.style.backgroundColor = "white";
  };

  const renderAddedPictures = () => {
    if (listing.Picture.length === 0) {
      return null;
    }
    return (
      <div className={styles.addedPicturesContainer}>
        {listing.Picture.map((item, i) => {
          return (
            <ImageCard
              url={decodeURI(item)}
              alt={`kuva ${i + 1}`}
              key={i}
              className={styles.image}
              removeImageCallback={() => deleteImageCallback(i)}
            />
          );
        })}
      </div>
    );
  };

  const renderDragAndDropContainer = () => {
    if (isLoading) {
      return (
        <div className={styles.dragAndDropArea}>
          <Spinner />;
        </div>
      );
    }
    return (
      <div
        className={styles.dragAndDropArea}
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
          multiple
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
      <SnackBar
        {...toastProps}
        alertEnabled={false}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      />

      <div style={{ marginTop: "22px" }} className={styles.contentContainer}>
        <div>
          <div className={styles.header}>
            Voit lisätä kommentteja kiinteistönvälittäjille tähän osioon
          </div>
          <textarea
            className={styles.textarea}
            placeholder={
              "Voit antaa lisätietoja asunnostasi tai toiveitasi tähän kenttään. Kiinteistönvälittäjille arvokasta tietoa ovat esimerkiksi se, sijaitseeko asunto omalla tontilla vai vuokratontilla. Kuvat auttavat myös saamaan kiinteistönvälittäjiltä parempia ja useampia tarjouksia. Kuvien lisääminen ei ole pakollista."
            }
            style={{
              resize: "none",
            }}
          ></textarea>
        </div>
        <div>
          <div className={styles.header}>
            Voit lisätä kuvia asunnosta tähän osioon
          </div>
          {renderDragAndDropContainer()}

          {renderAddedPictures()}
        </div>
      </div>
    </>
  );
}
