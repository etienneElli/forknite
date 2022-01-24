import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ThreeReactWrapper } from '../pwa-tools/tools/ThreeReactWrapper';
import { ForkniteDemo } from "./forknite-demo/ForkniteDemo"
// import { AppRoutes, NavBar } from "../pwa-tools/utils/routing"

import { BuildNum } from '../pwa-tools/UI/elements';
import { BASENAME } from './config';
import "../pwa-tools/pwa.css"
import "./styles.css"

// Entry point
const App = () => {
    return (
        <BrowserRouter basename={BASENAME}>
            <Routes >
                <Route index element={<Home />} />
                <Route path="/forknite" element={<ThreeReactWrapper appClass={ForkniteDemo} />} />
            </Routes>
        </BrowserRouter>
    );
}

const Home = () => {
    return (
        <div className="HomeScreen ">
            <div className="center">
                {/* <img src={logo} className="logo" alt="logo" /> */}
                <h1>
                    WELCOME
                </h1>
                <Link to={"/forknite"}> <h3 className="blink">Press to start</h3> </Link>
            </div>
            <BuildNum />
        </div>)
}

/**
 * Index all apps here
 */
// const Entries = () => {
//     return (
//         <div className="App">
//             <NavBar />
//             <div className="AppItems">
//                 <AppRoutes style={{ position: "absolute" }}>
//                     <LoadingScreen />
//                     <ThreeReactWrapper appClass={ForkniteDemo} />
//                 </AppRoutes>
//             </div>
//         </div>
//     )
// }

export default App