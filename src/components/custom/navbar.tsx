import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "@/utils/theme-provider";
import { Moon, Sun, Settings, Bell, ClipboardCheck, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface MyToken {
    sub: string,
    role: string,
    iat: number,
    exp: number,
    employeeId: number
}

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the mobile menu visibility
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const toggleTheme = () => {
        if (theme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };

    const token = localStorage.getItem("jwt");
    const user = jwtDecode<MyToken>(token ? token : "");

    const notifications = useSelector((state: RootState) => state.notification.notifications);

    return (
        <div className="sticky z-10 top-0 backdrop-blur-lg flex justify-between items-center px-4 sm:px-20 py-2">
            <div className="flex items-center justify-between w-full">
                {/* Logo or Brand Name */}
                <div className="text-xl sm:text-4xl">
                    {user.role === "ROLE_Admin" ? "bsheets" : (
                        <Link to="/" className="text-4xl">
                            BS
                        </Link>
                    )}
                </div>

                {/* Menu Items (Hidden on Small Screens) */}
                <div className={`lg:flex items-center gap-4 hidden flex-col lg:flex-row`}>
                    {user.role !== "ROLE_Admin" && (
                        <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                            <ClipboardCheck />
                        </Button>
                    )}

                    {user.role === "ROLE_Manager" && (
                        <Button variant="outline" size="sm" onClick={() => navigate("/manage")}>
                            <Settings />
                        </Button>
                    )}

                    {/* Notification Panel */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Bell />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle>Notification Panel</SheetTitle>
                                <SheetDescription>No new notifications</SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>

                    {/* Theme Toggle Button */}
                    <Button variant="outline" size="sm" onClick={toggleTheme}>
                        {theme === "dark" ? (
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        ) : (
                            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        )}
                    </Button>

                    {/* Log Out Button */}
                    <Button variant="secondary" size="sm">
                        <LogOut />
                    </Button>
                </div>
            </div>
            {/* Conditional Rendering of Mobile Menu */}
            {
                <Sheet>
                    <SheetTrigger asChild>
                        {/* Hamburger Menu for Small Screens */}
                        <div className="lg:hidden flex items-center">
                            <Button variant="outline" size="sm" onClick={toggleMenu}>
                                <Menu />
                            </Button>
                        </div>
                    </SheetTrigger>
                    <SheetContent side="top" className="flex flex-wrap items-start">
                        <SheetTitle className="w-full">Navigation Menu</SheetTitle>
                        <SheetDescription className="w-full"></SheetDescription>
                        {user.role !== "ROLE_Admin" && (
                            <Button variant="outline" size="sm" onClick={() => navigate("/tasks")}>
                                <ClipboardCheck /> Tasks
                            </Button>
                        )}

                        {user.role === "ROLE_Manager" && (
                            <Button variant="outline" size="sm" onClick={() => navigate("/manage")}>
                                <Settings /> Manage Tasks
                            </Button>
                        )}

                        {/* Notification Panel */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Bell /> Notifications
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="overflow-y-auto">
                                <SheetHeader>
                                    <SheetTitle>Notification Panel</SheetTitle>
                                    <SheetDescription>No new notifications</SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>

                        {/* Theme Toggle Button */}
                        <Button variant="outline" size="sm" onClick={toggleTheme}>
                            {theme === "dark" ? (
                                <Fragment>
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span>Light Mode</span>
                                </Fragment>
                            ) : (
                                <Fragment>
                                    <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <span>Dark Mode</span>
                                </Fragment>
                            )}
                        </Button>

                        {/* Log Out Button */}
                        <Button variant="secondary" size="sm">
                            <LogOut /> Log out
                        </Button>
                    </SheetContent>
                </Sheet>
            }
        </div>
    );
}
