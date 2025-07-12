import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import LeaderCard from '../Card/Card'; // Your styled card component

const leaders = [
  {
    name: "Leader Name",
    career: "His Career",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    name: "Leader Name",
    career: "His Career",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Leader Name",
    career: "His Career",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  // Add more as needed
];

const LeaderSlider = () => {
  return (
    <div className="w-full py-10 px-4 md:px-10 bg-[#f9fbfd] dark:bg-gray-900">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Leaders</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
        className="w-full"
      >
        {leaders.map((leader, index) => (
          <SwiperSlide key={index}>
            <LeaderCard
              name={leader.name}
              career={leader.career}
              image={leader.image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LeaderSlider;
