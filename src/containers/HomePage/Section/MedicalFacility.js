import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router-dom';

class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
        };
    }

    async componentDidMount() {
        let res = await getAllClinic();
        if(res && res.errCode === 0) {
            this.setState({
                dataClinics: res.data ? res.data : [],
            });
        }
        console.log(res);
    }

    componentDidUpdate(prevProps, prevState) {

    }

    handleViewDetailClinic = (clinic) => {
        if(this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    }
    
    render() {
        let { dataClinics } = this.state;
        return (
            <div className="section-medical-facility section-share">
                <div className="section-container">
                    <div className="section-header">
                        <span>Cơ sở y tế nổi bật</span>
                        <button>Tìm kiếm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataClinics && dataClinics.length > 0 && 
                                dataClinics.map((item, index) => {
                                    return (
                                        <div 
                                            className='section-customize' 
                                            key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        >
                                            <div 
                                                className='bg-image section-medical-facility'
                                                style={{ backgroundImage: `url(${item.image})` }}
                                            ></div>
                                            <div className='section-desc'>{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
