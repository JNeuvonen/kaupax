import { useListing } from "@/context/Map/apartment";
import {
  calculateClusterPricePerSqm,
  calculateDuration,
} from "@/utils/functions";
import { CondoIcon } from "@/utils/icons";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  ApartmentMapBoxFmtFuncRet,
  ListingMapBoxFmt,
} from "@/utils/types/listing";

import { useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker } from "react-map-gl";
import useSupercluster from "use-supercluster";
import GeocoderControl from "./GeocoderControl";

interface Viewport {
  latitude: number | undefined;
  longitude: number | undefined;
  zoom: number;
}

interface Props {
  listings: ApartmentMapBoxFmtFuncRet;
}

export default function MapWrapper({ listings }: Props) {
  const listingContext = useListing();
  const [viewport, setViewport] = useState({
    latitude: undefined,
    longitude: undefined,
    zoom: 10,
  } as Viewport);
  const mapRef = useRef<MapRef>(null);

  const bounds: any = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : [-180, -85, 180, 85];

  const { clusters, supercluster } = useSupercluster({
    points: listings.features !== undefined ? listings.features : [],
    zoom: viewport.zoom,
    bounds: bounds,
  });

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
    listingContext.setApartments(listings);
  };

  return (
    <div>
      {viewport.latitude !== undefined && viewport.longitude !== undefined && (
        <Map
          initialViewState={viewport}
          onMove={mapOnMove}
          {...viewport}
          style={{
            width: "100%",
            minHeight: "400px",
            height: "100vh",
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
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
          {clusters.map((item, i) => {
            const properties: any = item.properties || {};

            if (properties.cluster) {
              const children = supercluster?.getLeaves(item.id as number);
              const sqmAverage = calculateClusterPricePerSqm({
                items: children as ListingMapBoxFmt[],
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
                          listingContext.setApartments(
                            children as ListingMapBoxFmt[]
                          );
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
                        15 + (pointCount / listings.features.length) * 20
                      }px`,
                      height: `${
                        15 + (pointCount / listings.features.length) * 20
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
                <Marker longitude={lng} latitude={lat} key={i}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
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
