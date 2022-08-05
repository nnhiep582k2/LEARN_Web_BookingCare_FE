import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Specialty.scss';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllSpecialty } from '../../../services/userService';
import { withRouter } from 'react-router-dom';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
        }
    }
    
    async componentDidMount() {
        let res = await getAllSpecialty();
        if(res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : [],
            })
        }
    }

    handleViewDetailSpecialty = (item) => {
        if(this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        return (
            <div className="section-specialty section-share">
                <div className="section-container">
                    <div className="section-header">
                        <span>
                            <FormattedMessage id="home-page.specialty-popular" />
                        </span>
                        <button>
                            <FormattedMessage id="home-page.more" />
                        </button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length > 0
                            && dataSpecialty.map((item, index) => {
                                return (
                                    <div 
                                        className='section-customize' 
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item)}
                                    >
                                        <div 
                                            className='bg-image section-specialty'
                                            style={{ backgroundImage: `url(${item.image})` }}  
                                        ></div>
                                        <div className='section-desc'>{item.name}</div>
                                    </div>
                                );
                            })}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
