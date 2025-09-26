import heroImg from "../../assets/Hero3.jpg"
import { Link } from "react-router-dom"

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="Rabbit"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      
      <div className="absolute inset-0  bg-opacity-30 flex items-end justify-center pb-18 md:pb-10">
        <div className="text-center text-white p-6 max-w-4xl">
          <h1 className="text-5xl md:text-10xl lg:text-9xl font-bold tracking-tight uppercase mb-0 text-yellow-300 drop-shadow-2xl ">
            Vacation <br /> Ready
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white drop-shadow-lg bg-black bg-opacity-40 px-4 py-2 rounded-lg">
            Explore our vacation-ready outfits with fast worldwide shipping.
          </p>
          
          <Link
            to="#"
            className="bg-white text-gray-950 px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-300 transition duration-300 shadow-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero