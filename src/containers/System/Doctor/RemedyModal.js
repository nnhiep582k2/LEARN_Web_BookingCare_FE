import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './RemedyModal.scss';
import _ from 'lodash';
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import moment from 'moment';
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from '../../../utils';


class RemedyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imageBase64: '',
        }
    }

    async componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email,
            })
        }
    }

    handleOnChangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if(file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            });
        }
    }

    handleOnChangeEmail = (e) => {
        this.setState({
            email: e.target.value,
        })
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state);
    }

    render() {
        let { isOpenModal, closeRemedyModal, dataModal, sendRemedy } = this.props;
        return (
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'    
                centered
            >
                <div className='modal-header'>
                    <h5 className='modal-title'>Gửi hóa đơn khám bệnh thành công</h5>
                    <button 
                        type='button' 
                        aria-label='close' 
                        className='close'
                        onClick={closeRemedyModal}    
                    >
                        <span aria-hidden='true' onClick={closeRemedyModal}>&times;</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>Email bệnh nhân:</label>
                            <input 
                                type='email' 
                                className='form-control' 
                                value={this.state.email} 
                                onChange={(e) => this.handleOnChangeEmail(e)}    
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Chọn file đơn thuốc:</label>
                            <input 
                                type='file' 
                                className='form-control-file' 
                                onChange={(e) => this.handleOnChangeImage(e)}    
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={() => this.handleSendRemedy()}>Send</Button>{' '}
                <Button color="secondary" onClick={closeRemedyModal}>Cancel</Button>
                </ModalFooter>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
