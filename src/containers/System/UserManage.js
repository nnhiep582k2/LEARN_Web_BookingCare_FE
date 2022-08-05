import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';
import ModalEditUser from './ModalEditUser';

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        };
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    handleAddNewUser() {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('All');
        if(response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            });
        }
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if(response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                });
                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch(err) {
            console.log(err);
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if(res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch(err) {
            console.log(err);
        }
    }

    handleEditUser = (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        })

    }

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if(res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                });
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch(err) {
            console.log(err);
        }
    }

    render() {
        return (
            <div className="user-container">
                <ModalUser 
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser 
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleEditUserModal}
                        currentUser={this.state.userEdit}
                        editUser={this.doEditUser}
                    />
                }
                <div className="title text-center">Manage users</div>
                <div className='mx-2'>
                    <button 
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddNewUser()}    
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add new user
                    </button>
                </div>
                <div className="user-table mt-3 mx-2">
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.arrUsers && this.state.arrUsers.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <button 
                                                className='btn-edit'
                                                onClick={() => {this.handleEditUser(user)}}       
                                            >
                                                <i className="fa-solid fa-pencil"></i>
                                            </button>
                                            <button 
                                                className='btn-delete'
                                                onClick={() => {this.handleDeleteUser(user)}}    
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            }) 
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
