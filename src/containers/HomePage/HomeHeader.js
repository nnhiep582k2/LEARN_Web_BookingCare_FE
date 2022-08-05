import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../utils';
import { changeLanguageApp } from '../../store/actions';
import { withRouter } from 'react-router-dom';

class HomeHeader extends Component {
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    }

    returnToHome = () => {
        if(this.props.history) {
            this.props.history.push('/home');
        }
    }

    render() {
        let language = this.props.language;
        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className="fa-solid fa-bars"></i>
                            <a 
                                className='header-logo' 
                                onClick={() => {this.returnToHome()}}
                            ></a>
                        </div>
                        <div className='center-content'>
                            <a className='child-content' href=''>
                                <div><b>
                                    <FormattedMessage id='home-header.specialty'/>
                                </b></div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.search-doctor'/>
                                </div>
                            </a>
                            <a className='child-content' href=''>
                                <div><b>
                                    <FormattedMessage id='home-header.health-facility'/>
                                </b></div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.select-room'/>
                                </div>
                            </a>
                            <a className='child-content' href=''>
                                <div><b>
                                    <FormattedMessage id='home-header.doctor'/>
                                </b></div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.select-doctor'/>
                                </div>
                            </a>
                            <a className='child-content' href=''>
                                <div><b>
                                    <FormattedMessage id='home-header.fee'/>
                                </b></div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.check-health'/>
                                </div>
                            </a>
                        </div>
                        <div className='right-content'>
                            <a className='support' href=''>
                                <i className="fa-solid fa-circle-question"></i>
                                <FormattedMessage id='home-header.support' />
                            </a>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'} >
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true && 
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            <div className='title-1'>
                                <FormattedMessage id='banner.title-1' />
                            </div>
                            <div className='title-2'>
                                <FormattedMessage id='banner.title-2' />
                            </div>
                            <div className='search'>
                                <i className="fa-solid fa-magnifying-glass"></i>
                                <input type='text' className='' placeholder='Tìm truyên khoa khám bệnh' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='option-child'>
                                    <div className='icon-child icon-child1'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-1' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child2'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-2' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child3'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-3' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child4'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-4' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child5'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-5' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child6'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-6' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child7'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-7' />
                                    </div>
                                </div>
                                <div className='option-child'>
                                    <div className='icon-child icon-child8'>
                                        <div className='image-icon'></div>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child-8' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
