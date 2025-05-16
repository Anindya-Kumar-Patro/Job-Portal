import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";

const Navbar = () => {
  return (
    <>
      <div className="bg-white">
        <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
          <div>
            <h1 className="text-2xl font-bold">
              Job<span className="text-[#F83002]">Portal</span>
            </h1>
          </div>
          <div className="flex gap-12">
            <ul className="flex font-medium items-center gap-5">
              {/* <li><Link>Home</Link></li>
              <li><Link>Jobs</Link></li>
              <li><Link>Browse</Link></li> */}
              <li>Home</li>
              <li>Jobs</li>
              <li>Browse</li>
            </ul>
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-4 space-y-2">
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                </Avatar>
                
                </div>
                <div>
                <h4 className="font-medium">Anindya Kumar Patro</h4>
                <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit, amet consectetur adipisicing elit</p>
                </div>

                <div className="flex flex-col gap-3 text-gray-600">
                 <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <Button variant="link">View Profile</Button>
                  </div>
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <Button variant="link">Logout</Button>
                  </div>
                 
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
