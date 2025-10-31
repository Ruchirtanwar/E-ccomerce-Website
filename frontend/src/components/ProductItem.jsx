// import React, { useContext } from 'react'
// import { Link } from 'react-router-dom'
// import { ShopContext } from '../context/ShopContext'

// const ProductItem = ({name,image,price,id}) => {
//     const {currency}= useContext(ShopContext)
//   return (
//    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
//     <div className='overflow-hidden'>
//         <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
//     </div>
//     <p className='pt-3 pb-1 text-sm'>{name}</p>
//     <p className='text-sm font-medium'>{currency}{price}</p>
//    </Link>
//   )
// }

// export default ProductItem
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const ProductItem = ({ name, image, price, id }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link
      to={`/product/${id}`}
      className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white text-gray-800"
    >
      <div className="overflow-hidden aspect-square">
        <img
          src={image[0]}
          alt={name}
          className="w-full hover:scale-110  h-full object-cover transform  transition-transform duration-300 ease-in-out"
        />
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold mb-1 line-clamp-2">{name}</p>
        <p className="text-sm font-bold text-gray-900">{currency}{price}</p>
      </div>
    </Link>
  );
};

export default ProductItem;
