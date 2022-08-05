import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getSheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        }
    }

    async componentDidMount() {
        let allDays = this.getArrDays(this.props.language);
        if(this.props.doctorIdFromParent) {
            let res = await getSheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);    
            this.setState({
                allAvailableTime: res.data ? res.data : []
            });
        }
        this.setState({
            allDays: allDays,
        });
    }

    getArrDays = (language) => {
        let allDays = [];
        for(let i = 0; i < 7; i++) {
            let object = {};
            if(language === LANGUAGES.VI) {
                if(i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`; 
                    object.label = today; 
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi); 
                }
            } else {
                if(i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`; 
                    object.label = today; 
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }
            
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }
        return allDays;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays,
            });
        }
        if(this.props.doctorIdFromParent != prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            let res = await getSheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);    
            this.setState({
                allAvailableTime: res.data ? res.data : []
            });
        }
    }

    handleOnChangeSelect = async (e) => {
        if(this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = e.target.value;
            let res = await getSheduleDoctorByDate(doctorId, date);    
            if(res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                });
            }
            console.log('res schedule: ', res);
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
        console.log(time);
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>  
                        <select onChange={(e) => this.handleOnChangeSelect(e)}>
                            { allDays && allDays.length > 0 && 
                            allDays.map((item, index) => {
                                return (
                                    <option 
                                        key={index} 
                                        value={item.value}
                                        
                                    >{item.label}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <span>
                                <i className="fa-solid fa-calendar-days"></i>
                                <FormattedMessage id='patient.detail-doctor.schedule' />
                            </span>
                        </div>
                        <div className='time-content'>
                            {allAvailableTime && allAvailableTime.length > 0 ? 
                            <>
                                <div className='time-content-btns'>
                                    {
                                        allAvailableTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGES.VI ? 
                                            item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                            return (
                                                <button  
                                                    key={index}
                                                    className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >{timeDisplay}</button>
                                            )
                                        })
                                    }
                                </div>
                                <div className='book-free'>
                                    <span>
                                        <FormattedMessage id="patient.detail-doctor.choose" />
                                        <i className="fa-solid fa-hand-point-up"></i>
                                        <FormattedMessage id="patient.detail-doctor.book-free" />
                                    </span>
                                </div>
                            </>
                            :
                            <div className='no-schedule'>
                                <FormattedMessage id="patient.detail-doctor.no-schedule" />
                            </div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal = {isOpenModalBooking}
                    closeBookingModal = {this.closeBookingModal}
                    dataTime = {dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,

    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
