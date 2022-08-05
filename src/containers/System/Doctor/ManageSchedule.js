import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { CRUD_ACTIONS, LANGUAGES, dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from 'moment';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],  
            selectedDoctor: {},
            currentDate: '',
            rangeTime: []
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
        }
        if(prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            });
        }
        if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if(data && data.length > 0) {
                // data.map(item => {
                //     item.isSelected = false;
                //     return item;
                // })
                data = data.map(item => ({ ...item, isSelected: false }));
            }
            this.setState({ rangeTime: data });
        }
    }

    buildDataInputSelect = (data) => {
        let result = [];
        let { language } = this.props;
        if(data && data.length > 0) {
            data.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({ currentDate: date[0] });
    };

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if(rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if(item.id === time.id)
                    item.isSelected = !item.isSelected;
                return item;
            });
            this.setState({rangeTime});
        }
    };

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if(!currentDate) {
            toast.error('Invalid date!!');
            return;
        }
        if(selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor!!');
            return;
        }
        // let formattedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
        // let formattedDate = moment(currentDate).unix();
        let formattedDate = new Date(currentDate).getTime();

        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if(selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formattedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                });
            } else {
                toast.error('Invalid selected time!!');
                return;
            }
        }
        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate: formattedDate
        });
        if(res && res.errCode === 0) {
            toast.success('Save infor succeed!');
        } else {
            toast.error('Error method saveBulkScheduleDoctor!');
            console.log('Error method saveBulkScheduleDoctor! >>> res: ', res);
        }
    };

    render() {
        let { rangeTime } = this.state;
        let { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate()-1));

        return (
            <div className="manage-schedule-container">
                <div className="manage-schedule-title">
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label><FormattedMessage id='manage-schedule.choose-doctor' /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-md-6 form-group">
                            <label><FormattedMessage id='manage-schedule.choose-date' /></label>
                            <DatePicker 
                                className="form-control"
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 &&
                            rangeTime.map((item, index) => {
                                return (
                                    <button 
                                        onClick={() => this.handleClickBtnTime(item)}
                                        className={item.isSelected ? "btn btn-schedule active" : "btn btn-schedule"} 
                                        key={index}
                                    >
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}    
                                    </button>
                                ) 
                            })}
                        </div>
                        <div className='col-12'>
                            <button 
                                className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}    
                            >
                                <FormattedMessage id='manage-schedule.save' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
