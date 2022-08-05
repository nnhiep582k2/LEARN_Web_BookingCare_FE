import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Navigator from '../../components/Navigator';
import { adminMenu, doctorMenu } from './menuApp';
import './Header.scss';
import { LANGUAGES, USER_ROLE } from '../../utils';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        };  
    }
    
    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if(userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleId;
            if(role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            else if(role === USER_ROLE.DOCTOR) {
                menu = doctorMenu;
            }
        }
        this.setState({
            menuApp: menu,
        });
    }

    render() {
        const { processLogout, language, userInfo } = this.props;

        return (
            <div className="header-container">
                {/* thanh navigator */}
                <div className="header-tabs-container">
                    <Navigator menus={this.state.menuApp} />
                </div>

                <div className="languages">
                    <span className="welcome">
                        <FormattedMessage id='home-header.welcome' />, {userInfo && userInfo.firstName ? userInfo.firstName : 'No one'} !
                    </span>
                    <span 
                        className={language === LANGUAGES.VI ? 'languages-vi active' : 'languages-vi'}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.VI)}
                    >VI</span>
                    <span 
                        className={language === LANGUAGES.EN ? 'languages-en active' : 'languages-en'}
                        onClick={() => this.handleChangeLanguage(LANGUAGES.EN)}
                    >EN</span>
                    {/* nút logout */}
                    <div className="btn btn-logout" onClick={processLogout} title="Logout" >
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
