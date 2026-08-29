import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HotelCards from "./HotelCards";

const HotelCarousel = ({ hotels }) => {
  if (!hotels?.length) return null;

  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      slidesPerView={1.15}
      breakpoints={{
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 3.2 },
        1280: { slidesPerView: 4 },
      }}
      className="!pb-2"
    >
      {hotels.map((hotel) => (
        <SwiperSlide key={hotel._id}>
          <HotelCards hotel={hotel} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HotelCarousel;
