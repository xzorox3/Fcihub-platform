import React from "react";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa6";
import { FaApple } from "react-icons/fa";

// ✅ All image imports fixed to match actual file structure
import FooterImage from "../../assets/image/footer.jpeg";
import appstore from "../../assets/image/apps.png";
import googleplay from "../../assets/image/googleplay.png";

export default function Footer() {
  return (
    <footer
      className="max-w-none bg-cover bg-center bg-no-repeat relative h-[250px] z-0 overflow-hidden"
      style={{
        backgroundImage: `url(${FooterImage})`,
        filter: "brightness(65%)",
      }}
    >
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 container mx-auto px-10">
          <div className="text-white">
            <h6 className="text-xl font-semibold mb-4">
              Faculty of Computers and Information
            </h6>
            <p>The new College of Computers was</p>
            <p>established in 1997.</p>
          </div>
          <div className="text-white ml-36">
            <h6 className="text-xl font-semibold mb-4">Social Media</h6>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaFacebookSquare className="mr-2" />
                <p>Facebook</p>
              </li>
              <li className="flex items-center">
                <FaSquareTwitter className="mr-2" />
                <p>Twitter</p>
              </li>
              <li className="flex items-center">
                <FaLinkedin className="mr-2" />
                <p>LinkedIn</p>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-xl font-semibold text-white">
              Download Our Platform Now App
            </h6>
            <div className="text-white grid grid-cols-2 gap-2 justify-center items-center">
              <div>
                <a href="https://www.apple.com/app-store/">
                  <img
                    src={appstore}
                    alt="App Store"
                    className="w-[28rem] h-[9rem] object-contain"
                  />
                </a>
              </div>
              <div>
                <a href="https://play.google.com/store">
                  <img
                    src={googleplay}
                    alt="Google Play"
                    className="w-[28rem] h-[9rem] object-contain"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
