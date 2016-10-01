import React, {Component} from 'react';
import {auth} from "../api";
import {withRouter} from "react-router";

class LoginView extends Component {

    state = {
        error: null
    };

    handleSubmit(e) {
        e.preventDefault();
        auth.login(this.refs.login.value, this.refs.password.value).then(response => {
            console.log('after auth');
            const { location } = this.props;

            if (location.state && location.state.nextPathname) {
                this.props.router.replace(location.state.nextPathname)
            } else {
                this.props.router.replace('/')
            }
        })
    }

    render() {
        return (
            <div className="box box-info">
                <div className="box-header with-border">
                    <h3 className="box-title">Sign in</h3>
                </div>
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="box-body">
                        <div className="form-group">
                            <label for="inputEmail3" className="col-sm-2 control-label">Username</label>

                            <div className="col-sm-10">
                                <input ref="login" type="text"  className="form-control" id="inputEmail3" placeholder="username" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="inputPassword3" className="col-sm-2 control-label">Password</label>

                            <div className="col-sm-10">
                                <input ref="password" type="password" className="form-control" id="inputPassword3" placeholder="Password" />
                            </div>
                        </div>
                    </div>

                    <div className="box-footer">
                        {/*<button type="submit" className="btn btn-default">Cancel</button>*/}
                        <button type="submit" className="btn btn-info pull-right">Sign in</button>
                    </div>

                </form>
            </div>
        )
    }
}

export default withRouter(LoginView);
