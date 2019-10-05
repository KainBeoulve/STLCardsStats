import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import {
    ConfirmSignIn,
    SignIn,
    RequireNewPassword,
    VerifyContact,
    withAuthenticator
} from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';
import Analytics from '@aws-amplify/analytics';
import PlayerDetailsPage from "src/js/pages/PlayerDetailsPage";
import PlayerSelectPage from "src/js/pages/PlayerSelectPage";

Analytics.configure({ disabled: true});
Auth.configure({
    region: 'us-east-1',
    userPoolId: 'us-east-1_OBTaMqcJV',
    userPoolWebClientId: '7l2sb4mqghr6fil1hmaj5k1e0b'
});

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route path="/" exact component={PlayerSelectPage}/>
            <Route
                path={"/player/:playerName"}
                render={({ history, location, match }) => (
                    <PlayerDetailsPage
                        key={match.params.playerName}
                        history={history}
                        location={location}
                        match={match}
                    />
                )}
            />
            <Route component={PlayerSelectPage}/>
        </Switch>
    </BrowserRouter>
);

export default withAuthenticator(
    Router, {
        includeGreetings: false,
        authenticatorComponents: [<SignIn/>, <ConfirmSignIn/>, <RequireNewPassword/>, <VerifyContact/>],
    }
);