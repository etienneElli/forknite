import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BASENAME } from './config';

import { ForkniteDemo } from "./forknite-demo/ForkniteDemo"
import { LoadingScreen } from "./forknite-demo/LoadingScreen"
import { ThreeAppWrapper } from "../pwa-tools/tools/ThreeAppWrapper"
import { AppRoutes, NavBar } from "../pwa-tools/utils/routing"

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
        <>
            <NavBar />
            <AppRoutes>
                <LoadingScreen />
                <ThreeAppWrapper appClass={ForkniteDemo} />
            </AppRoutes>
        </>
    )
}

export default App