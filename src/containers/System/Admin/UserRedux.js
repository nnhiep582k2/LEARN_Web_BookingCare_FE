import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: ''
        };
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }
        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }
        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }
        if(prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrPositions = this.props.positionRedux;
            let arrRoles = this.props.roleRedux;
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImgUrl: '',
            });
        }
    }

    handleOnChangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if(file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64
            });
        }
    }

    openPreviewImage = () => {
        if(!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true
        });
    }

    handleSaveUser = () => {
        let isValid = this.validateInput();
        if(isValid === false) return;
        let { action } = this.state;
        if(action === CRUD_ACTIONS.CREATE) {
            //fire redux create
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            });
        } 
        if(action === CRUD_ACTIONS.EDIT) {
            //fire redux edit user
            this.props.editAUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }
    }

    validateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'];
        for(let i = 0; i < arrCheck.length; i++) {
            if(!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Missing required parameters: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }

    onChangeInput = (e, id) => {
        let copyState = {...this.state};
        copyState[id] = e.target.value;
        this.setState({
            ...copyState,
        });
    }

    handleEditUserFromParent = (user) => {
        let imageBase64 = '';
        if(user.image) {
            imageBase64 = new Buffer(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: 'hardcode',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: '',
            previewImgUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
        });
    }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isLoadingGender = this.props.isLoadingGender;
        let { email, password, firstName, lastName, phoneNumber, 
            address, gender, position, role, avatar
        } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title'>User redux NNHIEP</div>
                <div className="user-redux-body">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'>
                                <FormattedMessage id='manage-user.add'/>
                            </div>
                            <div className='col-12'>
                                { isLoadingGender === true ? 'Loading genders...' : '' }
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.email'/></label>
                                <input 
                                    className='form-control' 
                                    type='email' 
                                    value={email} 
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    onChange={(e) => this.onChangeInput(e, 'email')}    
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.password'/></label>
                                <input 
                                    className='form-control' 
                                    type='password' 
                                    value={password}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    onChange={(e) => this.onChangeInput(e, 'password')}     
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.first-name'/></label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    value={firstName}    
                                    onChange={(e) => this.onChangeInput(e, 'firstName')} 
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.last-name'/></label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    value={lastName}    
                                    onChange={(e) => this.onChangeInput(e, 'lastName')} 
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.phone-number'/></label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    value={phoneNumber}    
                                    onChange={(e) => this.onChangeInput(e, 'phoneNumber')} 
                                />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id='manage-user.address'/></label>
                                <input 
                                    className='form-control' 
                                    type='text' 
                                    value={address}
                                    onChange={(e) => this.onChangeInput(e, 'address')}     
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.gender'/></label>
                                <select 
                                    className="form-control"
                                    onChange={(e) => this.onChangeInput(e, 'gender')}      
                                    value={gender}
                                >
                                    {genders && genders.length > 0 &&
                                    genders.map((gender, index) => {
                                        return (
                                            <option key={index} value={gender.keyMap}>
                                                {language === LANGUAGES.VI ? gender.valueVi : gender.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.position'/></label>
                                <select 
                                    className="form-control"
                                    onChange={(e) => this.onChangeInput(e, 'position')}     
                                    value={position}
                                >
                                    {positions && positions.length > 0 &&
                                    positions.map((position, index) => {
                                        return (
                                            <option key={index} value={position.keyMap}>
                                                {language === LANGUAGES.VI ? position.valueVi : position.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.role'/></label>
                                <select 
                                    className="form-control"
                                    onChange={(e) => this.onChangeInput(e, 'role')}          
                                    value={role}
                                >
                                    {roles && roles.length > 0 &&
                                    roles.map((role, index) => {
                                        return (
                                            <option key={index} value={role.keyMap}>
                                                {language === LANGUAGES.VI ? role.valueVi : role.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id='manage-user.image'/></label>
                                <div className='review-img-container'>
                                    <input type='file' id='previewImg' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)} 
                                    />
                                    <label className='label-upload' htmlFor='previewImg'>Tải ảnh
                                        <i className="fa-solid fa-upload"></i>
                                    </label>
                                    <div className='preview-img'
                                        style={{ backgroundImage: `url(${this.state.previewImgUrl})` }}
                                        onClick={() => this.openPreviewImage()}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button 
                                    className={
                                        this.state.action === CRUD_ACTIONS.EDIT ? 
                                        'btn btn-warning' : 'btn btn-primary'
                                    } 
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {
                                        this.state.action === CRUD_ACTIONS.EDIT ? 
                                        <FormattedMessage id='manage-user.edit'/>
                                        : <FormattedMessage id='manage-user.save'/>
                                    } 
                                </button>
                            </div>
                            <div className='col-12'>
                                <TableManageUser 
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                { this.state.isOpen === true && 
                    <Lightbox
                    mainSrc={this.state.previewImgUrl}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editAUserRedux: (data) => dispatch(actions.editAUser(data)),
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
