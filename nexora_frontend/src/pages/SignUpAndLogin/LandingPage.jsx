import { Link } from "react-router-dom";
import ThemeToggle from "../../Components/ThemeToggle";
function LandingPage() {
  return (
    <>
    <div >
    <div className="   fixed top-4 right-4 z-10 ">
          <ThemeToggle />
        </div>
      <div className="flex flex-col lg:flex-row justify-evenly    border-accent  rounded-2xl items-center min-h-screen">
        

        <div className="">
          <h1 className="text-[#0175FE] font-bold font-sans text-8xl ">
            Nexora
          </h1>
          <p className="tracking-wider mt-4 text-text1">
            A Nexus of Ideas, A Radiance of Potential
          </p>
          
          <div className="gap-1 flex flex-col md:flex-row w-fit ">
            <Link to="/signupForm">
              <button className="bg-[#0e7cf9] text-white mt-9 mr-4 p-3 px-4 rounded-lg cursor-pointer">
                Enter the Realm of Nexora
              </button>
            </Link>
            <Link to="/LoginForm">
              <button className="border-[#0175FE] border-3 text-[#0369de] mt-9 p-2.5 rounded-lg cursor-pointer">
                Your Nexora Awaits
              </button>
            </Link>
          </div>
        </div>
        <div className="sm:max-w-sm md:min-w-md md:max-w-md mt-10 md:m-0">
          <img
            src="/signUp_page_image.png"
            alt="Nexora"
            className="object-contain"
          />
        </div>
      </div>
      <div
        id="about"
        className="mt-30 p-6 bg-accent rounded-lg  max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-[#0175FE] mb-4">Why Nexora</h2>
        <p className="text-text1 text-lg md:text-xl leading-relaxed">
          Nexora is a vibrant learning ecosystem where curiosity meets
          creativity. Derived from <strong>nexus</strong> (connection) and{" "}
          <strong>aura</strong> (energy), Nexora empowers students to connect
          ideas, develop skills, and illuminate their potential. Here, every
          skill tells a story of tomorrow — whether you are learning, creating,
          or collaborating, Nexora is your launchpad to growth, innovation, and
          purpose. At Nexora, learning is more than acquiring knowledge — it's
          about exploring possibilities, experimenting fearlessly, and turning
          ideas into reality. Our platform encourages students to collaborate,
          share, and inspire, building a community where every interaction
          sparks insight and fuels progress.
        </p>
      </div>
      <h1 className="justify-center flex text-[#0175FE] text-4xl font-bold mt-20">
        Testimonials
      </h1>
      <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Testimonial 1 */}

        <div className="bg-accent p-6 rounded-xl shadow-lg flex flex-col items-start">
          <p className="text-text1 mb-4 text-lg">
            "Nexora transformed how I approach learning and building projects.
            Every skill I gained feels like a step towards my future."
          </p>
          <div className="flex items-center mt-auto">
            <div>
              <h4 className="font-bold text-[#0175FE]">Aria Sharma</h4>
              <p className="text-gray-500 text-sm">Web Development Student</p>
            </div>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div className="bg-accent p-6 rounded-xl shadow-lg flex flex-col items-start">
          <p className="text-text1 mb-4 text-lg">
            "The community at Nexora is incredible. Collaborating with peers and
            mentors has made learning exciting and meaningful."
          </p>
          <div className="flex items-center mt-auto">
            <div>
              <h4 className="font-bold text-[#0175FE]">Rohan Mehta</h4>
              <p className="text-gray-500 text-sm">AI & Data Science Learner</p>
            </div>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div className="bg-accent p-6 rounded-xl shadow-lg flex flex-col items-start ">
          <p className="text-text1 mb-4 text-lg">
            "Every project I completed at Nexora helped me gain confidence. It’s
            more than learning — it’s about creating impact."
          </p>
          <div className="flex items-center mt-auto">
            <div>
              <h4 className="font-bold text-[#0175FE]">Simran Kaur</h4>
              <p className="text-gray-500 text-sm">Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-30 flex justify-center">
        <h3 className="text-text">Engineered with intention — Arpith Paliwal</h3>
      </div>
      </div>
    </>
  );
}

export default LandingPage;
