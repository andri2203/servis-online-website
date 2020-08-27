import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import Pages from "../pages";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const { currentUser } = useContext(AuthContext)

    return (
        <Route
            {...rest}
            render={routeProps => {
                return !!currentUser ?
                    (<Pages index={rest.index} {...routeProps}><RouteComponent /></Pages>) : (
                        <Redirect to={"/login"} />
                    )
            }

            }
        />
    )
}

export default PrivateRoute