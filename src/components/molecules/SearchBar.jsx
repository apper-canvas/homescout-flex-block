import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchBar = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Enter city, neighborhood, or ZIP code",
  className 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="flex">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="pr-12 py-4 text-lg rounded-r-none border-r-0 focus:z-10"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ApperIcon name="MapPin" size={20} className="text-gray-400" />
          </div>
        </div>
        
        <Button 
          type="submit"
          variant="primary"
          className="rounded-l-none px-6 py-4"
        >
          <ApperIcon name="Search" size={20} />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;