import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import '../styles/slider.css'

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

export default function App({ products }) {

  return (
    <>
      <Swiper
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1.5,
            spaceBetween: 20,
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 2.5,
            spaceBetween: 30,
          },
          // when window width is >= 1024px
          1024: {
            slidesPerView: 5.5,
            spaceBetween: 30,
          },
        }}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
      >
        {products.filter(product => product.available === true).map((product) => (
          <SwiperSlide key={product._id} className='slider' onClick={() => window.location.href = `/product/${product.id}`}>
            <img src={product.img} className='slider-img' />
            <p>{product.name}</p>
            <h3>{product.price}</h3>
            <p>{product.subCategory.name}</p>
            <br /><br /><br />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
