import actionTypes from '../actions/actionTypes';
import { getAllCodeService } from '../../services/userService';

const initialState = {
    isLoadingGender: false,
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    allScheduleTime: [],

    allRequiredDoctorInfor: [],

}

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            let copyStateStart = {...state};
            copyStateStart.isLoadingGender = true;
            return {
                ...copyStateStart,
            }
        case actionTypes.FETCH_GENDER_SUCCESS:
            let copyState = {...state};
            copyState.genders = action.data;
            copyState.isLoadingGender = false;
            return {
                ...copyState,
            }
        case actionTypes.FETCH_GENDER_FAILED:
            let copyStateFailed = {...state};
            copyStateFailed.isLoadingGender = false;
            copyStateFailed.genders = [];
            return {
                ...copyStateFailed,
            }
        case actionTypes.FETCH_POSITION_SUCCESS:
            let copyStatePositionSuccess = {...state};
            copyStatePositionSuccess.positions = action.data;
            copyStatePositionSuccess.isLoadingGender = false;
            return {
                ...copyStatePositionSuccess,
            }
        case actionTypes.FETCH_POSITION_FAILED:
            let copyStatePositionFailed = {...state};
            copyStatePositionFailed.isLoadingGender = false;
            copyStatePositionFailed.positions = [];
            return {
                ...copyStatePositionFailed,
            }
        case actionTypes.FETCH_ROLE_SUCCESS:
            let copyStateRoleSuccess = {...state};
            copyStateRoleSuccess.roles = action.data;
            copyStateRoleSuccess.isLoadingGender = false;
            return {
                ...copyStateRoleSuccess,
            }
        case actionTypes.FETCH_ROLE_FAILED:
            let copyStateRoleFailed = {...state};
            copyStateRoleFailed.isLoadingGender = false;
            copyStateRoleFailed.roles = [];
            return {
                ...copyStateRoleFailed,
            }
        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            let copyStateGetAllUsersSuccess = {...state};
            copyStateGetAllUsersSuccess.users = action.users; 
            return {
                ...copyStateGetAllUsersSuccess,
            }
        case actionTypes.FETCH_ALL_USERS_FAILED:
            let copyStateGetAllUsersFailed = {...state};
            copyStateGetAllUsersFailed.users = [];
            return {
                ...copyStateGetAllUsersFailed,
            }
        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            let copyStateGetTopDoctorsSuccess = {...state};
            copyStateGetTopDoctorsSuccess.topDoctors = action.dataDoctors; 
            return {
                ...copyStateGetTopDoctorsSuccess,
            }
        case actionTypes.FETCH_TOP_DOCTOR_FAILED:
            let copyStateGetTopDoctorsFailed = {...state};
            copyStateGetTopDoctorsFailed.topDoctors = []; 
            return {
                ...copyStateGetTopDoctorsFailed,
            }
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            let copyStateGetAllDoctorsSuccess = {...state};
            copyStateGetAllDoctorsSuccess.allDoctors = action.dataDr; 
            return {
                ...copyStateGetAllDoctorsSuccess,
            }
        case actionTypes.FETCH_ALL_DOCTOR_FAILED:
            let copyStateGetAllDoctorsFailed = {...state};
            copyStateGetAllDoctorsFailed.allDoctors = []; 
            return {
                ...copyStateGetAllDoctorsFailed,
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            let copyStateGetAllScheduleSuccess = {...state};
            copyStateGetAllScheduleSuccess.allScheduleTime = action.dataTime; 
            return {
                ...copyStateGetAllScheduleSuccess,
            }
        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
            let copyStateGetAllSdheduleFailed = {...state};
            copyStateGetAllSdheduleFailed.allScheduleTime = []; 
            return {
                ...copyStateGetAllSdheduleFailed,
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            let copyStateGetAllRequiredDoctorInforSuccess = {...state};
            copyStateGetAllRequiredDoctorInforSuccess.allRequiredDoctorInfor = action.data; 
            return {
                ...copyStateGetAllRequiredDoctorInforSuccess,
            }
        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
            let copyStateGetAllRequiredDoctorInforFailed = {...state};
            copyStateGetAllRequiredDoctorInforFailed.allRequiredDoctorInfor = []; 
            return {
                ...copyStateGetAllRequiredDoctorInforFailed,
            }
        default:
            return state;
    }
}

export default adminReducer;