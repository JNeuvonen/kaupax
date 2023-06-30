import { Apartment } from "@/utils/types/apartment";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./pictures.module.css";
import { ChevronLeft } from "@/utils/icons";

interface Props {
  apartment: Apartment;
}

export default function Pictures({ apartment }: Props) {
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [currSlide, setCurrSlide] = useState(0);

  if (apartment.Picture.length === 0) {
    return (
      <div className={styles.container}>
        Ilmoitukseen ei ole vielä lisätty kuvia.
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <div>
          {currSlide + 1} / {apartment.Picture.length}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            onClick={() => {
              swiperInstance.slidePrev();
            }}
            style={{
              opacity: currSlide === 0 ? 0.5 : 1,
              cursor: currSlide === 0 ? "default" : "pointer",
            }}
          >
            <ChevronLeft width={25} fill={"#CCCCCC"} />
          </div>
          <div
            onClick={() => {
              swiperInstance.slideNext();
            }}
            style={{
              opacity: currSlide === apartment.Picture.length - 1 ? 0.5 : 1,
              cursor:
                currSlide === apartment.Picture.length - 1
                  ? "default"
                  : "pointer",
            }}
          >
            <ChevronLeft
              width={25}
              fill={"#CCCCCC"}
              style={{
                transform: "rotate(180deg)",
              }}
            />
          </div>
        </div>
      </div>
      <Swiper
        style={{
          overflow: "hidden !important",
        }}
        pagination={{ clickable: true }}
        slidesPerView={1}
        spaceBetween={15}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        onSlideChange={(swiper) => {
          setCurrSlide(swiper.activeIndex);
        }}
      >
        {apartment.Picture.map((item, i) => {
          return (
            <SwiperSlide
              key={i}
              style={{
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <img
                src={item}
                alt={`image ${i}`}
                width={"100%"}
                height={"auto"}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
