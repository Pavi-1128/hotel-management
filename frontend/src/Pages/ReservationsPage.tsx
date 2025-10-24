// import React from "react";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import room1 from "../assets/image2.jpg";
// import room2 from "../assets/image3.jpg";

// const ReservationsPage: React.FC = () => {
//   const role = "client";

//   return (
//     <div className="min-h-screen flex flex-col bg-white">
//       <Header role={role} />

//       {/* Header spacer */}
//       <div className="h-20" />

//       <main className="max-w-6xl mx-auto px-4 w-full pb-16">
//         {/* Top Bar */}
//         <section className="border rounded-md overflow-hidden shadow-sm">
//           <div className="bg-neutral-100 px-4 py-3 border-b">
//             <h2 className="font-semibold">Reservations</h2>
//           </div>
//           <div className="px-4 py-3 flex items-center justify-between text-sm">
//             <div className="flex items-center gap-3">
//               <span className="font-medium">1. Search</span>
//               <span className="text-neutral-500">Chennai - The Residency Towers Chennai</span>
//               <span className="text-neutral-500">16 Oct '25 - 17 Oct '25 | 1 Room, 1 Adult, 0 Children</span>
//             </div>
//             <button className="border px-3 py-1 rounded-md text-sm bg-white hover:bg-neutral-50">Modify</button>
//           </div>
//         </section>

//         {/* Step 2 header */}
//         <section className="mt-4 border rounded-md overflow-hidden shadow-sm">
//           <div className="bg-neutral-800 text-white px-4 py-3">
//             <span className="font-medium">2. Select Room (1 Adult, 0 Children)</span>
//           </div>

//           {/* Room card 1 */}
//           <div className="px-4 py-6">
//             <div className="grid grid-cols-1 md:grid-cols-[220px,1fr,200px] gap-6 items-start">
//               <img src={room1} alt="Premier Room" className="w-full h-[140px] object-cover rounded" />
//               <div>
//                 <h3 className="text-xl font-semibold">Premier Rooms</h3>
//                 <p className="text-sm text-neutral-600 mt-1">Room Size : 290 sq. ft.</p>

//                 {/* Tabs */}
//                 <div className="mt-4 flex border-b text-sm">
//                   <button className="px-4 py-2 border-x first:border-l rounded-t bg-white">Rates</button>
//                   <button className="px-4 py-2 border-x -mb-px">Amenities</button>
//                   <button className="px-4 py-2 border-x -mb-px">Photos</button>
//                 </div>

//                 {/* Description */}
//                 <div className="mt-4 text-sm leading-6 text-neutral-700">
//                   The Premier Rooms in Chennai present a luxurious haven for a group of 3. These fully-automated rooms come
//                   with avant-garde facilities including a minibar, exclusive toiletries, a Nespresso coffee maker, round-the-clock
//                   room service, laundry facilities, high speed internet access, breakfast, a spacious wardrobe, sofas and an in-room safe.
//                 </div>

//                 {/* Features */}
//                 <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
//                   <ul className="space-y-1">
//                     <li>✓ Fully-automated Rooms</li>
//                     <li>✓ Air-conditioning</li>
//                     <li>✓ Telephone</li>
//                     <li>✓ Minibar</li>
//                     <li>✓ 24-hour Room Service</li>
//                     <li>✓ Weighing Scale</li>
//                   </ul>
//                   <ul className="space-y-1">
//                     <li>✓ Toto Neorest (EWC)</li>
//                     <li>✓ Wi-Fi Internet Access</li>
//                     <li>✓ Tea & Coffee Maker</li>
//                     <li>✓ Mineral Water Bottle</li>
//                     <li>✓ Laundry Service</li>
//                   </ul>
//                   <ul className="space-y-1">
//                     <li>✓ Nespresso Coffee Maker</li>
//                     <li>✓ Television</li>
//                     <li>✓ Breakfast</li>
//                     <li>✓ Wardrobe</li>
//                     <li>✓ In-room Safe</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="md:text-right">
//                 <div className="text-xs line-through text-neutral-400">₹9,500</div>
//                 <div className="text-[#9C7B45] font-semibold text-lg">₹7,600 INR / Night</div>
//                 <div className="text-[11px] text-neutral-500 mt-1">Plus ₹1,739.36 in Taxes and Fees/Night</div>
//                 <div className="text-xs text-neutral-700 mt-2">Total ₹9,237.04 for 1 Night</div>
//                 <button className="mt-4 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-neutral-800">View Rates</button>
//               </div>
//             </div>
//           </div>

//           <hr />

//           {/* Room card 2 */}
//           <div className="px-4 py-6">
//             <div className="grid grid-cols-1 md:grid-cols-[220px,1fr,200px] gap-6 items-start">
//               <img src={room2} alt="Premier Highrise Room" className="w-full h-[140px] object-cover rounded" />
//               <div>
//                 <h3 className="text-xl font-semibold">Premier Highrise Rooms</h3>
//                 <p className="text-sm text-neutral-600 mt-1">Room Size : 290 sq. ft.</p>
//               </div>
//               <div className="md:text-right">
//                 <div className="inline-block bg-rose-100 text-rose-600 text-xs px-2 py-1 rounded">In high demand! Only 4 rooms left</div>
//                 <div className="text-xs line-through text-neutral-400 mt-2">₹11,000</div>
//                 <div className="text-[#9C7B45] font-semibold text-lg">₹8,000 INR / Night</div>
//                 <div className="text-[11px] text-neutral-500 mt-1">Plus ₹2,013.99 in Taxes and Fees/Night</div>
//                 <div className="text-xs text-neutral-700 mt-2">Total ₹10,695.52 for 1 Night</div>
//                 <button className="mt-4 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-neutral-800">View Rates</button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default ReservationsPage;


