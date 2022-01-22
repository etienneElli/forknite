import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThreeReactWrapper } from '../pwa-tools/tools/ThreeReactWrapper';
import { AppRoutes, NavBar } from "../pwa-tools/utils/routing"

import { ForkniteDemo } from "./forknite-demo/ForkniteDemo"
import { LoadingScreen } from "./forknite-demo/LoadingScreen"

import { BASENAME } from './config';


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
                <ThreeReactWrapper appClass={ForkniteDemo} />
            </AppRoutes>
        </>
    )
}

export default App