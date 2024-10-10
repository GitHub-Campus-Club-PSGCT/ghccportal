"use client";
import React from "react";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className="w-full py-8 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-300">Credits</h3>
            <p className="text-gray-400">©GitHub Campus Club PSGTECH</p>
            <p className="text-gray-400 mt-2">©2024</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-300">Menu</h3>
            <ul className="space-y-1">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className={`
                      text-gray-400 hover:text-white
                      transition-colors duration-200
                      ${pathname === item.href ? "font-bold" : ""}
                    `}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-300">Contact</h3>
            <a
              className="text-gray-400 hover:text-white transition-colors duration-200 break-all"
              href="mailto:githubcampusclubpsgct@gmail.com"
            >
              githubcampusclubpsgct@gmail.com
            </a>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-300">Socials</h3>
            <ul className="space-y-1">
              {Object.entries(siteConfig.links).map(([key, value]) => (
                <li key={key}>
                  <Link
                    className="
                      text-gray-400 hover:text-white
                      transition-colors duration-200
                    "
                    href={value}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
