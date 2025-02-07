import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";

const Header = () => {
    return (
        <header className="h-20 shadow-md sticky top-0">
            <div className="container mx-auto flex items-center h-full px-10 justify-between">
                {/**logo */}
                <div className="h-full">
                    <div className="h-full flex justify-center items-center">
                        <img src={logo} width={170} height={60} alt="logo" />
                    </div>
                </div>
                {/**search */}
                <div>
                    <Search/>
                </div>

                {/**login and my cart */}
                <div>Login and my cart</div>
            </div>
        </header>
    );
};

export default Header;
