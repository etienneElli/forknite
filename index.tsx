import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ThreeReactWrapper } from '../pwa-tools/tools/ThreeReactWrapper';
import { ForkniteDemo } from "./forknite-demo/ForkniteDemo"
// import { AppRoutes, NavBar } from "../pwa-tools/utils/routing"

import { BASENAME } from './config';
import "./styles.css"
import "../pwa-tools/pwa.css"

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
                <Link to={"/forknite"}> <h3>Press to start</h3> </Link>
            </div>
            <div className="bottom right">
                {/* <img src={logo} className="logo" alt="logo" /> */}
                <code style={{ fontSize: "small" }}>build number: {process.env.REACT_APP_BUILD_NUM}</code>
            </div>
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