import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: null,
            description: '',
            listDoctors: [],
            hasOldData: false,

            // Save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listClinic: [],
            listSpecialty: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedClinic: '',
            selectedSpecialty: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '',
        };
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getRequiredDoctorInfor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            this.setState({
                listDoctors: dataSelect
            });
        }
        if(prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            });
        }
        if(prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
            });
        }
    }

    buildDataInputSelect = (data, type) => {
        let result = [];
        let { language } = this.props;
        if(data && data.length > 0) {
            if(type === 'USERS') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = (language === LANGUAGES.VI ? labelVi : labelEn);
                    object.value = item.id;
                    result.push(object);
                });
            }
            if(type === 'PRICE') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = (language === LANGUAGES.VI ? labelVi : labelEn);
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if(type === 'PAYMENT' || type === 'PROVINCE') {
                data.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi}`;
                    let labelEn = `${item.valueEn}`;
                    object.label = (language === LANGUAGES.VI ? labelVi : labelEn);
                    object.value = item.keyMap;
                    result.push(object);
                });
            }
            if(type === 'SPECIALTY') {
                data.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
            }
            if(type === 'CLINIC') {
                data.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object);
                });
            }
        }
        return result;
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html,
        });
    }

    handleSaveContentMarkdown = () => {
        let { hasOldData } = this.state;
        this.props.saveDetailDoctors({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            selectedPrice: this.state.selectedPrice.value,
            selectedPayment: this.state.selectedPayment.value,
            selectedProvince: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value
        });
        console.log(this.state);
    }

    handleChangeSelect = async (selectedDoctor) => {
        let res = await getDetailInforDoctor(selectedDoctor.value);
        let { listPayment, listProvince, listPrice, listSpecialty, listClinic } = this.state;
        if(res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '', 
                paymentId = '', priceId = '', provinceId = '', specialtyId = '',
                selectedPrice = '', selectedPayment = '', selectedProvince = '',
                selectedSpecialty = '', clinicId = '', selectedClinic = '';
            if(res.data.Doctor_Infor) {
                addressClinic = res.data.Doctor_Infor.addressClinic;
                nameClinic = res.data.Doctor_Infor.nameClinic;
                note = res.data.Doctor_Infor.note;
                priceId = res.data.Doctor_Infor.priceId;
                paymentId = res.data.Doctor_Infor.paymentId;
                provinceId = res.data.Doctor_Infor.provinceId;
                specialtyId = res.data.Doctor_Infor.specialtyId;
                clinicId = res.data.Doctor_Infor.clinicId;
                selectedPrice = listPrice.find(item => {
                    return item && item.value === priceId;
                });
                selectedPayment = listPayment.find(item => {
                    return item && item.value === paymentId;
                });
                selectedProvince = listProvince.find(item => {
                    return item && item.value === provinceId;
                });
                selectedSpecialty = listSpecialty.find(item => {
                    return item && item.value === specialtyId;
                });
                selectedClinic = listClinic.find(item => {
                    return item && item.value === clinicId;
                });
            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic
            });
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: '',
            });
        }
        this.setState({ selectedDoctor }, () =>
          console.log(`Res `, res)
        );
    };

    handleChangeSelectDoctorInfor = async (selectedDoctor, name) => {
        let stateName = name.name;
        let stateCopy = {...this.state};
        stateCopy[stateName] = selectedDoctor;
        this.setState({
            ...stateCopy
        })
        console.log(selectedDoctor);
    }

    handleOnChangeText = (e, id) => {
        let stateCopy = {...this.state};
        stateCopy[id] = e.target.value;
        this.setState({...stateCopy});
    }

    render() {
        let { hasOldData, listSpecialty } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id='admin.manage-doctor.title' />
                </div>
                <div className="more-infor">
                    <div className='content-left form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.select-doctor' />
                        </label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={this.handleChangeSelect}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor' />}
                        />
                    </div>
                    <div className='content-right form-group'>
                    <label>
                        <FormattedMessage id='admin.manage-doctor.intro' />
                    </label>
                        <textarea 
                            className="form-control" 
                            onChange={(e) => this.handleOnChangeText(e, 'description')}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className="doctor-infor-extra row">
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.price' />
                        </label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id='admin.manage-doctor.price' />}
                            name={'selectedPrice'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.payment' />
                        </label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id='admin.manage-doctor.payment' />}
                            name={'selectedPayment'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.province' />
                        </label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id='admin.manage-doctor.province' />}
                            name={'selectedProvince'}
                        />
                    </div>

                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.name-clinic' />
                        </label>
                        <input 
                            type="text" 
                            className="form-control" 
                            onChange={(e) => this.handleOnChangeText(e, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.address-clinic' />
                        </label>
                        <input 
                            type="text" 
                            className="form-control"
                            onChange={(e) => this.handleOnChangeText(e, 'addressClinic')}
                            value={this.state.addressClinic}    
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.note' />
                        </label>
                        <input 
                            type="text" 
                            className="form-control"
                            onChange={(e) => this.handleOnChangeText(e, 'note')}
                            value={this.state.note} 
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.specialty' />
                        </label>
                        <Select
                            value={this.state.selectedSpecialty}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={listSpecialty}
                            placeholder={<FormattedMessage id='admin.manage-doctor.specialty' />}
                            name='selectedSpecialty'
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>
                            <FormattedMessage id='admin.manage-doctor.select-clinic' />
                        </label>
                        <Select
                            value={this.state.selectedClinic}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id='admin.manage-doctor.select-clinic' />}
                            name='selectedClinic'
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <MdEditor 
                        style={{ height: '300px' }} 
                        renderHTML={text => mdParser.render(text)} 
                        onChange={this.handleEditorChange} 
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button 
                    className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                    onClick={() => this.handleSaveContentMarkdown()}
                >
                    {hasOldData === true ? 
                        <span>
                            <FormattedMessage id='admin.manage-doctor.save' />
                        </span> :
                        <span>
                            <FormattedMessage id='admin.manage-doctor.add' />
                        </span>
                    }
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getRequiredDoctorInfor: () => dispatch(actions.getRequiredDoctorInfor()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctors: (data) => dispatch(actions.saveDetailDoctors(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
