// import React from "react";

// const Footer: React.FC = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-300 mt-10">
//       <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div>
//           <div className="w-10 h-10 rounded-full bg-amber-600 text-white grid place-items-center font-bold mb-3">R</div>
//           <p className="text-sm opacity-80">The Residency Hotels & Resorts</p>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
//           <ul className="space-y-2 text-sm">
//             <li>Our Hotels</li>
//             <li>Meetings & Events</li>
//             <li>Offers</li>
//           </ul>
//         </div>
//         <div>
//           <h4 className="font-semibold mb-3 text-white">Contact</h4>
//           <p className="text-sm opacity-80">support@residency.example</p>
//           <p className="text-sm opacity-80">+91 00000 00000</p>
//         </div>
//       </div>
//       <div className="border-t border-white/10">
//         <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-400">© 2025 The Residency. All rights reserved.</div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#C1A16B] text-[#4B3B2B] mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div>
          <div className="w-10 h-10 rounded-full bg-[#9C7B45] text-white grid place-items-center font-bold mb-3">R</div>
          <p className="text-sm opacity-90">The Residency Hotels & Resorts</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3 text-[#4B3B2B]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-[#9C7B45] cursor-pointer transition-colors">Our Hotels</li>
            <li className="hover:text-[#9C7B45] cursor-pointer transition-colors">Meetings & Events</li>
            <li className="hover:text-[#9C7B45] cursor-pointer transition-colors">Offers</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3 text-[#4B3B2B]">Contact</h4>
          <p className="text-sm opacity-90">support@residency.example</p>
          <p className="text-sm opacity-90">+91 00000 00000</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#9C7B45]/20">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-[#4B3B2B]">
          © 2025 The Residency. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
