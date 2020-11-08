import React from "react"
import App1 from "../components/App1"
import {Helmet} from "react-helmet";

const Page1 = () => {
    return (
        <>
        <Helmet>
            <title>Weather | nDsBuilding</title>
        </Helmet>
        <App1/>
        </>
    )
}
export default Page1