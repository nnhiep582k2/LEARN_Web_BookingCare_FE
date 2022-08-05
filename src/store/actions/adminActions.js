import { 
    getAllCodeService, createNewUserService, 
    getAllUsers, deleteUserService, 
    editUserService, getTopDoctorHomeService,
    getAllDoctors, saveDetailDoctor,
    getAllSpecialty, getAllClinic
} 
    from '../../services/userService';
import actionTypes from './actionTypes';
import { toast } from 'react-toastify';

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START
// })

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_GENDER_START
            });
            let res = await getAllCodeService('GENDER')
            if(res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch(e) {
            dispatch(fetchGenderFailed());
            console.log('fetchGenderFailed error ', e)
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('POSITION')
            if(res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch(e) {
            dispatch(fetchPositionFailed());
            console.log('fetchPositionFailed error ', e)
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService('ROLE');
            if(res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch(e) {
            dispatch(fetchRoleFailed());
            console.log('fetchRoleFailed error ', e)
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);
            if(res && res.errCode === 0) {
                toast.success('Created successfully!!');
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                dispatch(saveUserFailed());
            }
        } catch(e) {
            dispatch(saveUserFailed());
            console.log('saveUserFailed error ', e)
        }
    }
};

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
});

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
});

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers('All');
            if(res && res.errCode === 0) { 
                dispatch(fetchAllUsersSuccess(res.users.reverse()));
            } else {
                toast.error('Fetch all users error!!');
                dispatch(fetchAllUsersFailed());
            }
        } catch(e) {
            toast.error('Fetch all users error!!');
            dispatch(fetchAllUsersFailed());
            console.log('fetchRoleFailed error ', e)
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if(res && res.errCode === 0) {
                toast.success('Deleted successfully!!');
                dispatch(deleteAUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error('Deleted error!!');
                dispatch(deleteAUserFailed());
            }
        } catch(e) {
            toast.error('Deleted error!!');
            dispatch(deleteAUserFailed());
            console.log('saveUserFailed error ', e)
        }
    }
};

export const deleteAUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})

export const deleteAUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if(res && res.errCode === 0) {
                toast.success('Updated successfully!!');
                dispatch(editAUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                toast.error('Updated error!!');
                dispatch(editAUserFailed());
            }
        } catch(e) {
            toast.error('Updated error!!');
            dispatch(editAUserFailed());
            console.log('editAUserFailed error ', e)
        }
    }
};

export const editAUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
});

export const editAUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
});

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getTopDoctorHomeService('');    
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
                    dataDoctors: res.data
                });
            } else {
                dispatch({ type: actionTypes.FETCH_TOP_DOCTOR_FAILED });
            }
        } catch(e) {
            console.log('FETCH_TOP_DOCTOR_FAILED: ', e);
            dispatch({ type: actionTypes.FETCH_TOP_DOCTOR_FAILED });
        }
    }
}

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllDoctors();    
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
                    dataDr: res.data
                });
            } else {
                dispatch({ type: actionTypes.FETCH_ALL_DOCTOR_FAILED });
            }
        } catch(e) {
            console.log('FETCH_ALL_DOCTOR_FAILED: ', e);
            dispatch({ type: actionTypes.FETCH_ALL_DOCTOR_FAILED });
        }
    }
}

export const saveDetailDoctors = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveDetailDoctor(data);    
            if(res && res.errCode === 0) {
                toast.success('Saved Infor Detail Doctor Successfully!!');
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
                });
            } else {
                console.log('Error: ', res);
                toast.error('Saved Infor Detail Doctor Error!!');
                dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED });
            }
        } catch(e) {
            toast.error('Saved Infor Detail Doctor Error!!');
            console.log('SAVE_DETAIL_DOCTOR_FAILED: ', e);
            dispatch({ type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED });
        }
    }
}

export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("TIME");    
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data
                });
            } else {
                dispatch({ type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED });
            }
        } catch(e) {
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED: ', e);
            dispatch({ type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED });
        }
    }
}

export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START
            });
            let resPrice = await getAllCodeService('PRICE');
            let resPayment = await getAllCodeService('PAYMENT');
            let resProvince = await getAllCodeService('PROVINCE');
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();
            if(resPrice && resPrice.errCode === 0
                && resPayment && resPayment.errCode === 0
                && resProvince && resProvince.errCode === 0    
                && resSpecialty && resSpecialty.errCode === 0
                && resClinic && resClinic.errCode === 0
            ) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                    resSpecialty: resSpecialty.data,
                    resClinic: resClinic.data,
                }
                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch(e) {
            dispatch(fetchRequiredDoctorInforFailed());
            console.log('fetchRequiredDoctorInforFailed error ', e)
        }
    }
}

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})