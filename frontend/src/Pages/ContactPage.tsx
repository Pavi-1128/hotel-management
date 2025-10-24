import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import hero from "../assets/image4.jpg";

const ContactPage: React.FC = () => {
  const role = "client";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header role={role} />

      {/* Title */}
      <section className="pt-28 pb-10">{/* header spacer */}
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl text-center font-serif">Hotel in Rameswaram</h1>
        </div>
      </section>

      {/* Image */}
      <section>
        <div className="max-w-4xl mx-auto px-6">
          <img src={hero} alt="The Residency Towers Rameswaram" className="w-full rounded-sm shadow" />
        </div>
      </section>

      {/* Address and details */}
      <section>
        <div className="max-w-3xl mx-auto px-6 py-8 text-center space-y-2">
          <h3 className="text-[#9C7B45] font-medium">The Residency Towers Rameswaram</h3>
          <p className="text-sm text-neutral-700">Madurai Dhanushkodi Road,</p>
          <p className="text-sm text-neutral-700">Rameswaram - 623 526, India</p>
        </div>
        <div className="max-w-3xl mx-auto px-6 pb-16 text-center space-y-3">
          <p className="text-sm"><span className="font-medium">Mr.T.VRAJESH KUMAR</span> - HOTEL MANAGER</p>
          <p className="text-sm">Mobile : +91 89255 28250 &nbsp; Email : t.vrajesh@theresidency.com</p>
          <p className="text-sm">Phone: +91 452 123456 &nbsp; | &nbsp; +91 89255 28250</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;


