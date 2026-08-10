// import { Outlet } from "react-router-dom";
// import ShoppingHeader from "./header";

// function ShoppingLayout() {
//     return(
//         <div className="flex flex-col bg-white overflow-hidden ">
//             {/* common headder*/}

//             <ShoppingHeader/>
//             <main className="flex flex-col w-full">
//                 <Outlet/>

//             </main>

//         </div>
//     )
// }

// export default ShoppingLayout;

// import { Outlet } from "react-router-dom";
// import ShoppingHeader from "./header";

// function ShoppingLayout() {
//   return (
//     <div className="min-h-screen w-full">
//       <ShoppingHeader />

//       <main className="w-full">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default ShoppingLayout;

import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;