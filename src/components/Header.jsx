import { Link } from "react-router-dom";
import Search from "./Search";
import Drawer from "./Drawer";

const Header = () => {
  return (
    <div className="sticky top-0 bg-white z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6 py-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <Link to="/">
          <h1 className="text-xl font-bold">{process.env.REACT_APP_TITLE}</h1>
        </Link>
      </div>

      <div className="flex flex-row w-full sm:w-2/3 justify-end gap-5">
        <Search />
        <Drawer />
      </div>
    </div>
  );
}

export default Header;