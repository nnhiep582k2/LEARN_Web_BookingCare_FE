import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import './BookingModal.scss';
import ProfileDoctor from '../ProfileDoctor.js';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookAppointment } from '../../../../services/userService';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { isThisTypeNode } from 'typescript';


class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            address: '',
            email: '',
            reason: '',
            dateOfBirth: '',
            selectedGender: '',
            genders: '',
            doctorId: '',
            timeType: '',
        }
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;

        if(data && data.length > 0) {
            data.map(item => {
                let object = {};
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object);
            })
        }
        return result;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if(this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            })
        }
        if(this.props.dataTime !== prevProps.dataTime) {
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }
    }

    handleOnChangeInput = (e, id) => {
        let valueInput = e.target.value;
        let stateCopy = { ...this.state };
        stateCopy[id] = valueInput;
        this.setState({
            ...stateCopy
        }); 
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            dateOfBirth: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption })
    }

    handleConfirmBooking = async () => {
        //validate input
        // !data.email || !data.doctorId || !data.timeType || !data.date
        let date = new Date(this.state.dateOfBirth).getTime();
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let res = await postPatientBookAppointment({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            address: this.state.address,
            email: this.state.email,
            reason: this.state.reason,
            date: this.props.dataTime.date,
            dateOfBirth: date,
            selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        });
        if(res && res.errCode === 0) {
            toast.success('Booking a new appointment successfully!');
            this.props.closeBookingModal();
        } else {
            toast.error('Booking a new appointment error!');
        }
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if(dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ?
            dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ? 
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY') : 
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`;
        }
        return '';
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if(dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI 
                ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`
            return name;
        }
        return '';
    }

    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = '';
        if(dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId;
        }
        // let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
        return (
            <Modal 
                isOpen={isOpenModal} 
                // toggle={} 
                className={'booking-modal-container'}
                size='lg'    
                centered
            >
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>
                            <FormattedMessage id='patient.booking-modal.title' />
                        </span>
                        <span 
                            className='right'
                            onClick={closeBookingModal}    
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        {/* {JSON.stringify(dataTime)} */}
                        <div className='doctor-infor'>
                            <ProfileDoctor 
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.fullName' />
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={this.state.fullName}    
                                    onChange={(e) => this.handleOnChangeInput(e, 'fullName')}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.phoneNumber' />
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={this.state.phoneNumber}    
                                    onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')}    
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.email' />
                                </label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={this.state.email}    
                                    onChange={(e) => this.handleOnChangeInput(e, 'email')}    
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.address' />
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={this.state.address}    
                                    onChange={(e) => this.handleOnChangeInput(e, 'address')}    
                                />
                            </div>
                            <div className='col-12 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.reason' />
                                </label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={this.state.reason}    
                                    onChange={(e) => this.handleOnChangeInput(e, 'reason')}    
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.dateOfBirth' />
                                </label>
                                <DatePicker 
                                    className="form-control"
                                    onChange={this.handleOnChangeDatePicker}
                                    value={this.state.dateOfBirth}
                                    // minDate={yesterday}
                                />
                            </div>
                            <div className='col-6 form-group'>
                                <label>
                                    <FormattedMessage id='patient.booking-modal.gender' />
                                </label>
                                <Select 
                                    value={this.state.selectedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button 
                            className='btn-booking-confirm'
                            onClick={() => this.handleConfirmBooking()}    
                        >
                            <FormattedMessage id='patient.booking-modal.confirm' />
                        </button>
                        <button 
                            className='btn-booking-cancel'
                            onClick={closeBookingModal}    
                        >
                            <FormattedMessage id='patient.booking-modal.cancel' />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
