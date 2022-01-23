import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThreeReactWrapper } from '../pwa-tools/tools/ThreeReactWrapper';
import { AppRoutes, NavBar } from "../pwa-tools/utils/routing"

import { ForkniteDemo } from "./forknite-demo/ForkniteDemo"
import { LoadingScreen } from "../pwa-tools/tools/LoadingScreen"

import { BASENAME } from './config';
import "./styles.css"

// Entry point
const App = () => {
    return (
        <BrowserRouter basename={BASENAME}>
            <Routes >
                <Route path="/*" element={<Entries />} />
            </Routes>
        </BrowserRouter>
    );
}

/**
 * Index all apps here
 */
const Entries = () => {
    return (
        <div className="App">
            <NavBar />
            <div className="AppItems">
                <AppRoutes style={{ position: "absolute" }}>
                    <LoadingScreen />
                    <ThreeReactWrapper appClass={ForkniteDemo} />
                </AppRoutes>
            </div>
        </div>
    )
}

export default App