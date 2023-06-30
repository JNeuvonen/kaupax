import { useApartment } from "@/context/apartment";
import { useLayout } from "@/context/layout";
import { BLUE_100, SIDE_MENU_BP } from "@/utils/constants";
import {
  calculateClusterPricePerSqm,
  calculateDuration,
  getPluralOrSingular,
  getTimeElapsed,
} from "@/utils/functions";
import useWindowDimensions from "@/utils/hooks/useWindowDimensions";
import { CondoIcon, ExternalLinkIcon } from "@/utils/icons";
import { ApartmentMapBoxFmt } from "@/utils/types/apartment";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Map, { FullscreenControl, MapRef, Marker, Popup } from "react-map-gl";
import useSupercluster from "use-supercluster";
import GeocoderControl from "./GeocoderControl";
import styleUtils from "@/styles/utils.module.css";

type MapWrapperProps = {
  apartments: any;
};

export default function MapWrapper({ apartments }: MapWrapperProps) {
  const [viewport, setViewport] = useState({
    latitude: undefined,
    longitude: undefined,
    zoom: 10,
  } as any);

  const setApartments = useApartment().setApartments;

  const { width } = useWindowDimensions();
  const mapRef = useRef<MapRef>(null);

  const layout = useLayout().sideMenuWidth;
  const setIntendation = useLayout().setIntendedContent;

  const [popupInfo, setPopupInfo] = useState<ApartmentMapBoxFmt | null>(null);

  const bounds: any = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : [-180, -85, 180, 85];

  const { clusters, supercluster } = useSupercluster({
    points: apartments.features !== undefined ? apartments.features : [],
    zoom: viewport.zoom,
    bounds: bounds,
  });

  const mapOnMove = (evt: any) => {
    setViewport(evt.viewState);
    let listings: any = [];
    clusters.forEach((item) => {
      if (item.properties.cluster) {
        const children = supercluster?.getLeaves(item.id as number);
        listings = listings.concat(children);
      } else {
        listings.push(item);
      }
    });
    setApartments(listings);
  };

  useEffect(() => {
    setIntendation(0);
  }, [setIntendation]);

  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.resize();
    }, 400);
  }, [width, layout]);

  useEffect(() => {
    let viewportSet = false;
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 10,
      });
      viewportSet = true;
    });

    if (!viewportSet) {
      setViewport({
        latitude: 60.155991,
        longitude: 24.932779,
        zoom: 10,
      });
    }
  }, []);

  return (
    <div>
      {viewport.latitude !== undefined && viewport.longitude !== undefined && (
        <Map
          initialViewState={viewport}
          onMove={mapOnMove}
          {...viewport}
          style={{
            width:
              width < SIDE_MENU_BP
                ? `calc(100% + ${18 * 2}px)`
                : `calc(100% + ${24 * 2}px)`,
            minHeight: "400px",
            height: "calc(100vh - 160px)",
            marginLeft: width < SIDE_MENU_BP ? -14 : -24,
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN}
          maxZoom={13}
          minZoom={5}
          reuseMaps={true}
          touchPitch={true}
          pitch={0}
          ref={mapRef}
        >
          <GeocoderControl
            mapboxAccessToken={
              process.env.NEXT_PUBLIC_MAP_BOX_ACCESS_TOKEN as string
            }
            position="top-left"
          />

          <FullscreenControl />
          {popupInfo && (
            <Popup
              longitude={popupInfo.geometry.coordinates[0]}
              latitude={popupInfo.geometry.coordinates[1]}
              onClose={() => setPopupInfo(null)}
              closeButton={false}
              style={{ maxWidth: "1000px" }}
            >
              <div>
                <h3 className={styleUtils.mainHeader} style={{ fontSize: 22 }}>
                  {popupInfo.properties.addressFull.replace(", Finland", "")} |{" "}
                  {popupInfo.properties.surfaceArea} m<sup>2</sup>
                </h3>

                <div className={styleUtils.paragraph}>
                  <div style={{ marginTop: "10px", fontSize: 20 }}>
                    {popupInfo.properties.Bid.length}{" "}
                    {getPluralOrSingular(
                      popupInfo.properties.Bid.length,
                      "Tarjous",
                      "Tarjousta"
                    )}
                  </div>

                  <div style={{ marginTop: "10px", fontSize: 20 }}>
                    Ilmoitus luotu:{" "}
                    {getTimeElapsed(new Date(popupInfo.properties.createdAt))}
                  </div>

                  <div style={{ marginTop: "10px", fontSize: 20 }}>
                    Kohteen kunto: {popupInfo.properties.condition}
                  </div>
                </div>

                <div>
                  <Link href={`/ilmoitus/${popupInfo.properties.uuid}/tiedot`}>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "16px",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        color={BLUE_100}
                        fontSize={"14px"}
                        variant={"body2"}
                        fontWeight={"bold"}
                      >
                        Ilmoitukseen
                      </Typography>
                      <ExternalLinkIcon fill={BLUE_100} width={19} />
                    </Box>
                  </Link>
                </div>
              </div>
            </Popup>
          )}

          {clusters.map((item, i) => {
            const properties: any = item.properties || {};

            if (properties.cluster) {
              const children = supercluster?.getLeaves(item.id as number);
              const sqmAverage = calculateClusterPricePerSqm({
                items: children as ApartmentMapBoxFmt[],
              });

              const lat = item.geometry.coordinates[1];
              const lng = item.geometry.coordinates[0];
              const { point_count: pointCount } = properties;

              return (
                <Marker
                  longitude={lng}
                  key={i}
                  latitude={lat}
                  onClick={() => {
                    if (mapRef.current && supercluster !== undefined) {
                      const children = supercluster.getLeaves(
                        item.id as number
                      );

                      const expansionZoom =
                        supercluster.getClusterExpansionZoom(item.id as number);

                      mapRef.current.easeTo({
                        center: {
                          lng: lng,
                          lat: lat,
                        },
                        zoom: expansionZoom,
                        duration: calculateDuration({
                          startZoom: viewport.zoom,
                          targetZoom: expansionZoom,
                        }),
                      });

                      setTimeout(
                        () => {
                          setApartments(children as ApartmentMapBoxFmt[]);
                        },
                        calculateDuration({
                          startZoom: viewport.zoom,
                          targetZoom: expansionZoom,
                        })
                      );
                    }
                  }}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${
                        15 + (pointCount / apartments.features.length) * 20
                      }px`,
                      height: `${
                        15 + (pointCount / apartments.features.length) * 20
                      }px`,
                      background: sqmAverage > 9000 ? "green" : "red",
                      padding: "16px",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "50px",
                      color: "white",
                      fontSize: "18px",
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            } else {
              const lat = item.geometry.coordinates[1];
              const lng = item.geometry.coordinates[0];

              return (
                <Marker
                  longitude={lng}
                  latitude={lat}
                  key={i}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo(item as ApartmentMapBoxFmt);
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ color: "#F2BA18", textAlign: "center" }}>
                      $$
                    </span>
                    <CondoIcon width={35} fill={"red"} />
                  </div>
                </Marker>
              );
            }
          })}
        </Map>
      )}
    </div>
  );
}
