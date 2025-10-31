import React from 'react'

const NewsLetterBox = () => {
const    onsubmitHandler =(event)=>{
        event.preventDefault();
        console.log('form submitted from newsLetterbox page')
    }
  return (
    <div className='text-center'>
<p className='text-2xl font-medium text-gray-800 '>Subscribe now & get 20% off</p>
<p className='text-gray-400  mb-3'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga sint esse voluptates cum deserunt, amet quasi exercitationem aut? Quis delectus asperiores nulla deserunt eum consequuntur nihil illo ullam natus veniam.</p>
   <form onSubmit={onsubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 my-6 border pl-3 mx-auto '>
   <input type="email" placeholder='Enter Your Email' required  className='w-full sm:flex-1 outline-none '/>
   <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
   </form>
    </div>
  )
}

export default NewsLetterBox