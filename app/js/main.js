var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

var AppScope = require('./components/app_scope');
var Login = require('./components/login');
var User = require('./components/user');
var UserList = require('./components/user_list');


var routes = (
    <Route handler={AppScope}>
        <Route name="users" path="/users/:userId" handler={User} />
        <Route name="user_list" path="/user_list/:lat/:lng/:radius" handler={UserList} />
        <DefaultRoute handler={Login}/>
    </Route>
);

window.onload = function() {
    
    Router.run(routes, function(Handler) {
        React.render(<Handler/>, document.querySelector('.dom-content'));
   });

}
