import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import '../styles/slider.css'

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

export default function App({ categories }) {

  return (
    <>
      <Swiper
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 5,
            spaceBetween: 30,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 6,
            spaceBetween: 30,
          },
        }}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
      >
        {categories.filter(category => category.type === 'category').map((category) => (
          <SwiperSlide key={category._id} className='slider slider-categories' onClick={() => window.location.href = `/category/${category.name}`}>
            <p>{category.name}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
