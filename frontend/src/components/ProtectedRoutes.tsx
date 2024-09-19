import {Navigate, Outlet} from "react-router-dom"
import {AppUser} from "../model/AppUser.ts";

type ProtectedRoutesProps = {
    user: AppUser |null |undefined
}


export default function ProtectedRoutes(props: ProtectedRoutesProps) {


    if (props.user === undefined) {
        return <div>Loading...</div>
    }
    return props.user ? <Outlet/> : <Navigate to={"/login"}/>;
}