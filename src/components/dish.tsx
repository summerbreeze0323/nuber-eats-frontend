import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IDishProps {
  id?: number,
  name: string;
  price: number;
  description: string;
  isCustomer?: boolean;
  orderStarted?: boolean;
  isSelected?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  price,
  description,
  isCustomer = false,
  orderStarted = false,
  options,
  isSelected,
  addItemToOrder,
  removeFromOrder,
}) => {
  // console.log(options)
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };


  return (
    <div
      className={`px-8 py-4 border cursor-pointer transition-all ${isSelected ? 'border-gray-800' : 'hover:border-gray-800'}`}
      onClick={onClick}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          {options?.map((option, index) => (
            <span key={index} className="flex item-center">
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}