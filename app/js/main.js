var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var AppScope = require('./components/app_scope');
var Login = require('./components/login');
var User = require('./components/user');

var routes = (
    <Route handler={AppScope}>
        <Route name="users" path="/users/:userId" handler={User} />
        <DefaultRoute handler={Login}/>
    </Route>
);

window.onload = function() {
    
    Router.run(routes, function(Handler) {
        React.render(<Handler/>, document.querySelector('.dom-content'));
   });

}
