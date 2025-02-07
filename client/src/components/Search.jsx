import { IoSearch } from "react-icons/io5";
import React from 'react'
import { TypeAnimation } from 'react-type-animation';


const Search = () => {
  return (
    <div className="w-full min-w-[300px] lg:min-w-[420px] h-12 rounded-lg border overflow-hidden flex items-center text-neutral-600">
      <button className="flex items-center h-full px-4 text-neutral-600  ">
      <IoSearch size={22}/>
      </button>
      <div>
            <TypeAnimation
        sequence={[
          'Discover the power of ThinkPad',
          1000,
          'Experience the flexibility of Yoga',
          1000,
          'Unleash creativity with IdeaPad',
          1000,
          'Find your perfect laptop today!',
          1000
        ]}
        wrapper="span"
        speed={50}
        repeat={Infinity}
      />
      </div>
    </div>
  )
}

export default Search
