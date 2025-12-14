const NavLinkClass = ({ isActive }) => {
  return `
    relative flex items-center gap-2 font-medium transition-colors duration-300
    ${isActive ? "text-purple-600" : "text-gray-700 hover:text-purple-600"}

    after:content-['']
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:bg-purple-600
    after:w-0
    after:transition-all
    after:duration-300
    hover:after:w-full

    ${isActive ? "after:w-full" : ""}
  `;
};

export default NavLinkClass;
