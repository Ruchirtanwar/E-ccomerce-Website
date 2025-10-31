import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetterBox from '../components/NewsLetterBox'
const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src={assets.about_img}
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis eos
            quasi earum quia dolorum ab inventore vel delectus ipsum. Suscipit
            est laborum omnis fugiat dolorum dignissimos. Magnam ipsum officiis
            sed.lorem Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Minus, accusantium? Possimus nesciunt reprehenderit voluptatum minus
            perferendis consequatur voluptate atque? Nisi quo aut maiores minus
            asperiores, possimus fugit illo ab doloremque.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            voluptas porro deserunt enim iste dicta praesentium, modi dolor?
            Numquam quis porro illum impedit architecto sapiente corporis dolor
            sit sequi iure? Eum repellat sunt officiis ullam magni fugit maiores
            rerum, repellendus soluta. Mollitia odio sed maiores placeat maxime
            enim quos ab accusantium voluptatum? Quibusdam eos officiis sapiente
            ipsa saepe dicta necessitatibus.
          </p>
          <b className="text-gray-800">Our MIssion</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
            quibusdam esse obcaecati dolorem nisi eaque numquam dolor at magni
            sapiente ipsam similique, delectus odit placeat consectetur
            doloribus iusto corporis sequi?
          </p>
        </div>
      </div>
      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            beatae, vitae earum quae sunt magnam cum veniam ex ipsa alias
            perspiciatis quos cupiditate nobis laudantium maiores velit ut nisi
            labore.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Conveninece:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            beatae, vitae earum quae sunt magnam cum veniam ex ipsa alias
            perspiciatis quos cupiditate nobis laudantium maiores velit ut nisi
            labore.
          </p>
        </div>

        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
            beatae, vitae earum quae sunt magnam cum veniam ex ipsa alias
            perspiciatis quos cupiditate nobis laudantium maiores velit ut nisi
            labore.
          </p>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  );
};

export default About;
