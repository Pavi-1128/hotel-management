import React, { useState } from "react";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isActive: boolean;
}

interface ServiceCardProps {
  service: Service;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  initialQuantity?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onQuantityChange, 
  initialQuantity = 0 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(0, newQuantity);
    setQuantity(validQuantity);
    onQuantityChange(service._id, validQuantity);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTotalPrice = () => {
    return quantity * service.price;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Service Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={service.image || "/api/placeholder/300/200"}
          alt={service.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Service Content */}
      <div className="p-4">
        {/* Service Title */}
        <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
          {service.name}
        </h3>

        {/* Service Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* View Details Link */}
        <button className="text-[#C1A16B] text-sm font-medium hover:text-[#9C7B45] transition-colors mb-4">
          View Details
        </button>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={quantity <= 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="p-2 hover:bg-gray-100 rounded-r-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pricing Information */}
        <div className="space-y-1">
          {quantity > 0 ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {formatPrice(service.price)} x {quantity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="font-bold text-lg text-[#C1A16B]">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(service.price)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
